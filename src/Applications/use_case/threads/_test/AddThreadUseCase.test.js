const AddThread = require('../../../../Domains/threads/entities/AddThread');
const Thread = require('../../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
      owner: 'owner-123'
    };

    const mockThread = new Thread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,  // Pass as an object
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new Thread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));

  })
})