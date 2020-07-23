const recipes = require("../../data")

module.exports = {
  index(req, res) {

    return res.render('admin/index', {recipes})

  },
  create(req, res) {

    return res.render('admin/create')

  },
  show(req, res) {

    const { id } = req.params

    const foundRecipe = recipes.find(function(recipe, index) {
      return index == id
    })

    const recipe = {
      ...foundRecipe
    }

    return res.render('admin/detalhe',{ recipe })

  },
  edit(req, res){

    return res.render('admin/edit')

  },
  sobre(req, res) {

    return res.render('sobre')

  },
  receitas(req, res) {

    res.render('receitas', {recipes: recipes})

  },
  detalhe(req, res) {

      const recipeIndex = req.params.index;
      const recipe = recipes[recipeIndex]
    
      return res.render('detalhe-receitas', {recipe})

  }
}