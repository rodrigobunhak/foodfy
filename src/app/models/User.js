const db = require('../../config/db');
const { hash } = require('bcryptjs');
const { update } = require('../controllers/UserController');

module.exports = {
  async findOne(filters) {
    
    try {
      
      let query = `SELECT * FROM users`

      Object.keys(filters).map(key => {
      
      query = `${query}
      ${key}
      `

      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'`
      })

      })

      const results = await db.query(query)
      return results.rows[0]

    } catch (error) {
      console.error(error)
    }

  },
  async create(data) {

    try {
      const query = `
        INSERT INTO users (
          name,
          email,
          password
        ) VALUES ($1, $2, $3)
        RETURNING id
    `
    //hash of password
    const passwordHash = await hash(data.password, 8)

      const values = [
        data.name,
        data.email,
        passwordHash
      ]

      const result = await db.query(query, values)
      return result.rows[0].id

    }catch(err) {
      console.error(err)
    }

  },
  async update(id, fields) {

    let query = "UPDATE users SET"

    Object.keys(fields).map((key, index, array) => {
      if((index + 1) < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',  
        `
      } else {
        // last iteration
        query = `${query}
          ${key} = '${fields[key]}'
          WHERE id = ${id}  
        `
      }
    })

    await db.query(query)
    return

  }
}