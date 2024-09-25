const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke unimplemented method', () => {
    //Arrange
    const commentRepository = new CommentRepository();

    //Action & Assert
    expect(commentRepository.addComment).toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentRepository.getCommentsByThreadId).toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentRepository.deleteComment).toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentRepository.verifyComment).toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(commentRepository.verifyCommentOwner).toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

  })
})