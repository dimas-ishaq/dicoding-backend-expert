const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const GetThread = require('../../../../Domains/threads/entities/GetThread');

describe('GetThreadUseCase', () => {
  it('should orchestrate the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };

    const mockThread = {
      id: 'thread-123',
      title: 'A Thread',
      body: 'Thread body',
      date: '2023-09-19T08:54:35.672Z',
      username: 'user-123',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'user-456',
        date: '2023-09-19T09:00:00.000Z',
        content: 'A comment',
        is_deleted: false,
      },
      {
        id: 'comment-456',
        username: 'user-789',
        date: '2023-09-19T09:05:00.000Z',
        content: '**komentar telah dihapus**',
        is_deleted: true,
      },
    ];

    const expectedThreadWithComments = {
      id: 'thread-123',
      title: 'A Thread',
      body: 'Thread body',
      date: '2023-09-19T08:54:35.672Z',
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          username: 'user-456',
          date: '2023-09-19T09:00:00.000Z',
          content: 'A comment',
        },
        {
          id: 'comment-456',
          username: 'user-789',
          date: '2023-09-19T09:05:00.000Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // Mocking the dependencies using proper domain repository classes
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking methods from the repositories
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(mockComments);

    // Creating an instance of GetThreadUseCase
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act (run the use case)
    const result = await getThreadUseCase.execute(useCasePayload);

    // Assert (ensure the function works as expected)
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.id);
    expect(result).toEqual(expectedThreadWithComments);
  });
});
