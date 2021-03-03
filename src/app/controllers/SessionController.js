const crypto = require('crypto')
const User = require('../models/User')

const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')

module.exports = {
  loginForm(req, res) {
    return res.render("session/login", {login: true})
  },
  registerForm(req, res) {
    return res.render("session/register", {register: true})
  },
  passwordForgotForm(req, res) {
    return res.render("session/password-forgot")
  },
  passwordResetForm(req, res) {
    return res.render("session/password-reset", {token: req.query.token, passwordReset: true})
  },
  login(req, res) {

    req.session.userId = req.user.id;
    req.session.isAdmin = req.user.is_admin;

    return res.redirect("/")

  },
  async register(req, res) {

    const userId = await User.register(req.body)

    req.session.userId = userId
    req.session.isAdmin = req.user.is_admin;
    
    return res.redirect('/')

  },
  logout(req, res) {
    
      req.session.destroy()
  
      return res.render("session/login", {login: true})

  },
  async forgot(req, res) {
      const user = req.user

      try {
        // create token to user
        const token = crypto.randomBytes(20).toString("hex")

        // create expired time
        let now = new Date()
        now = now.setHours(now.getHours() + 1)

        await User.update(user.id, {
          reset_token: token,
          reset_token_expires: now
        })

        // send email with url of recuperation
        await mailer.sendMail({
          to: user.email,
          from: 'no-replay@foodyfy.com.br',
          subject: 'Recuperação de senha',
          html: `<h2>Perdeu a chave?</h2>
          <p>Não se preocupe, clique no link abaixo para resuperar sua senha</p>
          <p>
            <a href="http://localhost:3000/session/password-reset?token=${token}" target="_blank">
            RECUPERAR SENHA
            </a>
          </p>
          `,
        })

        // notification user about token
        return res.render("session/password-forgot", {
          success: "Verifique seu email para resetar sua senha!"
        })
      } catch (error) {
        console.error(error)
        return res.render("session/password-forgot", {
          error: "Ocorreu um erro no envio do email, tente novamente."
        })
      }
  },
  async reset(req, res) {

    const { user } = req
    const { password } = req.body

    try {

      // create new hash password
      const newPassword = await hash(password, 8)

      // update user
      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      })

      // alert user that your password has been updated
      return res.render("session/login", {
        user: req.body,
        success: "Senha atualizada! Faça o seu login.",
        login: true
      })

    } catch (error) {
      console.error(error)
      return res.render("session/password-reset", {
        user: req.body,
        error: "Erro inesperado, tente novamente."
      })
    }
  }
}