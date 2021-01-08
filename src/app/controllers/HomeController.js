const Recipe = require('../models/Recipe');

module.exports = {
  async index(req, res) {

    console.log(req.session)
    

    let results = await Recipe.all()
    const recipes = results.rows

    if (!recipes) return res.send("Recipes not found!")

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
    }).filter((recipe, index) => index > 1 ? false : true)

    const lastAdded = await Promise.all(recipesPromise)

    return res.render("home/index", { recipes: lastAdded })

  }

}