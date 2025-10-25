# CloudDrive - Sistema de Armazenamento Pessoal na Nuvem

## Visão Geral
CloudDrive é um sistema de armazenamento de arquivos na nuvem pessoal, onde cada usuário possui sua própria área de armazenamento com quotas definidas.

## Funcionalidades Principais
- Autenticação de usuários com registro e login
- Upload de arquivos com drag-and-drop
- Download de arquivos
- Exclusão de arquivos
- Sistema de quotas de armazenamento
- Interface responsiva com tema claro/escuro
- Sidebar com navegação e indicador de armazenamento

## Estrutura do Projeto

### Backend
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados (via Neon)
- **Passport.js** - Autenticação
- **Multer** - Upload de arquivos
- **Bcrypt** - Hash de senhas

### Frontend
- **React** - UI framework
- **Wouter** - Roteamento
- **TanStack Query** - Gerenciamento de estado e cache
- **Shadcn UI** - Componentes de UI
- **Tailwind CSS** - Estilização

## Schema do Banco de Dados

### Tabela `users`
- `id` (varchar, UUID) - Chave primária
- `username` (text) - Nome de usuário único
- `password` (text) - Senha hasheada
- `storageQuota` (bigint) - Quota de armazenamento em bytes
- `storageUsed` (bigint) - Espaço usado em bytes

### Tabela `files`
- `id` (varchar, UUID) - Chave primária
- `userId` (varchar) - Referência ao usuário
- `name` (text) - Nome do arquivo
- `size` (bigint) - Tamanho em bytes
- `mimeType` (text) - Tipo MIME
- `path` (text) - Caminho no filesystem
- `uploadedAt` (timestamp) - Data de upload

## Regras de Negócio

### Quotas de Armazenamento
- Usuários normais: 15GB (15 * 1024 * 1024 * 1024 bytes)
- Usuário especial "tiago" (senha: 4111): 100GB (100 * 1024 * 1024 * 1024 bytes)

### Armazenamento de Arquivos
- Arquivos são armazenados no diretório `/uploads`
- Cada usuário tem sua própria pasta: `/uploads/{userId}/`
- Nomes de arquivos são únicos usando timestamp + random

## APIs

### Autenticação
- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/me` - Obter dados do usuário logado

### Arquivos
- `GET /api/files` - Listar arquivos do usuário
- `POST /api/files/upload` - Upload de arquivo
- `GET /api/files/:id/download` - Download de arquivo
- `DELETE /api/files/:id` - Excluir arquivo

## Variáveis de Ambiente
- `DATABASE_URL` - URL de conexão PostgreSQL
- `SESSION_SECRET` - Chave secreta para sessions
- `PORT` - Porta do servidor (padrão: 5000)
- `NODE_ENV` - Ambiente (development/production)

## Comandos Úteis
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run db:push` - Sincroniza schema do banco de dados
- `npm run db:push --force` - Força sincronização do schema

## Estrutura de Pastas
```
/client - Frontend React
  /src
    /components - Componentes React
    /pages - Páginas da aplicação
    /lib - Utilitários e configurações
/server - Backend Express
  index.ts - Ponto de entrada
  routes.ts - Rotas da API
  auth.ts - Configuração de autenticação
  storage.ts - Interface de armazenamento
  db.ts - Configuração do banco de dados
/shared - Código compartilhado entre frontend e backend
  schema.ts - Schema do banco e validações Zod
/uploads - Diretório de arquivos enviados (não versionado)
```

## Notas Técnicas
- Autenticação usa sessions armazenadas no PostgreSQL
- Senhas são hasheadas com bcrypt (10 rounds)
- Upload de arquivos usa multipart/form-data
- Frontend usa React Query para cache e invalidação
- Suporta múltiplos uploads simultâneos
