import Boom from '@hapi/boom';

import Task from '../models/Task';

const TaskController = (server) => {
  server.route({
    method: 'GET',
    path: '/tasks',
    handler: async () => {
      try {
        const tasks = await Task.query();
        return tasks;
      } catch (error) {
        throw Boom.badRequest(error);
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/task',
    handler: async (req) => {
      console.log('payload', req.payload);
      // modify data
      // update database
      // return updated object
      return 'test';
    },
  });
};

export default TaskController;
