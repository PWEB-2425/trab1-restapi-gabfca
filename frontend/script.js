// URL da API onde estão disponíveis os dados dos alunos
const STUDENTS_API_URL = 'http://localhost:3001/alunos';

// URL da API para obtenção dos cursos disponíveis
const COURSES_API_URL = 'http://localhost:3001/cursos';

// Objecto que agrupa e referencia os principais elementos do DOM usados na aplicação
const elements = {
  tbody: document.getElementById('students-tbody'),          // Corpo da tabela onde os alunos serão apresentados
  form: document.getElementById('student-form'),             // Formulário de adição/edição de aluno
  formTitle: document.getElementById('form-title'),          // Título do formulário, para indicar modo de operação
  id: document.getElementById('student-id'),                 // Campo oculto para guardar o ID do aluno (para edições)
  nome: document.getElementById('nome'),                      // Campo para o nome do aluno
  apelido: document.getElementById('apelido'),                // Campo para o apelido do aluno
  curso: document.getElementById('curso'),                    // Dropdown para seleção do curso do aluno
  anoCurricular: document.getElementById('anoCurricular'),    // Campo para o ano curricular do aluno
  submitBtn: document.querySelector('#student-form button[type="submit"]'), // Botão para submeter o formulário
};

// Array para armazenar os cursos válidos obtidos da API
let validCourses = [];

/**
 * Função assíncrona que obtém a lista de cursos disponíveis da API
 * e preenche o elemento <select> do curso com as opções correspondentes.
 * Caso não existam cursos, atualiza o select para mostrar uma mensagem informativa.
 */
async function fetchAndPopulateCourses() {
  try {
    const response = await fetch(COURSES_API_URL);

    // Verifica se a resposta da API foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Falha ao carregar os cursos: ${response.status} ${response.statusText}`);
    }

    const courses = await response.json();

    // Se a resposta não for um array válido ou estiver vazia, mostra mensagem e limpa cursos válidos
    if (!Array.isArray(courses) || courses.length === 0) {
      elements.curso.innerHTML = '<option value="">Nenhum curso disponível</option>';
      validCourses = [];
      return;
    }

    // Processa os dados recebidos para extrair os nomes dos cursos
    validCourses = courses.map(course => (typeof course === 'object' && course.nome ? course.nome : course));

    // Atualiza o <select> com as opções de cursos válidos
    elements.curso.innerHTML = validCourses
      .map(courseName => `<option value="${courseName}">${courseName}</option>`)
      .join('');
  } catch (error) {
    console.error('Erro ao obter cursos:', error);
    alert(`Erro ao carregar cursos: ${error.message}`);
  }
}

/**
 * Valida os dados do aluno fornecidos, assegurando que cumprem os critérios mínimos.
 * Retorna um array contendo as mensagens de erro encontradas durante a validação.
 * @param {Object} student - Objeto com os dados do aluno a validar.
 * @returns {string[]} Lista de mensagens de erro (vazia se válido).
 */
function validateStudent(student) {
  const errors = [];

  // Validação do nome: obrigatório e com pelo menos 2 caracteres
  if (!student.nome || student.nome.trim().length < 2) {
    errors.push('Nome deve ter ao menos 2 caracteres.');
  }

  // Validação do apelido: obrigatório e com pelo menos 2 caracteres
  if (!student.apelido || student.apelido.trim().length < 2) {
    errors.push('Apelido deve ter ao menos 2 caracteres.');
  }

  // Validação do curso: deve ser um dos cursos válidos carregados da API
  if (!student.curso || !validCourses.includes(student.curso)) {
    errors.push('Curso inválido.');
  }

  // Validação do ano curricular: deve ser um inteiro entre 1 e 12
  if (
    typeof student.anoCurricular !== 'number' ||
    !Number.isInteger(student.anoCurricular) ||
    student.anoCurricular < 1 ||
    student.anoCurricular > 12
  ) {
    errors.push('Ano Curricular deve ser um número inteiro entre 1 e 12.');
  }

  return errors;
}

/**
 * Função assíncrona que obtém a lista atualizada de alunos da API
 * e invoca a renderização da tabela com os dados recebidos.
 */
async function fetchStudents() {
  try {
    const response = await fetch(STUDENTS_API_URL);

    if (!response.ok) {
      throw new Error(`Falha ao carregar alunos: ${response.status} ${response.statusText}`);
    }

    const students = await response.json();
    renderStudentTable(students);
  } catch (error) {
    console.error('Erro ao obter alunos:', error);
    alert(`Erro ao carregar alunos: ${error.message}`);
  }
}

/**
 * Renderiza a lista de alunos na tabela, inserindo as linhas correspondentes
 * no corpo da tabela HTML.
 * @param {Array} students - Array de objetos aluno a apresentar.
 */
function renderStudentTable(students) {
  if (!Array.isArray(students) || students.length === 0) {
    elements.tbody.innerHTML = '<tr><td colspan="5">Nenhum aluno encontrado.</td></tr>';
    return;
  }

  // Concatena as linhas HTML para cada aluno e atualiza o corpo da tabela
  elements.tbody.innerHTML = students.map(createStudentRowHTML).join('');
}

/**
 * Cria a string HTML que representa uma linha da tabela para um aluno.
 * Inclui botões para editar e eliminar o respetivo aluno.
 * @param {Object} student - Dados do aluno.
 * @returns {string} Código HTML da linha da tabela.
 */
function createStudentRowHTML({ id, nome, apelido, curso, anoCurricular }) {
  return `
    <tr>
      <td>${nome}</td>
      <td>${apelido}</td>
      <td>${curso}</td>
      <td>${anoCurricular}</td>
      <td>
        <button class="action-btn edit" data-id="${id}" aria-label="Editar aluno ${nome}">✏️</button>
        <button class="action-btn delete" data-id="${id}" aria-label="Excluir aluno ${nome}">🗑️</button>
      </td>
    </tr>
  `;
}

/**
 * Carrega os dados de um aluno específico a partir do seu ID
 * e preenche o formulário para possibilitar a edição desses dados.
 * @param {string} id - Identificador único do aluno.
 */
async function loadStudentToForm(id) {
  try {
    const response = await fetch(`${STUDENTS_API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Aluno não encontrado (ID: ${id}).`);
    }

    const student = await response.json();

    // Preenche os campos do formulário com os dados do aluno
    elements.id.value = student.id || '';
    elements.nome.value = student.nome || '';
    elements.apelido.value = student.apelido || '';
    elements.curso.value = student.curso || '';
    elements.anoCurricular.value = student.anoCurricular || '';
    elements.formTitle.textContent = 'Editar Aluno';
    elements.submitBtn.textContent = 'Atualizar';
  } catch (error) {
    console.error('Erro ao carregar aluno:', error);
    alert(error.message);
  }
}

/**
 * Elimina um aluno pelo seu ID, solicitando confirmação ao utilizador antes de proceder.
 * Após a exclusão, atualiza a lista de alunos apresentada.
 * @param {string} id - Identificador do aluno a eliminar.
 */
async function deleteStudent(id) {
  const confirmed = confirm('Tem certeza de que deseja excluir este aluno?');
  if (!confirmed) return;

  try {
    const response = await fetch(`${STUDENTS_API_URL}/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error(`Falha ao excluir aluno (ID: ${id}).`);
    }

    await fetchStudents();
  } catch (error) {
    console.error('Erro ao eliminar aluno:', error);
    alert(error.message);
  }
}

/**
 * Manipulador do evento de submissão do formulário.
 * Trata tanto a adição de novo aluno como a atualização de um aluno existente.
 * Realiza validação dos dados antes de os enviar para a API.
 * @param {Event} event - Evento de submissão do formulário.
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const id = elements.id.value;
  const student = {
    nome: elements.nome.value.trim(),
    apelido: elements.apelido.value.trim(),
    curso: elements.curso.value.trim(),
    anoCurricular: Number.parseInt(elements.anoCurricular.value, 10),
  };

  // Validação dos dados do aluno
  const errors = validateStudent(student);

  if (errors.length > 0) {
    alert(`Erros:\n${errors.join('\n')}`);
    return;
  }

  elements.submitBtn.disabled = true;

  try {
    const response = await fetch(`${STUDENTS_API_URL}${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao salvar aluno: ${response.status} ${response.statusText} - ${errorText}`);
    }

    resetForm();
    await fetchStudents();
  } catch (error) {
    console.error('Erro ao submeter formulário:', error);
    alert(error.message);
  } finally {
    elements.submitBtn.disabled = false;
  }
}

/**
 * Repor o formulário ao seu estado inicial, pronto para adicionar um novo aluno.
 * Limpa todos os campos e atualiza o título e botão do formulário.
 */
function resetForm() {
  elements.form.reset();
  elements.id.value = '';
  elements.formTitle.textContent = 'Adicionar Novo Aluno';
  elements.submitBtn.textContent = 'Salvar';
}

/**
 * Inicializa os event listeners para o funcionamento da aplicação,
 * incluindo clique nos botões da tabela e submissão do formulário.
 */
function initializeEventListeners() {
  elements.tbody.addEventListener('click', event => {
    const id = event.target.dataset.id;
    if (!id) return;

    if (event.target.classList.contains('edit')) {
      loadStudentToForm(id);
    } else if (event.target.classList.contains('delete')) {
      deleteStudent(id);
    }
  });

  elements.form.addEventListener('submit', handleFormSubmit);
}

/**
 * Função inicial que arranca a aplicação:
 * configura event listeners, carrega os cursos e alunos da API.
 */
async function initialize() {
  initializeEventListeners();
  await fetchAndPopulateCourses();
  await fetchStudents();
}

// Inicia a aplicação
initialize();
