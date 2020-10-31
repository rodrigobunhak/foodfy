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
  
      return res.render("site/index", {recipes: allRecipes})
      
  },
  about(req, res) {
  
    return res.render('site/about')

  },
  recipes(req, res) {

    const { filter } = req.query

    Recipe.findBy(filter, function(recipes) {

      if(recipes == '') {
        
        Recipe.all(function(recipes) {
          return res.render('site/recipes', {recipes})
        })

      } else {
        return res.render('site/recipes', {recipes})
      }

    })

  },
  chefs(req, res) {

    Chef.all(function(chefs) {
      return res.render('site/chefs', {chefs})
    })

  },
  show(req, res) {

    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Recipe not found!")

      return res.render('site/detalhe', { recipe })
    })

  }
}