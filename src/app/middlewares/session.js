const User = require('../models/User')

async function verifyAdmin(req, res, next) {

  const id = req.session.userId
  
  const user = await User.findOne({where: {id}})
  
  if(!user) {

    const message = `Acesso negado! <br> Usuário não autenticado. <br> =/ `

    return res.render('access-denied/access-denied', {message})

  }

  if(user.is_admin != true) {
    // return res.send('Access Denied')

    const message = 'Acesso negado! <br> Somente usuários administradores. <br> =/'

    return res.render('access-denied/access-denied', {message})
  }
  
  next()
}

module.exports = {
  verifyAdmin
}