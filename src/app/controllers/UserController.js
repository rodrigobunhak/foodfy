const User = require('../models/User')

module.exports = {
  async list(req, res) {

    const users = await User.all()

    return res.render('user/list', { users })

  },
  formCreate(req, res) {

    return res.render('user/form-create')

  },
  registerForm(req, res) {
    return res.render("user/register")
  },
  async show(req, res) {

    const { user } = req

    return res.render('user/show', { user })
    
  },
  async post(req, res) {

    const userId = await User.create(req.body)

    return res.redirect('/users')

  },
  async register(req, res) {

    const userId = await User.register(req.body)

    req.session.userId = userId
    
    return res.redirect('/')

  },
  async update(req, res) {

    try {
      
      const { user } = req
      let { name, email } = req.body

      await User.update(user.id, {
        name,
        email
      })

      return res.render("user/index", {
        user: req.body,
        success: "Conta atualizada com sucesso!"
      })

    } catch (error) {
      console.log(error)
      return res.render("user/index", {
        error: "Algum erro aconteceu!"
      })
    }

  },
  async edit(req, res) {

    const id = req.params.id

    let user = await User.findOne({where: {id}})

    return res.render('user/edit', {user})

    

  }
}