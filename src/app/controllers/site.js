const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

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

    const { filter } = req.query

    Recipe.findBy(filter, function(recipes) {

      if(recipes == '') {
        
        Recipe.all(function(recipes) {
          return res.render('site/recipes', {recipes})
        })

      } else {
        return res.render('site/recipes', {recipes})
      }

    })

  },
  chefs(req, res) {

    Chef.all(function(chefs) {
      return res.render('site/chefs', {chefs})
    })

  },
  show(req, res) {

    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Recipe not found!")

      return res.render('site/detalhe', { recipe })
    })

  }
}