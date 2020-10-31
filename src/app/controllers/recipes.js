const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFiles = require('../models/RecipeFiles');
const { files } = require('../models/Recipe');

module.exports = {
  async index(req, res) {
     
    let results = await Recipe.all()
    const recipes = results.rows

    if (!recipes) return res.render('admin/recipe/index')

    async function getImage(recipeId) {
      let results = await Recipe.files(recipeId)
      const files = results.rows.map(file => {
        return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`.replace(/\\/g, "/")
      })

      return files[0]
    }

    const recipesPromise = recipes.map(async recipe => {
      recipe.image = await getImage(recipe.id)
      return recipe
    })

    const allRecipes = await Promise.all(recipesPromise)

    return res.render("admin/recipe/index", {recipes: allRecipes})

  },
  create(req, res) {

    Recipe.chefSelectOptions(function(options) {
      return res.render('admin/recipe/create',{ chefOptions: options })
    })

  },
  show(req, res) {

    Recipe.find(req.params.id, async function(recipe) {
      if (!recipe) return res.send("Recipe not found!")

      // get images
      let results = await Recipe.files(recipe.id)
      let files = results.rows
      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }))

      return res.render('admin/recipe/detalhe', { recipe, files })
    })

  },
  async post(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
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
  async edit(req, res) {

    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Recipe not found!")

      Recipe.chefSelectOptions(async function(options) {

        // get images
        let results = await Recipe.files(recipe.id)
        let files = results.rows
        files = files.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render('admin/recipe/edit',{ recipe, chefOptions: options, files })
      })
    })

    

  },
  async put(req, res) {

    const keys = Object.keys(req.body)
    const recipeId = req.body.id

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send('Please, fill all fields!')
      }
    }

    if (req.files.length != 0) {
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
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)

      const removedRecipeFilesPromise = removedFiles.map(fileId => RecipeFiles.delete(fileId))
      const removedFilesPromise = removedFiles.map(fileId => File.delete(fileId))

      await Promise.all([removedRecipeFilesPromise, removedFilesPromise])
      
    }

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