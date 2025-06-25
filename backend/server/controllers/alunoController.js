const StudentData = require('../models/Aluno');

// Helper function to get the document containing alunos array
async function getStudentDocument() {
  return await StudentData.findOne({});
}

// Helper function to get next available ID
async function getNextAlunoId() {
  const data = await getStudentDocument();
  if (!data || !data.alunos || data.alunos.length === 0) return 1;
  return Math.max(...data.alunos.map(aluno => aluno.id)) + 1;
}

exports.getAllAlunos = async (req, res, next) => {
  try {
    const data = await getStudentDocument();
    if (!data || !data.alunos) {
      return res.status(404).json({ message: 'No alunos found' });
    }
    res.json(data.alunos);
  } catch (error) {
    next(error);
  }
};

exports.getAlunoById = async (req, res, next) => {
  try {
    const data = await getStudentDocument();
    if (!data || !data.alunos) {
      return res.status(404).json({ message: 'No alunos found' });
    }
    
    const aluno = data.alunos.find(a => a.id === parseInt(req.params.id, 10));
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    
    res.json(aluno);
  } catch (error) {
    next(error);
  }
};

exports.createAluno = async (req, res, next) => {
  try {
    const newAluno = {
      id: await getNextAlunoId(),
      ...req.body
    };

    const result = await StudentData.updateOne(
      {},
      { $push: { alunos: newAluno } },
      { upsert: true }
    );

    res.status(201).json(newAluno);
  } catch (error) {
    next(error);
  }
};

exports.updateAluno = async (req, res, next) => {
  try {
    const alunoId = parseInt(req.params.id);
    const updates = req.body;

    const data = await getStudentDocument();
    if (!data || !data.alunos) {
      return res.status(404).json({ message: 'No alunos found' });
    }

    const alunoIndex = data.alunos.findIndex(a => a.id === alunoId);
    if (alunoIndex === -1) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Create the update object dynamically based on provided fields
    const updateObj = {};
    for (const [key, value] of Object.entries(updates)) {
      updateObj[`alunos.$.${key}`] = value;
    }

    const result = await StudentData.updateOne(
      { "alunos.id": alunoId },
      { $set: updateObj }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Return the updated aluno
    const updatedData = await getStudentDocument();
    const updatedAluno = updatedData.alunos.find(a => a.id === alunoId);
    res.json(updatedAluno);
  } catch (error) {
    next(error);
  }
};

exports.deleteAluno = async (req, res, next) => {
  try {
    const alunoId = parseInt(req.params.id);

    const result = await StudentData.updateOne(
      {},
      { $pull: { alunos: { id: alunoId } } }
    );


    res.status(204).send();
  } catch (error) {
    next(error);
  }
};