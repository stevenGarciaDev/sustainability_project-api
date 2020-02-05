import bcrypt from 'bcrypt';

exports.seed = async function(knex) {
  await knex('user').del();
  const users = [
    {
      username: 'user1',
      password: 'password',
    },
    {
      username: 'user2',
      password: 'password',
    },
    {
      username: 'user3',
      password: 'password',
    },
  ];

  await knex('user').insert(
    await Promise.all(
      users.map(async ({ username, password }) => ({
        username,
        password: await bcrypt.hash(password, 12),
      }))
    )
  );
};
