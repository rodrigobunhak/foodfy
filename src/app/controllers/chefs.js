const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe')
const File = require('../models/File');

module.exports = {
  async index(req, res) {

    // consulta todos os chefes no banco e salva na variavel chefs, array de chefs
    let results = await Chef.all() 
    const chefs = results.rows

    // verifica se tem algum chef, caso nao tenha imprime a pagina vazia
    if (!chefs) return res.render('chefs/index')
    
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

    return res.render('chef/index', {chefs: allChefs})

  },
  create(req, res) {
    return res.render('chef/create');
  },
  async show(req, res) { // It's most organized

    // search chef
    let results = await Chef.find(req.params.id)
    const chef = results.rows[0]
    

    // check if chef exist
    if (!chef) return res.send("Chef not found!")


    //get image chef
    results = await Chef.file(chef.id)
    const chefImage = results.rows[0]

    chef.image = `${req.protocol}://${req.headers.host}${chefImage.path.replace("public", "")}`


    // search recipes of chef
    results = await Chef.findRecipes(req.params.id)
    let recipes = results.rows
    

    // add image on each recipe
    const recipesPromise = recipes.map(async (recipe, index) => {
      results = await Recipe.files(recipe.id)
      const recipeImage = results.rows[0].path
      recipes[index].image = `${req.protocol}://${req.headers.host}${recipeImage.replace("public", "")}`
    })

    await Promise.all(recipesPromise)


    return res.render('chef/detalhe', { chef, recipes })

  },
  async post(req, res) {

    const keys = Object.keys(req.body)
    const file = req.file

    for (key of keys) {
      if (req.body[key] == "" && key != "chef_image") {
        return res.send('Please, fill all fields!')
      }
    }

    const result = await File.create(file)
    const fileId = result.rows[0].id

    const results = await Chef.create(req.body, fileId)
    const chefId = results.rows[0].id


    return res.redirect(`/chefs/${chefId}`)

  },
  async edit(req, res) {

    let results = await Chef.find(req.params.id)

    const chef = results.rows[0]

    //get image chef
    results = await Chef.file(chef.id)
    const chefImage = results.rows[0]

    chef.image = `${req.protocol}://${req.headers.host}${chefImage.path.replace("public", "")}`

    return res.render('chef/edit', {chef})

  },
  async put(req, res) {
    const keys = Object.keys(req.body)
    const file = req.file

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    if(file) {
      const result = await File.create(file)
      const fileId = result.rows[0].id

      await Chef.update(req.body, fileId)

      return res.redirect(`/chefs/${req.body.id}`)
    } else {
      // get image
      let results = await Chef.file(req.body.id)
      let fileId = results.rows[0].file_id

      await Chef.update(req.body, fileId)

      return res.redirect(`/chefs/${req.body.id}`)
      
    }

  },
  async delete(req, res) {

    let results = await Chef.find(req.body.id)
  
    const chef = results.rows[0]


    if(chef.total_recipes == 0) {
      await Chef.delete(chef.id)
      
      await File.delete(chef.file_id)
      
      return res.redirect(`/chefs`)

    } else {
        return res.send("Chef not deleted, there are recipes linked")
    }
  }
}