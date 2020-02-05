/* eslint-disable import/first */
require('dotenv').config();

import setupServer from './setupServer';

const init = async () => {
  try {
    const server = await setupServer(parseInt(process.env.PORT), '0.0.0.0');
    await server.initialize();
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (error) {
    console.error('Error starting server: ', error.message);
    throw error;
  }
};

init();
