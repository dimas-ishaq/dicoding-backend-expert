const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: '123',
      owner: 'owner-123'
    }

    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      owner: 'owner-123'
    };
    // Action
    const { id, content, owner } = new Comment(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
})