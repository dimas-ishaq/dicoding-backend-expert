const AddComment = require('../../../../Domains/comments/entities/AddComment');
const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const Comment = require('../../../../Domains/comments/entities/Comment');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('AddCommentUseCase', () => {
  it('should throw NotFoundError when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      thread_id: 'thread-999', // Invalid thread ID
      owner: 'owner-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('Thread not found')));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError(NotFoundError);

    expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.thread_id);
  });

  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      thread_id: 'thread-123',
      owner: 'owner-123',
    };

    const mockComment = new Comment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new Comment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.thread_id);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
      thread_id: useCasePayload.thread_id,
      owner: useCasePayload.owner,
    }));
  });
});
