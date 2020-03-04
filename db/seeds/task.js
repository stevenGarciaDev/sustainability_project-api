exports.seed = async function(knex) {
  await knex('task').del();
  const tasks = [
    {
      name: 'Recycle',
    },
    {
      name: 'Support EcoFriendly Companies',
    },
    {
      name: 'Carpool/Take public transport',
    },
    {
      name: 'Use Reusable Bags',
    },
    {
      name: 'Donate used goods',
    },
    {
      name: 'Avoid disposable products',
    },
    {
      name: 'Unplug electronics when not in use',
    },
    {
      name: 'Eating locally-grown food',
    },
  ];

  await knex('task').insert(
    await Promise.all(
      tasks.map(async ({ name }) => ({
        name,
      }))
    )
  );
};
