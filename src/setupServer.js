import Hapi from '@hapi/hapi';
import Schwifty from 'schwifty';
import { Model, knexSnakeCaseMappers } from 'objection';
import Knex from 'knex';

import { AuthController } from './controllers';

export default async (port, host) => {
  const server = new Hapi.Server({
    port: port,
    host: host,
  });

  const DATABASE_URL =
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL;

  const knex = Knex({
    client: 'pg',
    connection: DATABASE_URL,
    ...knexSnakeCaseMappers(),
  });

  Model.knex(knex);

  await server.register({
    plugin: Schwifty.plugin,
    options: { knex: knex },
  });

  AuthController(server);

  return server;
};
