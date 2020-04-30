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
    handler: () => {
      try {
        return Task.query();
      } catch (err) {
        return err;
      }
    },
  });
  server.route({
    method: 'GET',
    path: '/tasks/user',
    handler: async (req) => {
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
            const { userId } = req.auth.credentials;
            const userTask = await UserTask.query().findOne({
              task_id: task.id,
              user_id: userId,
            });

            return {
              ...task,
              totalCount,
              userTask: {
                ...userTask,
              },
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
    method: 'GET',
    path: '/retrieveUserTaskCount',
    handler: async (req) => {
      try {
        const { userId } = req.auth.credentials;
        const response = await UserTask.query()
          .sum('count')
          .where('user_id', userId);
        return response[0];
      } catch (err) {
        console.log(err);
        return Boom.badRequest();
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/task',
    handler: async (req) => {
      try {
        const { userId } = req.auth.credentials;
        const { taskId } = req.payload;
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

  server.route({
    method: 'GET',
    path: '/task/leaderboard',
    handler: async (req) => {
      const { taskId } = req.query;
      try {
        const userTasks = await UserTask.query()
          .join('user', 'user.id', 'user_task.user_id')
          .join('task', 'task.id', 'user_task.task_id')
          .select([
            'task_id',
            'task.name',
            'user_id',
            'username',
            'profile_photo',
            'count',
          ])
          .orderBy('username')
          .orderBy('count', 'desc')
          .where({
            taskId,
          });

        return userTasks;
      } catch (error) {
        throw Boom.badRequest();
      }
    },
  });
};

export default TaskController;
