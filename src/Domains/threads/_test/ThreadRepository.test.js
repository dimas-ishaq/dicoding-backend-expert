const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke unimplemented method', () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    expect(threadRepository.addThread).toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(threadRepository.getThreadById).toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(threadRepository.verifyThread).toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  })
})