const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());
app.use(cookieParser());

// Pasta base de uploads
const baseUploadDir = path.join(__dirname, 'uploads');
if(!fs.existsSync(baseUploadDir)) fs.mkdirSync(baseUploadDir);

// Arquivo de usuários
const usersFile = path.join(__dirname,'users.json');
if(!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([]));

// Funções auxiliares
function readUsers(){ return JSON.parse(fs.readFileSync(usersFile)); }
function saveUsers(users){ fs.writeFileSync(usersFile, JSON.stringify(users)); }

// Middleware de autenticação
function auth(req,res,next){
  if(req.cookies.auth){
    req.username = req.cookies.auth;
    next();
  } else res.status(401).send('Não autorizado');
}

// Criar conta
app.post('/register',(req,res)=>{
  const {username,password}=req.body;
  const users = readUsers();
  if(users.find(u=>u.username===username)) return res.json({success:false,msg:'Usuário já existe!'});
  users.push({username,password});
  saveUsers(users);

  // Criar pasta exclusiva do usuário
  const userDir = path.join(baseUploadDir, username);
  if(!fs.existsSync(userDir)) fs.mkdirSync(userDir);

  res.json({success:true});
});

// Login
app.post('/login',(req,res)=>{
  const {username,password}=req.body;
  const users = readUsers();
  if(users.find(u=>u.username===username && u.password===password)){
    res.cookie('auth', username, {httpOnly:true});
    res.json({success:true});
  } else res.json({success:false});
});

// Configuração do multer por usuário, preservando nome original
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(baseUploadDir, req.username);
    if(!fs.existsSync(userDir)) fs.mkdirSync(userDir);
    cb(null, userDir);
  },
  filename: (req,file,cb) => cb(null, file.originalname)
});
const upload = multer({storage});

// Upload
app.post('/upload',auth,upload.single('file'),(req,res)=>{
  if(!req.file) return res.status(400).send('Nenhum arquivo enviado!');
  res.send(`Arquivo "${req.file.originalname}" enviado com sucesso!`);
});

// Listar arquivos
app.get('/files',auth,(req,res)=>{
  const userDir = path.join(baseUploadDir, req.username);
  if(!fs.existsSync(userDir)) fs.mkdirSync(userDir);
  const files = fs.readdirSync(userDir);
  res.json(files);
});

// Download
app.get('/files/:name',auth,(req,res)=>{
  const filePath = path.join(baseUploadDir, req.username, req.params.name);
  if(!fs.existsSync(filePath)) return res.status(404).send('Arquivo não encontrado');
  res.download(filePath);
});

const PORT = process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Servidor rodando na porta ${PORT}`));
