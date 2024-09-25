const AddThread = require("../AddThread");

describe('AddThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title',
      // Missing body, owner, and date
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123, // Should be string
      body: 'body',
      owner: 'owner-123',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'body',
      owner: 'owner-123',
    };

    // Action
    const { title, body, date, owner } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
