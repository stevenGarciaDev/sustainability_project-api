import Hapi from '@hapi/hapi';
import Schwifty from 'schwifty';
import { Model, knexSnakeCaseMappers } from 'objection';
import Knex from 'knex';

import { validateToken } from './auth-utils';
import { AuthController } from './controllers';

export default async (port, host) => {
  const server = new Hapi.Server({
    port,
    host,
    routes: {
      cors: {
        origin: ['*'],
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'Accept-language',
        ],
        additionalHeaders: ['X-Requested-With'],
      },
    },
  });

  const jwtScheme = () => {
    return {
      authenticate: (request, h) => {
        const userId = validateToken(request);
        return h.authenticated({ credentials: { userId } });
      },
    };
  };

  server.auth.scheme('jwt', jwtScheme);
  server.auth.strategy('jwt', 'jwt');
  server.auth.default('jwt');

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
    options: { knex },
  });

  AuthController(server);

  return server;
};
