const recipes = require("../../data")

module.exports = {
  index(req, res) {

    return res.render('site/index', {recipes})

  },
  sobre(req, res) {

    return res.render('site/sobre')

  },
  receitas(req, res) {

    res.render('site/receitas', {recipes: recipes})

  },
  detalhe(req, res) {

      const recipeIndex = req.params.index;
      const recipe = recipes[recipeIndex]
    
      return res.render('site/detalhe-receitas', {recipe})

  }
}