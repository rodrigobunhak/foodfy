const User = require('../models/User')

async function verifyAdmin(req, res, next) {

  const id = req.session.userId

  const user = await User.findOne({where: {id}})

  if(user.is_admin == false)
    return res.redirect('/')
  
  next()
}

module.exports = {
  verifyAdmin
}