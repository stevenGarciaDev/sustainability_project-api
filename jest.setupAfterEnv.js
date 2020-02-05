import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

const knex = Knex({
  client: 'pg',
  connection: process.env.TEST_DATABASE_URL,
  ...knexSnakeCaseMappers(),
});

global.beforeAll(async () => {
  await knex.migrate.latest({
    directory: './db/migrations',
  });
});

global.beforeEach(async () => {
  await knex.seed.run({
    directory: './db/seeds',
  });
});
