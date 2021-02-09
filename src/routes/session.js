const express = require('express');
const routes = express.Router();

// controllers
const SessionController = require('../app/controllers/SessionController')

// validators
const UserValidator = require('../app/validators/users')
const SessionValidator = require('../app/validators/session')

routes.get('/login', SessionController.loginForm) // ok
routes.get('/register', SessionController.registerForm) // ok
routes.get('/password-forgot', SessionController.passwordForgotForm) // ok
routes.get('/password-reset', SessionController.passwordResetForm) // ok

routes.post('/login',SessionValidator.login, SessionController.login) // ok
routes.post('/logout', SessionController.logout) // ok

routes.post('/register', UserValidator.post, SessionController.register) // ok

routes.post('/password-forgot', SessionValidator.forgot, SessionController.forgot) // ok
routes.post('/password-reset', SessionValidator.reset, SessionController.reset) // ok

module.exports = routes