exports.up = function(knex) {
  return knex.schema.table('user', function(t) {
    t.string('bio')
      .notNull()
      .defaultTo('');
  });
};

exports.down = function(knex) {
  return knex.schema.table('user', function(t) {
    t.dropColumn('bio');
    t.dropColumn('photo');
  });
};
