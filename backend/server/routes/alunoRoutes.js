const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: API for managing students (alunos)
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: A list of all alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aluno'
 */
router.get('/', alunoController.getAllAlunos);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get an aluno by ID
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the aluno
 *     responses:
 *       200:
 *         description: Aluno found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno not found
 */
router.get('/:id', alunoController.getAlunoById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       201:
 *         description: Aluno created successfully
 */
router.post('/', alunoController.createAluno);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update an existing aluno
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the aluno to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       200:
 *         description: Aluno updated successfully
 *       404:
 *         description: Aluno not found
 */
router.put('/:id', alunoController.updateAluno);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete an aluno by ID
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the aluno to delete
 *     responses:
 *       204:
 *         description: Aluno deleted successfully
 *       404:
 *         description: Aluno not found
 */
router.delete('/:id', alunoController.deleteAluno);

module.exports = router;
