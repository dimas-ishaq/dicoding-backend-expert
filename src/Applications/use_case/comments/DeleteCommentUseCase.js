const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { id, owner } = useCasePayload;
    const deleteComment = new DeleteComment(useCasePayload);
    await this._commentRepository.verifyComment(id);
    await this._commentRepository.verifyCommentOwner(id, owner);
    await this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase
