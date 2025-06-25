const mongoose = require('mongoose');


const cursoSchema = new mongoose.Schema({
  nomeDoCurso: {
    type: String,
    required: true,
    minlength: 2
  }
}, { timestamps: true });

module.exports = mongoose.model('Curso', cursoSchema);