const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const { validateCourse, validateId, validate } = require('../middlewares/validation');

/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: Operações relacionadas a cursos
 */

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos retornada com sucesso
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
 * /cursos/{id}:
 *   get:
 *     summary: Obtém um curso pelo ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Dados do curso retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Curso não encontrado
 */
router.get('/:id', validateId, validate, cursoController.getCursoById);

/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', validateCourse, validate, cursoController.createCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   put:
 *     summary: Atualiza um curso existente
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso para atualização
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Curso não encontrado
 */
router.put('/:id', [...validateId, ...validateCourse], validate, cursoController.updateCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Remove um curso pelo ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso para remoção
 *     responses:
 *       204:
 *         description: Curso removido com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Curso não encontrado
 */
router.delete('/:id', validateId, validate, cursoController.deleteCurso);

module.exports = router;
