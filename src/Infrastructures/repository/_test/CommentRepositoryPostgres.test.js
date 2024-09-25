const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  const user_id = 'user-123';
  const thread_id = 'thread-123';

  const fakerUser = {
    id: user_id,
    username: 'dicoding',
    password: 'secret_password',
    fullname: 'Dicoding Indonesia',
  };

  const fakerThread = {
    id: thread_id,
    title: 'A Thread Title',
    body: 'A Thread Body',
    date: new Date().toISOString(),
    owner: user_id,
  };

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(fakerUser);
    await ThreadsTableTestHelper.addThread(fakerThread);
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment and return added comment correctly', async () => {
      const newComment = {
        content: 'A comment content',
        thread_id: thread_id,
        owner: user_id,
      };

      const fakeIdGenerator = () => '123'; // Stub ID generator
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert that the comment is correctly added to the database
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toBeDefined();
      expect(comment.id).toBe('comment-123');
      expect(comment.content).toBe('A comment content');
      expect(comment.owner).toBe(user_id);

      // Assert returned value matches the Comment entity
      expect(addedComment).toEqual({
        id: 'comment-123',
        content: 'A comment content',
        owner: user_id,
      });
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments associated with the thread', async () => {
      // Arrange
      const newComment = {
        content: 'A comment content',
        thread_id: thread_id,
        owner: user_id,
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Add comment
      await commentRepositoryPostgres.addComment(newComment);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(thread_id);

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toEqual({
        id: 'comment-123',
        username: 'dicoding',
        date: expect.any(String), // Expect date to be a valid string
        is_deleted: expect.any(Boolean),
        content: 'A comment content',
      });
    });
  });

  describe('deleteComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('comment-999'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should perform a soft delete and update comment content to indicate deletion', async () => {
      // Arrange
      const newComment = {
        content: 'A comment content',
        thread_id: thread_id,
        owner: user_id,
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Add comment
      await commentRepositoryPostgres.addComment(newComment);

      // Soft delete comment
      await commentRepositoryPostgres.deleteComment({ id: 'comment-123' });

      // Assert the comment was soft deleted
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toBeDefined();
      expect(comment.id).toEqual('comment-123');
      expect(comment.owner).toEqual(user_id);
      expect(comment.is_deleted).toEqual(true);
      expect(comment.content).toEqual(newComment.content);
      expect(comment.date).toBeDefined();
    });
  });

  describe('verifyComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepositoryPostgres.verifyComment('comment-999'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw error if comment is found', async () => {
      // Arrange
      const newComment = {
        content: 'A comment content',
        thread_id: thread_id,
        owner: user_id,
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Add comment
      await commentRepositoryPostgres.addComment(newComment);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });

  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when owner does not match', async () => {
      // Arrange
      const newComment = {
        content: 'A comment content',
        thread_id: thread_id,
        owner: user_id,
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Add comment
      await commentRepositoryPostgres.addComment(newComment);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw any error when owner matches', async () => {
      // Arrange
      const newComment = {
        content: 'A comment content',
        thread_id: thread_id,
        owner: user_id,
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Add comment
      await commentRepositoryPostgres.addComment(newComment);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', user_id))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
});
