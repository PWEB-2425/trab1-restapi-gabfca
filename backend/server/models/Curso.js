const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - nomeDoCurso
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único gerado pelo MongoDB
 *         nomeDoCurso:
 *           type: string
 *           description: Nome do curso
 *           minLength: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do curso
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do curso
 *       example:
 *         _id: "60b8c0f5e1d2c724d8f9a0c4"
 *         nomeDoCurso: "Matemática"
 *         createdAt: "2023-04-01T12:00:00Z"
 *         updatedAt: "2023-04-15T12:00:00Z"
 */

const cursoSchema = new mongoose.Schema({
  nomeDoCurso: {
    type: String,
    required: true,
    minlength: 2
  }
}, { timestamps: true });

module.exports = mongoose.model('Curso', cursoSchema);