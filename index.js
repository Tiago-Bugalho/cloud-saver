const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

// Pasta de uploads na raiz
const upload = multer({ dest: 'uploads/' });

// Endpoint de upload
app.post('/upload', upload.single('file'), (req, res) => {
  res.send(`Arquivo ${req.file.originalname} enviado com sucesso!`);
});

// Endpoint para listar arquivos
app.get('/files', (req, res) => {
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (err) return res.status(500).send('Erro ao ler arquivos');
    res.json(files);
  });
});

// Endpoint para baixar arquivos
app.get('/files/:name', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.name);
  res.download(filePath);
});

// Rodar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
