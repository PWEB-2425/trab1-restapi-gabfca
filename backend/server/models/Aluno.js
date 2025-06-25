const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: String,
  apelido: String,
  curso: String,
  anoCurricular: Number,
  id: Number
}, { _id: false }); // Disable _id since we're using our own id

const studentDataSchema = new mongoose.Schema({
  alunos: [alunoSchema],
  cursos: [{
    id: Number,
    nomeDoCurso: String
  }]
}, { collection: 'Students' }); // Explicitly set to your collection name

module.exports = mongoose.model('StudentData', studentDataSchema);