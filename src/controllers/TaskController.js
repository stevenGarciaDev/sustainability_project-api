import Boom from '@hapi/boom';

import { transaction } from 'objection';
import { Task, UserTask } from '../models';

const validateUpdateTime = (updatedAt) => {
  const hours = Math.floor(
    ((new Date() - new Date(updatedAt)) / (1000 * 60 * 60)) % 24
  );

  const nextUpdateAvailable = new Date(updatedAt);
  nextUpdateAvailable.setHours(nextUpdateAvailable.getHours() + 1);

  const remainingTime = nextUpdateAvailable - new Date();
  const secondsRemaining = Math.floor((remainingTime / 1000) % 60);
  const minutesRemaining = Math.floor((remainingTime / (1000 * 60)) % 60);

  if (hours < 1) {
    throw Boom.badRequest(
      `This task can be updated every hour. ${minutesRemaining} minutes and ${secondsRemaining} seconds remaining`
    );
  }
};

const TaskController = async (server) => {
  server.route({
    method: 'GET',
    path: '/tasks',
    handler: async () => {
      try {
        const tasks = await Task.query();
        const tasksWithTotals = await Promise.all(
          tasks.map(async (task) => {
            let totalCount = 0;
            const temp = await UserTask.query()
              .where({
                task_id: task.id,
              })
              .sum('count');
            if (temp[0].sum) {
              totalCount = Number(temp[0].sum);
            }
            return {
              ...task,
              totalCount,
            };
          })
        );
        return tasksWithTotals;
      } catch (error) {
        throw Boom.badRequest(error);
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/task',
    handler: async (req) => {
      try {
        const { userId, taskId } = req.payload;
        const userTask = await transaction(UserTask, async (UserTask) => {
          const where = {
            userId,
            taskId,
          };
          const userTask = await UserTask.query().findOne(where);
          if (userTask) {
            validateUpdateTime(userTask.updatedAt);
            return UserTask.query()
              .findOne(where)
              .increment('count', 1)
              .returning('*');
          }
          return UserTask.query()
            .insert({ ...where, count: 1 })
            .returning('*');
        });
        return userTask;
      } catch (err) {
        return err;
      }
    },
  });
};

export default TaskController;
