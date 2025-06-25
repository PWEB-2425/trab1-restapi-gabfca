const StudentData = require('../models/Aluno');

exports.getAllCursos = async (req, res) => {
  const data = await StudentData.findOne({});
  res.json(data?.cursos || []);
};

exports.getCursoById = async (req, res) => {
  const cursoId = parseInt(req.params.id);
  const data = await StudentData.findOne({});
  const curso = data?.cursos?.find(c => c.id === cursoId);
  
  if (!curso) return res.status(404).json({ message: 'Curso não encontrado' });
  res.json(curso);
};

exports.createCurso = async (req, res) => {
  const data = await StudentData.findOne({}) || new StudentData({ alunos: [], cursos: [] });
  const newId = data.cursos.length > 0 ? Math.max(...data.cursos.map(c => c.id)) + 1 : 1;
  
  const newCurso = {
    id: newId,
    ...req.body
  };

  data.cursos.push(newCurso);
  await data.save();
  res.status(201).json(newCurso);
};

exports.updateCurso = async (req, res) => {
  const cursoId = parseInt(req.params.id);
  const data = await StudentData.findOne({});
  
  const cursoIndex = data.cursos.findIndex(c => c.id === cursoId);
  if (cursoIndex === -1) return res.status(404).json({ message: 'Curso não encontrado' });
  
  data.cursos[cursoIndex] = { ...data.cursos[cursoIndex], ...req.body };
  await data.save();
  res.json(data.cursos[cursoIndex]);
};

exports.deleteCurso = async (req, res) => {
  const cursoId = parseInt(req.params.id);
  const data = await StudentData.findOne({});
  
  const initialLength = data.cursos.length;
  data.cursos = data.cursos.filter(c => c.id !== cursoId);
  
  if (data.cursos.length === initialLength) {
    return res.status(404).json({ message: 'Curso não encontrado' });
  }
  
  await data.save();
  res.status(204).send();
};