const recipes = require("../../data")

module.exports = {
  index(req, res) {

    return res.render('admin/index', {recipes})

  },
  create(req, res) {

    return res.render('admin/create')

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