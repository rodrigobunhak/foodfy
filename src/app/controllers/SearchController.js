const Recipe = require('../models/Recipe');

module.exports = {
  async index(req, res) {

    try {

      const { filter } = req.query

      const recipes = await Recipe.search({where: {title: filter}})

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

      return res.render("search/index", { recipes: allRecipes, filter })


    } catch (error) {
      console.error(error)
    }

  }
}