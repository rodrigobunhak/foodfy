const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {

  const keys = Object.keys(body)

  for (key of keys) {
    if (body[key] == "") {
      return {
        user: body,
        error: 'Existem campos obrigatórios sem preenchimento.'
      }
    }
  }
}

async function post(req, res, next) {

  const fillAllFields = checkAllFields(req.body)
  if(fillAllFields) {
    return res.render("user/register", fillAllFields)
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

async function show(req, res, next) {

  const { userId: id } = req.session

  const user = await User.findOne({where: {id}})

  if (!user) return res.render("user/register", {
    error: "Usuário não encontrado"
  })

  req.user = user

  next()
}

async function update(req, res, next) {

  const fillAllFields = checkAllFields(req.body)

  if(fillAllFields) {
    return res.render("user/index", fillAllFields)
  }



  const { id, password } = req.body

  if(!password) return res.render("user/index", {
    user: req.body,
    error: "Coloque sua senha para atualizar seu cadastro."
  })

  const user = await User.findOne({where: {id}})

  const passed = await compare(password, user.password)

  if (!passed) return res.render("user/index", {
    user: req.body,
    error: "Senha incorreta."
  })

  req.user = user

  next()
}

module.exports = {
  post,
  show,
  update
}