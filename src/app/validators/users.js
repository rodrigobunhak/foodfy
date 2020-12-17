const User = require('../models/User')

async function post(req, res, next) {

  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == "") {
      return res.render('user/register', {
        user: req.body,
        error: 'Existem campos obrigatórios sem preenchimento.'
      })
    }
  }

  const { email, password, passwordRepeat } = req.body
  const user = await User.findOne({ where: { email }})

  if (user) return res.render('user/register', {
    user: req.body,
    error: 'Usuário já cadastrado.'
  })

  if (password != passwordRepeat)
    return res.render('user/register', {
      user: req.body,
      error: 'Senhas não conferem.'
    })

  next()
}

module.exports = {
  post
}