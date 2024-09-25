const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumapi'
    }
  },
  {
    method: 'GET',
    path: '/threads/{id}',
    handler: handler.getThreadByIdHandler
  }
]

module.exports = routes;