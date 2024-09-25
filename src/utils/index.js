const mapDBToModel = (row, comments) => {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    date: row.date,
    username: row.username,
    comments: comments.map(comment => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: (comment.is_deleted ? '**komentar telah dihapus**' : comment.content),
    })) || [] // Default to an empty array if no comments are provided
  };
};

module.exports = mapDBToModel;
