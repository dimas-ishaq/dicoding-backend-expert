const GetThread = require('../GetThread');

describe('GetThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
    };
    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
    };
    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
    };
    // Action
    const { id } = new GetThread(payload);
    // Assert
    expect(id).toEqual('thread-123');
  });
})