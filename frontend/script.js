const STUDENTS_API_URL = 'http://localhost:3001/alunos';
const COURSES_API_URL = 'http://localhost:3001/cursos';

const elements = {
  tbody: document.getElementById('students-tbody'),             
  form: document.getElementById('student-form'),                 
  formTitle: document.getElementById('form-title'),              
  id: document.getElementById('student-id'),                      
  nome: document.getElementById('nome'),                         
  apelido: document.getElementById('apelido'),                   
  curso: document.getElementById('curso'),                        
  anoCurricular: document.getElementById('anoCurricular'),        
  submitBtn: document.querySelector('#student-form button[type="submit"]'), 
};

let validCourses = [];

async function fetchAndPopulateCourses() {
  try {
    const response = await fetch(COURSES_API_URL);
    if (!response.ok) throw new Error(`Falha ao carregar os cursos: ${response.status} ${response.statusText}`);

    const courses = await response.json();

    if (!Array.isArray(courses) || courses.length === 0) {
      validCourses = [];
      elements.curso.innerHTML = '<option value="">Nenhum curso disponível</option>';
      return;
    }

    validCourses = courses.map(course =>
      typeof course === 'object' && course.nomeDoCurso ? course.nomeDoCurso : course
    );

    // Populate the <select> element with options
    elements.curso.innerHTML = '<option value="">-- Selecionar curso --</option>' +
      validCourses.map(courseName => `<option value="${courseName}">${courseName}</option>`).join('');
  } catch (error) {
    console.error('Erro ao obter cursos:', error);
    alert(`Erro ao carregar cursos: ${error.message}`);
  }
}

function populateYearOptions() {
  elements.anoCurricular.innerHTML = '';
  for (let year = 1; year <= 12; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    elements.anoCurricular.appendChild(option);
  }
}

function validateStudent(student) {
  const errors = [];

  if (!student.nome || student.nome.trim().length < 2) errors.push('Nome deve ter ao menos 2 caracteres.');
  if (!student.apelido || student.apelido.trim().length < 2) errors.push('Apelido deve ter ao menos 2 caracteres.');
  if (!student.curso || !validCourses.includes(student.curso)) errors.push('Curso inválido.');
  if (
    typeof student.anoCurricular !== 'number' ||
    !Number.isInteger(student.anoCurricular) ||
    student.anoCurricular < 1 ||
    student.anoCurricular > 12
  ) errors.push('Ano Curricular deve ser um número inteiro entre 1 e 12.');

  return errors;
}

async function fetchStudents() {
  try {
    const response = await fetch(STUDENTS_API_URL);
    if (!response.ok) throw new Error(`Falha ao carregar alunos: ${response.status} ${response.statusText}`);
    const students = await response.json();
    renderStudentTable(students);
  } catch (error) {
    console.error('Erro ao obter alunos:', error);
    alert(`Erro ao carregar alunos: ${error.message}`);
  }
}

function renderStudentTable(students) {
  if (!Array.isArray(students) || students.length === 0) {
    elements.tbody.innerHTML = '<tr><td colspan="5">Nenhum aluno encontrado.</td></tr>';
    return;
  }

  elements.tbody.innerHTML = students.map(createStudentRowHTML).join('');
}

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

async function loadStudentToForm(id) {
  try {
    const response = await fetch(`${STUDENTS_API_URL}/${id}`);
    if (!response.ok) throw new Error(`Aluno não encontrado (ID: ${id}).`);

    const student = await response.json();

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

async function deleteStudent(id) {
  const confirmed = confirm('Tem certeza de que deseja excluir este aluno?');
  if (!confirmed) return;

  try {
    const response = await fetch(`${STUDENTS_API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Falha ao excluir aluno (ID: ${id}).`);

    await fetchStudents();
  } catch (error) {
    console.error('Erro ao eliminar aluno:', error);
    alert(error.message);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const id = elements.id.value;
  const student = {
    nome: elements.nome.value.trim(),
    apelido: elements.apelido.value.trim(),
    curso: elements.curso.value.trim(),
    anoCurricular: Number.parseInt(elements.anoCurricular.value, 10),
  };

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

function resetForm() {
  elements.form.reset();
  elements.id.value = '';
  elements.formTitle.textContent = 'Adicionar Novo Aluno';
  elements.submitBtn.textContent = 'Salvar';
}

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

async function initialize() {
  populateYearOptions();
  initializeEventListeners();
  await fetchAndPopulateCourses();
  await fetchStudents();
}

initialize();
