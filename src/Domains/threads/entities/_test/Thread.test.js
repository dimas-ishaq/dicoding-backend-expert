const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title',
    };
    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 123,
      owner: 'owner-123'
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    // Arrange)
    const payload = {
      id: 'thread-123',
      title: 'title',
      owner: 'owner-123'
    };
    // Action
    const { id, title, owner } = new Thread(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
}
);
