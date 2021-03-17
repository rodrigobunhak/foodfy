const db = require('../../config/db');
const { hash } = require('bcryptjs');

const Base = require('./Base')

Base.init({ table: 'users'})

module.exports = {
  ...Base,
  async all() {

    try {
      
      const query = `SELECT id, name, email FROM users`

      const results = await db.query(query)

      return results.rows

    } catch (error) {

      console.error(error)

    }

  },
  async register(data) {

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
  // async create(data) {

  //   try {
  //     const query = `
  //       INSERT INTO users (
  //         name,
  //         email,
  //         password,
  //         is_admin,
  //         first_access
  //       ) VALUES ($1, $2, $3, $4, $5)
  //       RETURNING id
  //   `
  //     // //hash of password
  //     // const passwordHash = await hash(data.password, 8)

  //     const values = [
  //       data.name,
  //       data.email,
  //       data.password,
  //       data.isAdmin,
  //       true
  //     ]

  //     const result = await db.query(query, values)
  //     return result.rows[0].id

  //   }catch(err) {
  //     console.error(err)
  //   }

  // },
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

  },
  async delete(id) {
    await db.query(`DELETE FROM users WHERE id = $1`, [id])

    return
  },
}