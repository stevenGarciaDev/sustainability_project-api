exports.up = function(knex) {
  return knex.schema.table('user', function(t) {
    t.string('profile_photo').defaultTo(
      'https://www.indiewire.com/wp-content/uploads/2017/12/shutterstock_5886251dc.jpg'
    );
  });
};

exports.down = function(knex) {
  return knex.schema.table('user', function(t) {
    t.dropColumn('profile_photo');
  });
};
