const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
  async index(req, res) {

    // consulta todos os chefes no banco e salva na variavel chefs, array de chefs
    let results = await Chef.all() 
    const chefs = results.rows

    // verifica se tem algum chef, caso nao tenha imprime a pagina vazia
    if (!chefs) return res.render('admin/chefs/index')
    
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

    return res.render('admin/chef/index', {chefs: allChefs})

  },
  create(req, res) {
    return res.render('admin/chef/create');
  },
  show(req, res) {

    Chef.find(req.params.id, async function(chef, recipes) {
      if (!chef) return res.send("Chef not found!")

      //get image
      let results = await Chef.file(chef.id)
      let file = results.rows[0]

      if (!file)
        return res.render('admin/chef/detalhe', { chef, recipes})

      file.src = `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`

      return res.render('admin/chef/detalhe', { chef, recipes, file })
    })

  },
  async post(req, res) {

    const keys = Object.keys(req.body)
    const file = req.file

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')
      }
    }

    const result = await File.create(file)
    const fileId = result.rows[0].id

    const results = await Chef.create(req.body, fileId)
    const chefId = results.rows[0].id


    return res.redirect(`/admin/chefs/${chefId}`)

  },
  edit(req, res) {

    Chef.find(req.params.id, function(chef) {
      if (!chef) return res.send("Chef not found!")

      return res.render('admin/chef/edit', {chef});
    })
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

      return res.redirect(`/admin/chefs/${req.body.id}`)
    } else {
      // get image
      let results = await Chef.file(req.body.id)
      let fileId = results.rows[0].file_id

      await Chef.update(req.body, fileId)

      return res.redirect(`/admin/chefs/${req.body.id}`)
      
    }

  },
  delete(req, res) {

    Chef.find(req.body.id, function(chef, recipes) {
      if(chef.total_recipes == 0) {
        Chef.delete(req.body.id, function() {
          return res.redirect(`/admin/chefs`)
        })
      } else {
        return res.send("Chef not deleted, there are recipes linked")
      }
    })
  }
}