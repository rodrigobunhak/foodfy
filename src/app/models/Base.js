const db = require('../../config/db')

function find(filters, table) {
  
  try {
    let query = `SELECT * FROM ${table}`
    
    if(filters) {
      Object.keys(filters).map(key => {
        query += ` ${key}`
        Object.keys(filters[key]).map(field => {
          query += ` ${field} = '${filters[key][field]}'`
        })
      })
    }

    return db.query(query)

  } catch (error) {
    console.error(error)
  }
}

const Base = {
  init({ table }) {
    if(!table) throw new Error('Invalid Params')

    this.table = table
  },
  async find(id) {
    
    const results = await find({ where: {id}}, this.table)
    
    return results.rows[0]

  },
  async findOne(filters) {
    
    const results = await find(filters, this.table)
    
    return results.rows[0]

  },
  async findAll(filters) {
    
    const results = await find(filters, this.table)
    
    return results.rows

  },
  async create(fields) {

    try {
      let keys = [],
          values = []

      Object.keys(fields).map(key => {
        keys.push(key)

        if ((typeof fields[key]) === "object") {
          values.push(`'{${fields[key]}}'`)
        } else {
          values.push(`'${fields[key]}'`)
        }
      })

      const query = `INSERT INTO ${this.table} (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id`

      console.log("----------------------------------------")
      console.log(query)
      console.log("----------------------------------------")

      const results = await db.query(query)
      return results.rows[0].id

    } catch (error) {
      console.error(error);
    }
  },
  update(id, fields) {
    try {
      let update = []

      Object.keys(fields).map(key => {
        let line = ""
        if ((typeof fields[key]) === "object") {
          line = `${key} = '{${fields[key]}}'`
        } else {
          line = `${key} = '${fields[key]}'`
        }
        update.push(line)
      })
  
      let query = `UPDATE ${this.table} SET
      ${update.join(',')} WHERE id = ${id}
      `
  
      return db.query(query)

    } catch (error) {
      console.error(error);
    }
  },
  delete(id) {
    return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
  }
}

module.exports = Base
