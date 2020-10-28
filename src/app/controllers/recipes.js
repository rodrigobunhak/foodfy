const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFiles = require('../models/RecipeFiles');

module.exports = {
  index(req, res) {

    // Recipe.all(function(recipes) {
    //   return res.render('admin/recipe/index', {recipes})
    // })

    const { filter } = req.query

    Recipe.findBy(filter, function(recipes) {

      if(recipes == '') {
        
        Recipe.all(function(recipes) {
          return res.render('admin/recipe/index', {recipes})
        })

      } else {
        return res.render('admin/recipe/index', {recipes})
      }

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
  async post(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    if (req.files.length == 0) {
      return res.send('Please, send at least one image')
    }

    const results = await Recipe.create(req.body)
    const recipeId = results.rows[0].id

    // Promise Array
    const filesPromise = req.files.map(file => {
      return File.create({...file})
    })

    await Promise.all(filesPromise).then((values) => {
      const recipeFilesPromise = values.map(value => {
        RecipeFiles.create(recipeId, value.rows[0].id)
      })
      Promise.all(recipeFilesPromise)
    })
    

    return res.redirect(`/admin/recipes/${recipeId}`)


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
      return res.redirect(`/admin/recipes`)
    })
  }
}