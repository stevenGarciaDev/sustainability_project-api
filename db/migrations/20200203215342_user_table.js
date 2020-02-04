exports.up = function(knex) {
  return knex.schema.createTable('user', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .string('username')
      .notNullable()
      .unique();
    table.string('password').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
