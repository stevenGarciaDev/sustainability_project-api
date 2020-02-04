import * as Hapi from '@hapi/hapi';

export default async (port, host) => {
  const server = new Hapi.Server({
    port: port,
    host: host,
  });

  return server;
};
