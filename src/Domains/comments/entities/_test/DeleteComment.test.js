const DeleteComment = require('../DeleteComment');

describe('DeleteComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123'

    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type spesification', () => {
    // Arrange  
    const payload = {
      id: 123,
      owner: 'user-123'
    };

    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123'
    };

    // Action
    const { id, owner } = new DeleteComment(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
  });
});

