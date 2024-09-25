const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({ id, content, thread_id, owner }) {
    const query = {
      text: 'INSERT INTO comments (id, content, thread_id, owner) VALUES($1, $2, $3, $4)',
      values: [id, content, thread_id, owner],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0]; // Mengembalikan komentar jika ditemukan
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE TRUE');
  },
};

module.exports = CommentsTableTestHelper;
