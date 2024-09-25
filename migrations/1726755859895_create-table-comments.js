/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    date: {
      type: 'TEXT',
      notNull: true
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })

  pgm.addConstraint('comments', 'fk_comments.owner_users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE'
    }
  });


  pgm.addConstraint('comments', 'fk_comments.thread_id_threads.id', {
    foreignKeys: {
      columns: 'thread_id',
      references: 'threads(id)',
      onDelete: 'CASCADE'
    }
  });
};

exports.down = pgm => {
  pgm.dropConstraint('comments', 'fk_comments.owner_users.id');
  pgm.dropConstraint('comments', 'fk_comments.thread_id_threads.id');
  pgm.dropTable('comments');
};
