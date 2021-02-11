const User = require('../models/User')

async function verifyAdmin(req, res, next) {

  const id = req.session.userId

  const user = await User.findOne({where: {id}})

  if(user.is_admin != true) {
    // return res.send('Access Denied')

    const message = 'Acesso negado! <br> Somente usuários administradores. <br> =/'

    return res.render('access-denied/access-denied-admin', {message})
  }
  
  next()
}

async function verifyUserAutenticad(req, res, next) {

  const id = req.session.userId

  const message = `Acesso negado! <br> Usuário não autenticado. <br> =/ `

  if (!id) return res.render('access-denied/access-denied-default', {message})
  
  const user = await User.findOne({where: {id}})
  
  if(!user) {

    return res.render('access-denied/access-denied-default', {message})

  }

  next()
}

module.exports = {
  verifyAdmin,
  verifyUserAutenticad
}