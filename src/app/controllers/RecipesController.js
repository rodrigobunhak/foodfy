const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFiles = require('../models/RecipeFiles');

module.exports = {
  async index(req, res) {
     
    let results = await Recipe.all()
    const recipes = results.rows

    if (!recipes) return res.render('recipe/index')

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

    return res.render("recipe/index", {recipes: allRecipes})

  },
  async create(req, res) {
    
    const chefOptions = await Recipe.chefSelectOptions()

    return res.render('recipe/create',{ chefOptions })

  },
  async show(req, res) {

    const recipe = await Recipe.find(req.params.id)

    if (!recipe) return res.send("Recipe not found!")

      // get images
      results = await Recipe.files(recipe.id)
      let files = results.rows
      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }))

      return res.render('recipe/detalhe', { recipe, files })
    
  },
  async post(req, res) {

    const chefOptions = await Recipe.chefSelectOptions()

    const {removedFiles, title, chef, ingredients, preparation, information} = req.body

    const recipe = {
      removed_files: removedFiles,
      title,
      user: req.session.userId,
      chef,
      ingredients,
      preparation,
      information
    }

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.render('recipe/create', {
          error: `Por favor, preencha todos os campos.`,
          chefOptions,
          recipe
        })
      }
    }
    
    if (req.files.length == 0) {
      return res.render('recipe/create', {
        error: `Por favor, envie pelo menos uma imagem.`,
        chefOptions,
        recipe
      })
    }

    const results = await Recipe.create(recipe)
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
    
    const createdRecipe = await Recipe.find(recipeId)

    // get images
    let myResults = await Recipe.files(recipeId)
    let files = myResults.rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    return res.render(`recipe/detalhe`, { 
      success: `Receita criada com sucesso!`,
      recipe: createdRecipe,
      files,  
    })

  },
  async edit(req, res) {

    const recipe = await Recipe.find(req.params.id)

    const options = await Recipe.chefSelectOptions()

    // get images
    results = await Recipe.files(recipe.id)
    let files = results.rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    return res.render('recipe/edit',{ recipe, chefOptions: options, files })

  },
  async put(req, res) {

    const keys = Object.keys(req.body)
    const recipeId = req.body.id
    const options = await Recipe.chefSelectOptions()
    
    const {removedFiles, title, chef, ingredients, preparation, information, id} = req.body
    
    const recipe = {
      removed_files: removedFiles,
      title,
      user: req.session.userId,
      chef_id: parseInt(chef),
      ingredients,
      preparation,
      information,
      id,
    }

    // get images
    results = await Recipe.files(recipe.id)
    let files = results.rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        // return res.send('Please, fill all fields!')
        return res.render('recipe/edit', {
          recipe,
          chefOptions: options,
          error: `Por favor, preencha todos os campos.`,
          files
        })
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

    await Recipe.update(recipe)

    const updatedRecipe = await Recipe.find(recipeId)

    // get images
    let myResults = await Recipe.files(recipeId)
    let updatedfiles = myResults.rows
    updatedfilesfiles = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    return res.render(`recipe/detalhe`, { 
      success: `Receita salva com sucesso!`,
      recipe: updatedRecipe,
      files,  
    })

  },
  async delete(req, res) {

    const result = await Recipe.files(req.body.id)
    const recipeFiles = result.rows

    const removedRecipeFilesPromise = recipeFiles.map(file => {
      RecipeFiles.delete(file.id)
    })

    const removedFilesPromise = recipeFiles.map(file => {
      File.delete(file.file_id)
    })

    await Promise.all([removedRecipeFilesPromise, removedFilesPromise])
    
    await Recipe.delete(req.body.id)
    
    return res.redirect(`recipes`)
    
  }
}