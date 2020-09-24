const Recipe =require('../models/Recipe');

module.exports = {
  index(req, res) {

    Recipe.all(function(recipes) {
      return res.render('admin/recipe/index', {recipes})
    })

  },
  create(req, res) {

    Recipe.chefSelectOptions(function(options) {
      return res.render('admin/recipe/create',{ chefOptions: options })
    })

  },
  show(req, res) {

    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Recipe not found!")

      return res.render('admin/recipe/detalhe', { recipe })
    })

  },
  post(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    Recipe.create(req.body, function(recipe) {
      return res.render('admin/recipe/index', {recipe})
    })

  },
  edit(req, res) {

    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Recipe not found!")

      Recipe.chefSelectOptions(function(options) {
        return res.render('admin/recipe/edit',{ recipe, chefOptions: options })
      })
    })
  },
  put(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    console.log(req.body)

    Recipe.update(req.body, function() {
      return res.redirect(`recipes/${req.body.id}`)
    })
  },
  delete(req, res) {
    Recipe.delete(req.body.id, function() {
      return res.redirect(`/recipes`)
    })
  }
}