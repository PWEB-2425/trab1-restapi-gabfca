const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const { validateCourse, validateId, validate } = require('../middlewares/validation');

router.get('/', cursoController.getAllCursos);
router.get('/:id', validateId, validate, cursoController.getCursoById);
router.post('/', validateCourse, validate, cursoController.createCurso);
router.put('/:id', [...validateId, ...validateCourse], validate, cursoController.updateCurso);
router.delete('/:id', validateId, validate, cursoController.deleteCurso);

module.exports = router;