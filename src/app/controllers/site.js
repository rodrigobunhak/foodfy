const Recipe =require('../models/Recipe');

module.exports = {
  index(req, res) {

    Recipe.all(function(recipes) {
      return res.render('site/index', {recipes})
    })
  },
  about(req, res) {
  
    return res.render('site/about')

  },
  recipes(req, res) {

    Recipe.all(function(recipes) {
      return res.render('site/recipes', {recipes})
    })

  },
  show(req, res) {

    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Recipe not found!")

      return res.render('site/detalhe', { recipe })
    })

  }
}