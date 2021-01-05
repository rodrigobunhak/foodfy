const User = require('../models/User')

async function verifyAdmin(req, res, next) {

  const id = req.session.userId
  
  const user = await User.findOne({where: {id}})
  
  if(!user) return res.send('Access Denied, user not autenticad')

  if(user.is_admin != true) {
    return res.send('Access Denied')
  }
  
  next()
}

module.exports = {
  verifyAdmin
}