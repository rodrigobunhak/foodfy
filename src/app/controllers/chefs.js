const Chef = require('../models/Chef');

module.exports = {
  index(req, res) {

    Chef.all(function(chefs) {
      res.render('admin/chef/index', {chefs})
    })

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

  },
  edit(req, res) {

    Chef.find(req.params.id, function(chef) {
      if (!chef) return res.send("Chef not found!")

      return res.render('admin/chef/edit', {chef});
    })
  }
}