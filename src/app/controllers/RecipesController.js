const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFiles = require('../models/RecipeFiles');

module.exports = {
  async index(req, res) {
     
    const recipes = await Recipe.findAll()

    if (!recipes) return res.render('recipe/index')

    async function getImage(recipeId) {
      
      const file = await Recipe.getOneFile(recipeId)

      return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`.replace(/\\/g, "/")
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
  async show(req, res) { // Waiting...

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
  async post(req, res) { // Done!

    const chefOptions = await Recipe.chefSelectOptions()

    const {removedFiles, title, chef, ingredients, preparation, information} = req.body

    const recipe = {
      // removed_files: removedFiles,
      title,
      user_id: req.session.userId,
      chef_id: chef,
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
    
    if (req.files.length === 0) {
      return res.render('recipe/create', {
        error: `Por favor, envie pelo menos uma imagem.`,
        chefOptions,
        recipe
      })
    }

    const recipeId = await Recipe.create({
      title,
      user_id: req.session.userId,
      chef_id: chef,
      ingredients,
      preparation,
      information
    })

    const filesPromise = req.files.map(async file => {
      const fileId = await File.create({
        name: file.filename,
        path: file.path
      })

      RecipeFiles.create({
        recipe_id: recipeId,
        file_id: fileId
      })
    })

    await Promise.all(filesPromise)
    
    const createdRecipe = await Recipe.find(recipeId)

    let files = await Recipe.getAllFiles(recipeId)
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
  async edit(req, res) { // Done!

    const recipe = await Recipe.find(req.params.id)

    const options = await Recipe.chefSelectOptions()

    let files = await Recipe.getAllFiles(recipe.id)
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
    let files = await Recipe.getAllFiles(recipe.id)
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
      
      const filesPromise = req.files.map(async file => {
        const fileId = await File.create({
          name: file.filename,
          path: file.path
        })
  
        RecipeFiles.create({
          recipe_id: recipeId,
          file_id: fileId
        })
      })
  
      await Promise.all(filesPromise)

    }



    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)

      const removedRecipeFilesPromise = removedFiles.map(fileId => RecipeFiles.delete(fileId))
      const removedFilesPromise = removedFiles.map(fileId => File.delete(fileId))

      await Promise.all([removedRecipeFilesPromise, removedFilesPromise])
      
    }

    await Recipe.update(recipe.id, {
      title,
      user_id: req.session.userId,
      chef_id: chef,
      ingredients,
      preparation,
      information
    })

    const updatedRecipe = await Recipe.find(recipeId)

    // get images
    let myResults = await Recipe.getAllFiles(recipeId)
    
    myResults = files.map(file => ({
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