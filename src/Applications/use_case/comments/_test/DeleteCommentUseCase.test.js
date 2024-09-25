const DeleteComment = require('../../../../Domains/comments/entities/DeleteComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');

describe('DeleteCommentUseCase', () => {
  it('should throw NotFoundError when comment is not found', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-999',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    /** mocking verifyComment to throw NotFoundError */
    mockCommentRepository.verifyComment = jest.fn()
      .mockRejectedValue(new NotFoundError('Comment not found'));
    mockCommentRepository.verifyCommentOwner = jest.fn();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError(NotFoundError);

    expect(mockCommentRepository.verifyComment).toBeCalledWith(useCasePayload.id);
  });

  it('should throw AuthorizationError when owner is not authorized', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-456',  // This is not the comment's real owner
    };

    const mockCommentRepository = new CommentRepository();

    /** mocking verifyComment to return a comment with a different owner */

    mockCommentRepository.verifyComment = jest.fn()
      .mockResolvedValue(); // Comment exists but owned by another user

    /** mocking verifyCommentOwner to throw AuthorizationError */
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockRejectedValue(new AuthorizationError('You are not authorized to delete this comment'));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError(AuthorizationError);

    expect(mockCommentRepository.verifyComment).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.id, useCasePayload.owner);
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyComment = jest.fn()
      .mockResolvedValue();
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockResolvedValue();
    mockCommentRepository.deleteComment = jest.fn()
      .mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyComment).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.id, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(new DeleteComment(useCasePayload));
  });
});
