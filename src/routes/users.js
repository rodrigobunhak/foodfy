const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/users')
const SessionValidator = require('../app/validators/session')

const { verifyAdmin } = require('../app/middlewares/session')

// // // login/logout
// routes.get('/login', SessionController.loginForm)
// routes.post('/login',SessionValidator.login, SessionController.login)
// routes.post('/logout', SessionController.logout)

// // // reset password / forgot
// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
// routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

// // // user register UserController
// routes.get('/register', UserController.registerForm)
// routes.post('/register', UserValidator.post, UserController.register)

// routes.get('/show', UserValidator.show, UserController.show)
// routes.put('/', UserValidator.update, UserController.update)


// routes.delete('/', UserController.delete)

// // Rotas de perfil de um usuário logado
// routes.get('/', verifyAdmin, ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado



// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/create', UserController.create)
routes.get('/:id/edit', UserController.edit)
routes.get('/', UserController.index)
routes.get('/:id', UserController.show)

routes.post('/', UserController.post)
routes.put('/', UserController.put)
routes.delete('/', UserController.delete)




// routes.get('/', verifyAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
// routes.get('/create', verifyAdmin, UserController.formCreate) // Exibe formulário de cadastro do usuário
// routes.post('/', verifyAdmin, UserController.post) //Cadastrar um usuário
// // routes.put('/users', verifyAdmin, UserController.put) // Editar um usuário
// // routes.delete('/admin/users', UserController.delete) // Deletar um usuário
// routes.get("/:id/edit", verifyAdmin, UserController.edit);


module.exports = routes