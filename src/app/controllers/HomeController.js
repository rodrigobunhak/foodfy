const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
  async index(req, res) { // Done!

    const recipes = await Recipe.findAll()

    if (!recipes) return res.render('home/index')

    async function getImage(recipeId) {
      const file = await Recipe.getOneFile(recipeId)
      file.path = `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`.replace(/\\/g, "/")
      return file.path
    }

    const recipesPromise = recipes.map(async recipe => {
      recipe.image = await getImage(recipe.id)
      return recipe
    }).filter((recipe, index) => index > 3 ? false : true)

    const lastAdded = await Promise.all(recipesPromise)
    return res.render("home/index", { recipes: lastAdded })

  },
  async recipes(req, res) { // Done!

    const recipes = await Recipe.findAll()

    if (!recipes) return res.render('home/index')

    async function getImage(recipeId) {
      const file = await Recipe.getOneFile(recipeId)
      file.path = `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`.replace(/\\/g, "/")
      return file.path
    }

    const recipesPromise = recipes.map(async recipe => {
      recipe.image = await getImage(recipe.id)
      return recipe
    })

    const allRecipes = await Promise.all(recipesPromise)
    return res.render("home/recipes", { recipes: allRecipes })

  },
  about(req, res) { // Done!
    return res.render('home/about')
  },
  async chefs(req, res) { // Done!

    const chefs = await Chef.findAll() 

    if (!chefs) return res.render('home/index')
    
    async function getImage(chefId) {
      const file = await Chef.getOneFile(chefId)
      file.path = `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`.replace(/\\/g, "/")
      return file.path
    }
    
    const chefsPromise = chefs.map(async chef => {
      chef.image = await getImage(chef.id)
      return chef
    })

    const allChefs = await Promise.all(chefsPromise)
    return res.render('home/chefs', {chefs: allChefs})

  },
  async showRecipe(req, res) { // Done!

    const recipe = await Recipe.find(req.params.id)
    
    if (!recipe) return res.send("Recipe not found!")

    let files = await Recipe.getAllFiles(recipe.id)
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`.replace(/\\/g, "/")
    }))

    return res.render('home/show', { recipe, files })

  }
}