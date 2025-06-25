const express = require('express');
const connectDB = require('./config/db');
const alunoRoutes = require('./routes/alunoRoutes');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();
const cors = require('cors'); 

connectDB();

require('./config/server')(app);

app.use(cors());
app.use('/alunos', alunoRoutes);
app.use('/cursos', cursoRoutes);  


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await require('mongoose').connection.close();
  process.exit();
});