const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require('../../../Infrastructures/repository/ThreadRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {

    it('should persist thread and return added thread correctly', async () => {
      // Arrange
      const user_id = 'user-123';
      const fakeUser = {
        id: user_id,
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      await UsersTableTestHelper.addUser(fakeUser);

      const newThread = {
        title: 'A Thread Title',
        body: 'A Thread Body',
        owner: user_id,
      };

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toBeDefined();
      expect(thread.id).toBe('thread-123');
      expect(thread.title).toBe('A Thread Title');
      expect(thread.body).toBe('A Thread Body');
      expect(thread.owner).toBe(user_id);
      expect(addedThread).toEqual({
        id: 'thread-123',
        title: 'A Thread Title',
        owner: user_id,
      });
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-999'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread correctly when thread exists', async () => {
      // Arrange
      const user_id = 'user-123';
      const fakeUser = {
        id: user_id,
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      await UsersTableTestHelper.addUser(fakeUser);

      const newThread = {
        title: 'A Thread Title',
        body: 'A Thread Body',
        owner: user_id,
      };

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(newThread);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toBe('thread-123');
      expect(thread.title).toBe('A Thread Title');
      expect(thread.body).toBe('A Thread Body');
      expect(thread.date).toBeDefined();
      expect(thread.username).toBe(fakeUser.username);
    });
  });

  describe('verifyThread function', () => {
    it('should throw NotFoundError when thread does not exist', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-999'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw error when thread exists', async () => {
      // Arrange
      const user_id = 'user-123';
      const fakeUser = {
        id: user_id,
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      await UsersTableTestHelper.addUser(fakeUser);

      const newThread = {
        title: 'A Thread Title',
        body: 'A Thread Body',
        owner: user_id,
      };

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(newThread);

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
