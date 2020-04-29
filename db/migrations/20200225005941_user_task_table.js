exports.up = function(knex) {
  return knex.schema.createTable('user_task', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    table.uuid('user_id');
    table
      .foreign('user_id')
      .references('user.id')
      .onDelete('CASCADE');

    table.uuid('task_id');
    table
      .foreign('task_id')
      .references('task.id')
      .onDelete('CASCADE');

    table.unique(['user_id', 'task_id']);

    table
      .integer('count')
      .unsigned()
      .notNullable()
      .defaultTo(0);

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_task');
};
