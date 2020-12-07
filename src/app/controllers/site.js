const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
  async index(req, res) {
     
    let results = await Recipe.all()
    const recipes = results.rows

    if (!recipes) return res.render('site/index')

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

    return res.render("site/recipes", {recipes: allRecipes})

  },
  about(req, res) {
  
    return res.render('site/about')

  },
  async recipes(req, res) {

    let results = await Recipe.all()
    const recipes = results.rows

    if (!recipes) return res.render('site/index')

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

    return res.render("site/recipes", {recipes: allRecipes})

  },
  async chefs(req, res) {

    // consulta todos os chefes no banco e salva na variavel chefs, array de chefs
    let results = await Chef.all() 
    const chefs = results.rows

    // verifica se tem algum chef, caso nao tenha imprime a pagina vazia
    if (!chefs) return res.render('site/index')
    
    // procura arquivo com o ID do chef e retorna o path
    async function getImage(chefId) {
      let result = await Chef.file(chefId)
      const fileSrc = result.rows.map(file => {
        return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`.replace(/\\/g, "/")
      })

      return fileSrc

    }
    

    const chefsPromise = chefs.map(async chef => {
      chef.image = await getImage(chef.id)
      return chef
    })


    const allChefs = await Promise.all(chefsPromise)

    return res.render('site/chefs', {chefs: allChefs})

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

      return res.render('site/detalhe', { recipe, files })
    })

  }
}