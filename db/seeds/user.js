/* eslint-disable camelcase */
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  await knex('user').del();
  const users = [
    {
      username: 'user1',
      password: 'password',
      first_name: 'test',
      last_name: 'ing',
    },
    {
      username: 'user2',
      password: 'password',
      first_name: 'test',
      last_name: 'ing',
    },
    {
      username: 'user3',
      password: 'password',
      first_name: 'test',
      last_name: 'ing',
    },
  ];

  await knex('user').insert(
    await Promise.all(
      users.map(async ({ username, password, first_name, last_name }) => ({
        username,
        password: await bcrypt.hash(password, 12),
        first_name,
        last_name,
      }))
    )
  );
};
