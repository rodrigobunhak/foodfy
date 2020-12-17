const User = require('../models/User')

module.exports = {
  registerForm(req, res) {
    return res.render("user/register")
  },
  async show(req, res) {

    const { user } = req

    return res.render('user/index', {user})
    
  },
  async post(req, res) {
    
    const userId = await User.create(req.body)

    req.session.userId = userId

    return res.redirect('/users')
  },
  async update(req, res) {

    try {
      
      let { name, email } = req.body

      await User.update(user.id, {
        name,
        email
      })

      return res.render("user/index", {
        sucess: "Conta atualizada com sucesso!"
      })

    } catch (error) {
      console.log(error)
      return res.render("user/index", {
        error: "Algum erro aconteceu!"
      })
    }

  }
}