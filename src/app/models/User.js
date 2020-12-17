const db = require('../../config/db');
const { hash } = require('bcryptjs')

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

  }
}