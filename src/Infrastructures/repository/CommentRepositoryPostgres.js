const Comment = require('../../Domains/comments/entities/Comment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, thread_id, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments (id, content, thread_id, date, owner) VALUES($1,$2,$3,$4,$5) RETURNING id, content, owner',
      values: [id, content, thread_id, date, owner]
    }

    const result = await this._pool.query(query);
    return new Comment(result.rows[0])
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted FROM comments JOIN users ON comments.owner = users.id WHERE comments.thread_id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment({ id }) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyComment(id) {
    const queryCheck = {
      text: 'SELECT id, owner FROM comments WHERE id = $1',
      values: [id],
    };

    const checkResult = await this._pool.query(queryCheck);

    if (!checkResult.rowCount) {
      throw new NotFoundError('Comment not found');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('You are not authorized to delete this comment');
    }
  }

}

module.exports = CommentRepositoryPostgres;