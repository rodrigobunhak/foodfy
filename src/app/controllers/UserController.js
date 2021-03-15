const crypto = require('crypto')

const mailer = require('../../lib/mailer')

const User = require('../models/User')

module.exports = {
  async index(req, res) {

    const users = await User.all()

    return res.render('user/index', { users })

  },
  create(req, res) {

    return res.render('user/create')

  },
  async show(req, res) {

    const id = req.params.id

    user = await User.findOne({where: {id}})
    
    // check if user exist
    if (!user) return res.send("User not found!")

    return res.render('user/show', { user })
    
  },
  async post(req, res) {

    // create temporary password
    const temporaryPassword = crypto.randomBytes(6).toString("hex");

    const user = req.body;
    user.password = temporaryPassword

    console.log(user)

    const userId = await User.create(user)

    await mailer.sendMail({
      to: user.email,
      from: 'no-replay@foodyfy.com.br',
      subject: 'Novo acesso',
      html: `<h2>Seja bem vindo ao FooFy!</h2>
      <p>Segue abaixo os dados para o seu primeiro acesso</p>
      <p>
        <a href="http://localhost:3000/session/login" target="_blank">
        FoodFy
        </a>

        <p>
          <strong>E-mail:</strong> ${user.email}
          <strong>Senha Temporária:</strong> ${user.password} 
        </p>
      </p>
      `,
    })

    return res.redirect('/users', {
      success: "E-mail enviado ao usuário com os dados de acesso!"
    })

  },
  async put(req, res) {

    try {
      
      const { id, name, email } = req.body

      await User.update(id, {
        name,
        email
      })

      return res.render(`user/show`, {
        user: req.body,
        success: "Conta atualizada com sucesso!"
      })

    } catch (error) {
      console.log(error)
      return res.render(`user/show`, {
        error: "Algum erro aconteceu!"
      })
    }

  },
  async edit(req, res) {

    const id = req.params.id

    let user = await User.findOne({where: {id}})

    return res.render('user/edit', {user})

  },
  async delete(req, res) {

    const id = req.body.id

    let user = await User.findOne({where: {id}})

    await User.delete(user.id)
      
    return res.redirect(`/users`)

  }
}