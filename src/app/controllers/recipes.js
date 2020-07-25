const fs = require('fs')
//const recipes = require("../../data")
const data = require("../../data.json")

module.exports = {
  index(req, res) {

    return res.render('admin/index', {recipes: data.recipes})

  },
  create(req, res) {

    return res.render('admin/create')

  },
  show(req, res) {

    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe, index) {
      return index == id
    })

    const recipe = {
      ...foundRecipe,
      id
    }

    return res.render('admin/detalhe',{ recipe })

  },
  post(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    let { title, author, avatar_recipe, ingredients, preparation, info } = req.body

    data.recipes.push({
      title,
      author,
      avatar_recipe,
      ingredients,
      preparation,
      info
    })

    fs.writeFile("src/data.json", JSON.stringify(data, null, 2), function(err){
      if (err) return res.send("Write file error!")

      return res.redirect("/admin/recipes/create")
    })

  },
  edit(req, res){

    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe, index) {
      return index == id
    })

    const recipe = {
      ...foundRecipe
    }

    return res.render('admin/edit',{ recipe })


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