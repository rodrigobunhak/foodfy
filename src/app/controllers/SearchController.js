const Recipe = require('../models/Recipe');

module.exports = {
  async index(req, res) {

    try {
      
      let results,
          params = {}

      const { filter } = req.query

      if (!filter) return res.redirect("/home/recipes")

      params.filter = filter

      results = await Recipe.search(params)
      const recipes = results.rows

      const mensagem = `Nenhuma receita encontrada com o termo: ${filter}.`

      if (recipes.length == 0) return res.render('home/recipes', {mensagem, filter})

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

      const filteredRecipes = await Promise.all(recipesPromise)

      const search = {
        term: req.query.filter
      }

      return res.render("search/index", { recipes: filteredRecipes, filter: search.term })

    } catch (error) {
      console.error(error)
    }

  }

}