const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/users')
const SessionValidator = require('../app/validators/session')

const { verifyAdmin } = require('../app/middlewares/session')

// // // login/logout
routes.get('/login', SessionController.loginForm)
routes.get('/register', SessionController.registerForm)
routes.get('/password-forgot', SessionController.passwordForgotForm)
routes.get('/password-reset', SessionController.passwordResetForm)

routes.post('/login',SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

routes.post('/register', UserValidator.post, SessionController.register)

routes.post('/password-forgot', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

module.exports = routes