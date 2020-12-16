const User = require('../models/User')

async function post(req, res, next) {

  //check if has all fields
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == "") {
      return res.send('Please, fill all fields!')
    }
  }

  //check if user exists [email]
  const { email, password, passwordRepeat } = req.body
  const user = await User.findOne({ where: { email }})

  if (user) return res.send('User exists')

  //check if password match
  if (password != passwordRepeat)
    return res.send('Password Mismatch')

  next()
}

module.exports = {
  post
}