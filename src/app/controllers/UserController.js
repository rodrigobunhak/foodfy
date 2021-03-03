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

    const userId = await User.create(req.body)

    return res.redirect('/users')

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