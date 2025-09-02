# autenticacao-jwt
Implementação de autenticação baseada em JWT para APIs e serviços.

# 🔐 Express + Prisma + JWT Auth  

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![Prisma](https://img.shields.io/badge/Prisma-ORM-black?logo=prisma)](https://www.prisma.io/)  
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](./LICENSE)  

Projeto base utilizando **Node.js**, **TypeScript**, **Express** e **Prisma ORM** com autenticação **JWT**.  
Ideal como ponto de partida para desenvolvimento de APIs modernas e escaláveis.  

---

## 🚀 Tecnologias  

- [Node.js](https://nodejs.org/)  
- [Express](https://expressjs.com/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Prisma ORM](https://www.prisma.io/)  
- [JWT (JSON Web Token)](https://jwt.io/)  
- [Nodemon](https://nodemon.io/)  

---

## 📦 Instalação  

Se for clone o repositório e instale as dependências:  

```bash
npm install express prisma @prisma/client
npm install -D typescript @types/node @types/express ts-node nodemon


## 📔 Diário de Aula  

### 01/09  
- Criei as rotas de autenticação (registro e login).  
- Implementei a geração de **JWT** para autenticar usuários.  

**O que foi feito tecnicamente:**  
- Adicionei um controller de autenticação.  
- Criei middleware para gerar e validar JWT.  
- Atualizei o schema do Prisma para incluir o usuário.  

**Próximos passos:**  
- Implementar refresh token.  
- Criar testes para as rotas de login e registro.  

