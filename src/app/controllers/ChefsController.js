const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe')
const File = require('../models/File');

module.exports = {
  async index(req, res) { // Done!

    const chefs = await Chef.findAll() 
    if (!chefs) return res.render('chefs/index')
    
    async function getImage(chefId) {
      const image = await Chef.getOneFile(chefId)
      return `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`.replace(/\\/g, "/")
    }
    
    const chefsPromise = chefs.map(async chef => {
      chef.image = await getImage(chef.id)
      return chef
    })

    const allChefs = await Promise.all(chefsPromise)
    return res.render('chef/index', {chefs: allChefs})

  },
  create(req, res) { // Done!
    return res.render('chef/create');
  },
  async show(req, res) { // Done!

    const chefId = req.params.id
    const chef = await Chef.find(chefId)

    if (!chef) return res.send("Chef not found!")

    const file = await Chef.getOneFile(chefId)
    chef.image = `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`

    const recipes = await Chef.findRecipes(chefId)
    
    const recipesPromise = recipes.map(async (recipe, index) => {
      const file = await Recipe.getOneFile(recipe.id)
      recipes[index].image = `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    })

    await Promise.all(recipesPromise)
    return res.render('chef/detalhe', { chef, recipes })

  },
  async post(req, res) { // Done!

    try {
      
      const keys = Object.keys(req.body)
      
      const { name } = req.body
      const { filename, path } = req.file
  
      for (key of keys) {
        if (req.body[key] == "" && key != "chef_image") {
          return res.render('chef/create', {
            error: `Por favor, preencha todos os campos.`
          })
        }
      }
  
      if(!req.file) {
        return res.render('chef/create', {
          error: `Por favor, selecione uma imagem, campo obrigatório.`,
          chef: req.body
        })
      }

      const fileId = await File.create({
        name: filename,
        path
      })

      const chefId = await Chef.create({
        name,
        file_id: fileId
      })
  
      const chef = await Chef.find(chefId)
  
      const chefImage = await Chef.getOneFile(chefId)
      chef.image = `${req.protocol}://${req.headers.host}${chefImage.path.replace("public", "")}`
  
      return res.render(`chef/detalhe`, {
        success: `Usuário criado com sucesso!`,
        chef
      })

    } catch (error) {
      console.error(error)
    }

  },
  async edit(req, res) { // Done!

    const chef = await Chef.find(req.params.id)

    const chefImage = await Chef.getOneFile(chef.id)
    chef.image = `${req.protocol}://${req.headers.host}${chefImage.path.replace("public", "")}`

    return res.render('chef/edit', {chef})

  },
  async put(req, res) { // Done!
    
    const keys = Object.keys(req.body)
    const { name, id } = req.body

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    if (req.file) {

      const { filename, path } = req.file
      const fileId = await File.create({
        name: filename,
        path
      })
      await Chef.update(id, {
        name,
        file_id: fileId
      })

    } else {

      const file = await Chef.getOneFile(id)
      await Chef.update(id, {
        name,
        file_id: file.id
      })
  
    }

    const chef = await Chef.find(id)

    const chefImage = await Chef.getOneFile(chef.id)
    chef.image = `${req.protocol}://${req.headers.host}${chefImage.path.replace("public", "")}`

    const recipes = await Chef.findRecipes(id)

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

    return res.render('chef/detalhe', { 
      success: 'Chef atualizado com sucesso!',
      chef,
      recipes: allRecipes,
    })
  },
  async delete(req, res) {

    const chef = await Chef.find(req.body.id)

    if (chef.total_recipes == 0) {
      await Chef.delete(chef.id)
      
      await File.delete(chef.file_id)
      
      return res.redirect(`/chefs`)

    } else {
        return res.send("Chef not deleted, there are recipes linked")
    }
  }
}
