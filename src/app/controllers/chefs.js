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
  show(req, res) {

    Chef.find(req.params.id, function(chef, recipes) {
      if (!chef) return res.send("Chef not found!")

      return res.render('admin/chef/detalhe', { chef, recipes })
    })

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
  },
  put(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    Chef.update(req.body, function() {
      return res.redirect(`chefs/${req.body.id}`)
    })
  },
  delete(req, res) {

    Chef.find(req.body.id, function(chef, recipes) {
      if(chef.total_recipes == 0) {
        Chef.delete(req.body.id, function() {
          return res.redirect(`/admin/chefs`)
        })
      } else {
        return res.send("Chef not deleted, there are recipes linked")
      }
    })
  }
}