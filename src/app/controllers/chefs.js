const Chef = require('../models/Chef');

module.exports = {
  index(req, res) {

  },
  create(req, res) {
    return res.render('admin/chef/create');
  },
  post(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    Chef.create(req.body, function(chef) {
      return res.render('admin/chef/index', {chef})
    })

  }
}