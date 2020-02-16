exports.seed = async function(knex) {
  await knex('task').del();
  const tasks = [
    {
      name: 'Recycle',
      totalCount: 100,
    },
    {
      name: 'Support EcoFriendly Companies',
      totalCount: 57,
    },
    {
      name: 'Carpool/Take public transport',
      totalCount: 52,
    },
    {
      name: 'Use Reusable Bags',
      totalCount: 210,
    },
    {
      name: 'Donate used goods',
      totalCount: 24,
    },
    {
      name: 'Avoid disposable products',
      totalCount: 18,
    },
    {
      name: 'Unplug electronics when not in use',
      totalCount: 72,
    },
    {
      name: 'Eating locally-grown food',
      totalCount: 91,
    },
  ];

  await knex('task').insert(
    await Promise.all(
      tasks.map(async ({ name, totalCount }) => ({
        name,
        totalCount,
      }))
    )
  );
};
