const mapDBToModel = require('../index');

describe('mapDBToModel', () => {
  it('should map thread data correctly with comments', () => {
    const threadRow = {
      id: 'thread-123',
      title: 'A Thread Title',
      body: 'A Thread Body',
      date: '2023-01-01T00:00:00.000Z',
      username: 'dicoding',
    };

    const comments = [
      {
        id: 'comment-1',
        username: 'user1',
        date: '2023-01-01T01:00:00.000Z',
        content: 'First comment content',
      },
      {
        id: 'comment-2',
        username: 'user2',
        date: '2023-01-01T02:00:00.000Z',
        content: 'Second comment content',
      },
    ];

    const expectedResult = {
      id: 'thread-123',
      title: 'A Thread Title',
      body: 'A Thread Body',
      date: '2023-01-01T00:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-1',
          username: 'user1',
          date: '2023-01-01T01:00:00.000Z',
          content: 'First comment content',
        },
        {
          id: 'comment-2',
          username: 'user2',
          date: '2023-01-01T02:00:00.000Z',
          content: 'Second comment content',
        },
      ],
    };

    const result = mapDBToModel(threadRow, comments);
    expect(result).toEqual(expectedResult);
  });

  it('should return comments as an empty array if none are provided', () => {
    const threadRow = {
      id: 'thread-123',
      title: 'A Thread Title',
      body: 'A Thread Body',
      date: '2023-01-01T00:00:00.000Z',
      username: 'dicoding',
    };
    const comments = []

    const result = mapDBToModel(threadRow, comments);
    const expectedResult = {
      id: 'thread-123',
      title: 'A Thread Title',
      body: 'A Thread Body',
      date: '2023-01-01T00:00:00.000Z',
      username: 'dicoding',
      comments: [], // Default to an empty array
    };

    expect(result).toEqual(expectedResult);
  });
});
