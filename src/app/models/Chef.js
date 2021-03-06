const { date } = require('../../lib/utils');
const db = require('../../config/db');

module.exports = {
  all(callback) {

    return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes 
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY chefs.name ASC
    `)

  },
  create(data, fileId) {
    
    try {
      const query = `
        INSERT INTO chefs (
          name,
          file_id
        ) VALUES ($1, $2)
        RETURNING id
    `

      const values = [
        data.name,
        fileId
      ]

      return db.query(query, values)
    }catch(err) {
      console.error(err)
    }
  },
  find(id) {
    return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes 
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      HAVING chefs.id = $1`, [id])
  },
  findRecipes(id) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1`, [id])
  },
  update(data, fileId) {

    try {
      const query = `
      UPDATE chefs SET
        name=($1),
        file_id=($2)
      WHERE id = $3
      `

      const values = [
        data.name,
        fileId,
        data.id
      ]

      return db.query(query, values)
    }catch(err) {
      console.error(err)
    }

  },
  delete(id) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
  },
  file(id) {
    return db.query(`
      SELECT *
      FROM files
      LEFT JOIN chefs ON (chefs.file_id = files.id)
      WHERE chefs.id = $1
    `, [id])
  }
}
