const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumapi'
    }
  }, {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentByIdHandler,
    options: {
      auth: 'forumapi'
    }
  }
]

module.exports = routes;