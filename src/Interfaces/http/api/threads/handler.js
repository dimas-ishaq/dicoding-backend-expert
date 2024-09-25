const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase')
const GetThreadUseCase = require('../../../../Applications/use_case/threads/GetThreadUseCase')

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this)

  }
  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { title, body } = request.payload;
    const addThread = this._container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThread.execute({ title, body, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201);
    return response;

  }

  async getThreadByIdHandler(request, h) {
    const { id } = request.params;
    const getThread = this._container.getInstance(GetThreadUseCase.name)
    const thread = await getThread.execute({ id });

    const response = h.response({
      status: 'success',
      data: {
        thread
      }
    })
    response.code(200);
    return response
  }
}

module.exports = ThreadsHandler;