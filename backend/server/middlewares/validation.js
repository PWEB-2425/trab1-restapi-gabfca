const { body, param, validationResult } = require('express-validator');

exports.validateStudent = [
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome must be at least 2 characters'),
  body('apelido').trim().isLength({ min: 2 }).withMessage('Apelido must be at least 2 characters'),
  body('curso').isString().withMessage('Curso must be a string'),
  body('anoCurricular').isInt({ min: 1, max: 12 }).withMessage('AnoCurricular must be between 1 and 12')
];

exports.validateCourse = [
  body('nomeDoCurso').trim().isLength({ min: 2 }).withMessage('NomeDoCurso must be at least 2 characters')
];

exports.validateId = [
  param('id').isMongoId().withMessage('ID must be a valid MongoDB ID')
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};