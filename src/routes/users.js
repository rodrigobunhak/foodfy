const express = require('express');
const routes = express.Router();

// middlewares
const { verifyAdmin, verifyUserAutenticad } = require('../app/middlewares/session')

// controllers
const UserController = require('../app/controllers/UserController');
const ProfileController = require('../app/controllers/ProfileController');


// Rotas de perfil de um usuário logado
routes.get('/profile', verifyUserAutenticad, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', verifyUserAutenticad, ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', verifyUserAutenticad, verifyAdmin, UserController.index) // ok
routes.get('/create', verifyUserAutenticad, verifyAdmin, UserController.create) // ok
routes.get('/:id', verifyUserAutenticad, verifyAdmin, UserController.show) // ok
routes.get('/:id/edit', verifyUserAutenticad, verifyAdmin, UserController.edit) // ok

routes.post('/', verifyUserAutenticad, verifyAdmin, UserController.post) // ok
routes.put('/', verifyUserAutenticad, verifyAdmin, UserController.put) // ok
routes.delete('/', verifyUserAutenticad, verifyAdmin, UserController.delete) // ok











// routes.get('/', verifyAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
// routes.get('/create', verifyAdmin, UserController.formCreate) // Exibe formulário de cadastro do usuário
// routes.post('/', verifyAdmin, UserController.post) //Cadastrar um usuário
// // routes.put('/users', verifyAdmin, UserController.put) // Editar um usuário
// // routes.delete('/admin/users', UserController.delete) // Deletar um usuário
// routes.get("/:id/edit", verifyAdmin, UserController.edit);


module.exports = routes