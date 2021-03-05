const User = require('../models/User')
const { put } = require('./UserController')

module.exports = {
  async index(req, res) {

    const id = req.session.userId

    user = await User.findOne({where: {id}})

    // check if user exist
    if (!user) return res.send("User not found!")

    return res.render('profile/edit', { user })

  },
  async put(req, res) {
    
    const { id, name, email } = req.body

    await User.update(id, {
      name,
      email
    })

    user = await User.findOne({where: {id}})

    return res.render(`profile/edit`, {
      user,
      success: "Conta atualizada com sucesso!"
    })

  }
}