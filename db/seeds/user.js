const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  await knex('user').del();
  const users = [
    {
      username: 'user1',
      password: 'password',
      firstName: 'test',
      lastName: 'ing',
    },
    {
      username: 'user2',
      password: 'password',
      firstName: 'test',
      lastName: 'ing',
    },
    {
      username: 'user3',
      password: 'password',
      firstName: 'test',
      lastName: 'ing',
    },
  ];

  await knex('user').insert(
    await Promise.all(
      users.map(async ({ username, password, firstName, lastName }) => ({
        username,
        password: await bcrypt.hash(password, 12),
        firstName,
        lastName,
      }))
    )
  );
};
