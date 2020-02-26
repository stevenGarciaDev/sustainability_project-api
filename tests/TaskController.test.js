import setupServer from '../src/setupServer';

import { User, Task, UserTask } from '../src/models';
import { generateAuthHeader } from '../test-utils';

describe('TaskController', () => {
  let server;
  let users;
  let tasks;
  let authHeader;

  beforeEach(async () => {
    server = await setupServer(4001, 'localhost');
    users = await User.query();
    tasks = await Task.query();
    authHeader = await generateAuthHeader(server, users[0]);
  });

  describe('#get /tasks', () => {
    it('returns an array of tasks with their total count and UserTask for the logged in user', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/tasks',
        headers: {
          Authorization: authHeader,
        },
      });
      expect(res.statusCode).toBe(200);

      expect(await JSON.parse(res.payload)).toEqual(
        expect.arrayContaining(
          await Promise.all(
            tasks.map(async (task) => {
              const userTask = await UserTask.query().findOne({
                taskId: task.id,
                userId: users[0].id,
              });

              return expect.objectContaining({
                id: task.id,
                name: task.name,
                totalCount: expect.any(Number),
                userTask: {
                  ...userTask,
                },
              });
            })
          )
        )
      );
    });
  });

  describe('#put /task', () => {
    let injectOptions;

    beforeEach(() => {
      injectOptions = {
        method: 'put',
        url: '/task',
        payload: {
          taskId: tasks[0].id,
        },
        headers: {
          Authorization: authHeader,
        },
      };
    });

    it('creates a UserTask if it does not exist, then increments the UserTask count by one', async () => {
      const res = await server.inject(injectOptions);
      expect(res.statusCode).toBe(200);
      const createdUserTask = await UserTask.query().findById(
        await JSON.parse(res.payload).id
      );
      expect(createdUserTask.count).toBe(1);
    });

    it('returns a 400 error if the user tries to update the same task before one hour has passed', async () => {
      await server.inject(injectOptions);
      const res = await server.inject(injectOptions);
      expect(res.statusCode).toBe(400);
    });
  });
});
