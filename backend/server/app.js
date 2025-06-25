const express = require('express');
const connectDB = require('./config/db');
const alunoRoutes = require('./routes/alunoRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

connectDB();

require('./config/server')(app);

app.use(cors());
app.use('/alunos', alunoRoutes);
app.use('/cursos', cursoRoutes);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Alunos e Cursos',
    version: '1.0.0',
    description: 'Documentação da API REST para gestao de alunos e cursos',
  },
  servers: [
    {
      url: 'http://localhost:3001',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './models/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available on http://localhost:${PORT}/api-docs`);
});

process.on('SIGINT', async () => {
  await require('mongoose').connection.close();
  process.exit();
});
