const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const { validateCourse, validateId, validate } = require('../middlewares/validation');

/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: API for managing cursos (courses)
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: List of cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 */
router.get('/', cursoController.getAllCursos);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a curso by ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the curso
 *     responses:
 *       200:
 *         description: Curso found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso not found
 */
router.get('/:id', validateId, validate, cursoController.getCursoById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       201:
 *         description: Curso created successfully
 */
router.post('/', validateCourse, validate, cursoController.createCurso);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a curso by ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the curso to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso updated successfully
 *       404:
 *         description: Curso not found
 */
router.put('/:id', [...validateId, ...validateCourse], validate, cursoController.updateCurso);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a curso by ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the curso to delete
 *     responses:
 *       204:
 *         description: Curso deleted successfully
 *       404:
 *         description: Curso not found
 */
router.delete('/:id', validateId, validate, cursoController.deleteCurso);

module.exports = router;
