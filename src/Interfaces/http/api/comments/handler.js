const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this)

  }
  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials
    const { threadId: thread_id } = request.params;
    const { content } = request.payload;

    const addComment = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addComment.execute({ content, thread_id, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request, h) {
    const { id: owner } = request.auth.credentials
    const { commentId: id } = request.params;
    const deleteComment = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteComment.execute({ id, owner });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response
  }

}

module.exports = CommentsHandler;