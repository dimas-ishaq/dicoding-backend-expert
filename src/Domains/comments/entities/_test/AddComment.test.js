const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Comment Content'
    };
    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      thread_id: 'thread-123',
      owner: 'owner-123'
    };
    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'Comment Content',
      thread_id: 'thread-123',
      owner: 'owner-123'
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.thread_id).toEqual(payload.thread_id);
    expect(addComment.owner).toEqual(payload.owner);
  });

})