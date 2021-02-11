const { date } = require('../../lib/utils');
const db = require('../../config/db');

module.exports = {
  all() {
    
    return db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
    ORDER BY created_at DESC`)
    
  },  
  create(data, user) {

    try {
      const query = `
      INSERT INTO recipes (
        title,
        user_id,
        chef_id,
        ingredients,
        preparation,
        information
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

    const values = [
      data.title,
      data.user,
      data.chef,
      data.ingredients,
      data.preparation,
      data.information
    ]

      return db.query(query, values)
    }catch(err) {
      console.error(err)
    }

    
  },
  find(id) {
    // db.query(`
    //   SELECT recipes.*, chefs.name AS chef_name, users.name AS user_name
    //   FROM recipes
    //   LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    //   LEFT JOIN users ON (recipes.user_id = users.id)
    //   WHERE recipes.id = $1`, [id], function(err, results) {
    //     if(err) throw `Database Error: ${err}`

    //     callback(results.rows[0])
    //   }
    // )
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name, users.name AS user_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      LEFT JOIN users ON (recipes.user_id = users.id)
      WHERE recipes.id = $1`, [id])
  },
  
  findBy(filter, callback) {
    
    db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
    WHERE recipes.title ILIKE '%${filter}%'
    ORDER BY title ASC
    `
    ,
    function(err, results) {
      if(err) throw `Database Error: ${err}`

      callback(results.rows)
    }
    )
  },
  chefSelectOptions() {

    return db.query(`SELECT name, id FROM chefs`)

    // db.query(`SELECT name, id FROM chefs`, function(err, results) {
    //   if(err) throw `Database error: ${err}`

    //   callback(results.rows)
    // })
  },
  update(data) {

    try {
      const query = `
      UPDATE recipes SET
        title=($1),
        user_id=($2),
        chef_id=($3),
        ingredients=($4),
        preparation=($5),
        information=($6)
      WHERE id = $7
      `
      const values = [
        data.title,
        data.user,
        data.chef,
        data.ingredients,
        data.preparation,
        data.information,
        data.id
      ]

      return db.query(query, values)

    } catch (error) {
      console.error(err)
    }

  },
  delete(id) {
    return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
  },
  files(id) {
    return db.query(`
      SELECT recipe_files.*, files.path
      FROM recipe_files
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      WHERE recipe_id = $1
      ORDER BY file_id ASC
    `, [id])
  },
  search(params) {

    const { filter } = params

    let query = "",
    filterQuery = `WHERE`

    filterQuery = `
      ${filterQuery}
      recipes.title ilike '%${filter}%'
    `
    query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      ORDER BY updated_at DESC
    `

    return db.query(query)
  }
}