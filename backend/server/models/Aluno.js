const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: String,
  apelido: String,
  curso: String,
  anoCurricular: Number,
  id: Number
}, { _id: false }); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Aluno:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome completo do aluno
 *         apelido:
 *           type: string
 *           description: Apelido do aluno
 *         curso:
 *           type: string
 *           description: Curso que o aluno está matriculado
 *         anoCurricular:
 *           type: integer
 *           description: Ano curricular do aluno
 *         id:
 *           type: integer
 *           description: Identificador único do aluno
 *       example:
 *         nome: "João Silva"
 *         apelido: "Joca"
 *         curso: "Engenharia"
 *         anoCurricular: 2
 *         id: 12345
 * 
 *     Curso:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único do curso
 *         nomeDoCurso:
 *           type: string
 *           description: Nome do curso
 *       example:
 *         id: 1
 *         nomeDoCurso: "Engenharia"
 */
const studentDataSchema = new mongoose.Schema({
  alunos: [alunoSchema],
  cursos: [{
    id: Number,
    nomeDoCurso: String
  }]
}, { collection: 'Students' }); 

module.exports = mongoose.model('StudentData', studentDataSchema);