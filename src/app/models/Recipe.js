const { date } = require('../../lib/utils');
const db = require('../../config/db');

module.exports = {
  all() {
    
    return db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
    ORDER BY title ASC`)
    
  },  
  create(data) {

    try {
      const query = `
      INSERT INTO recipes (
        title,
        chef_id,
        ingredients,
        preparation,
        information
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `

    const values = [
      data.title,
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
  find(id, callback) {
    db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`, [id], function(err, results) {
        if(err) throw `Database Error: ${err}`

        callback(results.rows[0])
      }
    )
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
  chefSelectOptions(callback) {
    db.query(`SELECT name, id FROM chefs`, function(err, results) {
      if(err) throw `Database error: ${err}`

      callback(results.rows)
    })
  },
  update(data, callback) {

    const query = `
    UPDATE recipes SET
      title=($1),
      chef_id=($2),
      ingredients=($3),
      preparation=($4),
      information=($5)
    WHERE id = $6
    `
    const values = [
      data.title,
      data.chef,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ]

    db.query(query, values, function(err, results) {
      if(err) throw `Database Error: ${err}`

      callback()
    })
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
  }
}