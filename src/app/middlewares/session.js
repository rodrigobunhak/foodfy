const User = require('../models/User')
const Recipe = require('../models/Recipe');


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

async function verifyUserCreator(req, res, next) {

  const id = req.session.userId

  const message = `Acesso negado! <br> Usuário não é o proprietário. <br> =/ `
  
  const user = await User.findOne({where: {id}})

  const results = await Recipe.find(req.params.id)
  const recipe = results.rows[0]

  if(user.is_admin == true) {
    
    next()

  }

  if(user.id != recipe.user_id) {

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
  verifyUserAutenticad,
  verifyUserCreator
}