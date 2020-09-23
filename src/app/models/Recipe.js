const { date } = require('../../lib/utils');
const db = require('../../config/db');

module.exports = {
  all(callback) {
    
    db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
    ORDER BY title ASC`, function(err, results){
      if(err) throw `Database Error: ${err}`;

      callback(results.rows);
    })

  },  
  create(data, callback) {

    const query = `
      INSERT INTO recipes (
        title,
        image,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

    const values = [
      data.title,
      data.image,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
    ]

    db.query(query, values, function(err, results) {
      if(err) throw `Database Error: ${err}`

      callback(results.rows[0])
    })
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
      image=($3),
      ingredients=($4),
      preparation=($5),
      information=($6)
    WHERE id = $7
    `
    const values = [
      data.title,
      data.chef,
      data.image,
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
  delete(id, callback) {
    db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
      if(err) throw `Database Error: ${err}`

      callback()
    })
  }
}