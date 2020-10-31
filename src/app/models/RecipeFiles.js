const db = require('../../config/db');

module.exports = {
  create(recipeId, fileId) {

    const query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [
      recipeId,
      fileId
    ]

    return db.query(query, values)
  },
  delete(fileId) {

    return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [fileId])
  }
}