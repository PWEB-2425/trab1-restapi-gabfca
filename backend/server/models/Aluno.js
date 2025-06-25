const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: String,
  apelido: String,
  curso: String,
  anoCurricular: Number,
  id: Number
}, { _id: false }); 


const studentDataSchema = new mongoose.Schema({
  alunos: [alunoSchema],
  cursos: [{
    id: Number,
    nomeDoCurso: String
  }]
}, { collection: 'Students' }); 

module.exports = mongoose.model('StudentData', studentDataSchema);