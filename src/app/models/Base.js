const db = require('../../config/db')
const { create } = require('../controllers/UserController')

const Base = {
  init({ table }) {
    if(!table) throw new Error('Invalid Params')

    this.table = table
  },
  async findOne(filters) {
    try {
      let query = `SELECT * FROM ${this.table}`
      Object.keys(filters).map(key => {
        query = `${query}
        ${key}`
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
  async create(fields) {
    try {
      let keys = [],
          values = []

      Object.keys(fields).map(key => {
        keys.push(key)
        values.push(fields[key])
      })

      const query = `INSERT INTO ${this.table} (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id`

      const results = await db.query(query)
      return results.rows[0].id

    } catch (error) {
      console.error(error);
    }
  },
  async update(id, fields) {
    try {
      let update = []

      Object.keys(fields).map(key => {
        const line = `${key} = '${fields[key]}'`
        update.push(line)
      })
  
      let query = `UPDATE ${this.table} SET
      ${update.join(',')} WHERE id = ${id}
      `
  
      await db.query(query)
      return

    } catch (error) {
      console.error(error);
    }
  },
}

module.exports = Base