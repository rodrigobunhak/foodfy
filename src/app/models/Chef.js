const { date } = require('../../lib/utils');
const db = require('../../config/db');

module.exports = {
  all(callback) {

    db.query(`SELECT * FROM chefs ORDER BY name ASC`, function(err, results) {
      if(err) throw `Database Error: ${err}`

      callback(results.rows)
    })

  },
  create(data, callback) {
    
    const query = `
      INSERT INTO chefs (
        name,
        avatar_url,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `

    const values = [
      data.name,
      data.avatar_url,
      date(Date.now()).iso
    ]

    db.query(query, values, function(err, results) {
      if(err) throw `Database Error: ${err}`

      callback(results.rows[0])
    })
  },
  find(id, callback) {
    db.query(`
      SELECT *
      FROM chefs
      WHERE id = $1`, [id], function(err, chef_results) {
        if(err) throw `Database Error: ${err}`

        db.query(`
          SELECT recipes.*, chefs.name AS chef_name
          FROM recipes
          LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
          WHERE chefs.id = $1`, [id], function(err, recipes_results) {
            if(err) throw `Database Error: ${err}`
            
            callback(chef_results.rows[0], recipes_results.rows)
          })
      }
    )
  }
}