const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id, title, body, date, owner, }) {

    const query = {
      text: `INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner`,
      values: [id, title, body, date, owner],
    }
    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: `SELECT * FROM threads WHERE id = $1`,
      values: [id],
    }

    const result = await pool.query(query);
    return result.rows[0]
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },

}


module.exports = ThreadsTableTestHelper;