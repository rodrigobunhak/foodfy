const fs = require('fs')
//const recipes = require("../../data")
const data = require("../../data.json")
const Recipe =require('../models/Recipe');

module.exports = {
  index(req, res) {

    Recipe.all(function(recipes) {
      return res.render('admin/recipe/index', {recipes})
    })

  },
  create(req, res) {

    return res.render('admin/recipe/create')

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

    return res.render('admin/recipe/detalhe',{ recipe })

  },
  post(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    Recipe.create(req.body, function(recipe) {
      return res.render('admin/recipe/index', {recipes: data.recipes})
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

    return res.render('admin/recipe/edit',{ recipe })


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