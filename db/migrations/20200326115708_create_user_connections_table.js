exports.up = function(knex) {
  return knex.schema.createTable('user_connection', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    table.uuid('follower_id');
    table
      .foreign('follower_id')
      .references('user.id')
      .onDelete('CASCADE');

    table.uuid('user_followed_id');
    table.foreign('user_followed_id').references('user_id');

    table.unique(['follower_id', 'user_followed_id']);

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_connection');
};
