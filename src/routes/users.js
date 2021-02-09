const express = require('express');
const routes = express.Router();

// middlewares
const { verifyAdmin } = require('../app/middlewares/session')

// controllers
const UserController = require('../app/controllers/UserController')

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', verifyAdmin, UserController.index) // ok
routes.get('/create', verifyAdmin, UserController.create) // ok
routes.get('/:id', verifyAdmin, UserController.show) // ok
routes.get('/:id/edit', verifyAdmin, UserController.edit) // ok

routes.post('/', verifyAdmin, UserController.post) // ok
routes.put('/', verifyAdmin, UserController.put) // ok
routes.delete('/', verifyAdmin, UserController.delete) // ok


// // Rotas de perfil de um usuário logado
// routes.get('/', verifyAdmin, ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado








// routes.get('/', verifyAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
// routes.get('/create', verifyAdmin, UserController.formCreate) // Exibe formulário de cadastro do usuário
// routes.post('/', verifyAdmin, UserController.post) //Cadastrar um usuário
// // routes.put('/users', verifyAdmin, UserController.put) // Editar um usuário
// // routes.delete('/admin/users', UserController.delete) // Deletar um usuário
// routes.get("/:id/edit", verifyAdmin, UserController.edit);


module.exports = routes