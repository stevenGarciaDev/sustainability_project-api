exports.up = function(knex) {
  return knex.schema.createTable('task', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .string('name')
      .notNullable()
      .unique();
    table
      .integer('totalCount')
      .unsigned()
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('task');
};
