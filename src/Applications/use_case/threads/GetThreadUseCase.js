const GetThread = require('../../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const getThread = new GetThread(useCasePayload);
    const thread = await this._threadRepository.getThreadById(getThread.id);
    const comments = await this._commentRepository.getCommentsByThreadId(getThread.id);
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
    }));

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: formattedComments,
    };
  }
}

module.exports = GetThreadUseCase;