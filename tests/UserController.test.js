import setupServer from '../src/setupServer';

import { User } from '../src/models';
import { generateAuthHeader } from '../test-utils';

describe('UserController', () => {
  let server;
  let users;
  let authHeader;

  beforeEach(async () => {
    server = await setupServer(4001, 'localhost');
    users = await User.query();
    authHeader = await generateAuthHeader(server, users[0]);
  });

  describe('#get /profileSettings', () => {
    it('returns a user object with their bio and photo info', async () => {
      const response = await server.inject({
        method: 'get',
        url: '/profileSettings',
        headers: {
          Authorization: authHeader,
        },
      });
      expect(response.statusCode).toBe(200);
      const user = await JSON.parse(response.payload);
      return expect(user).toEqual(
        expect.objectContaining({
          id: user.id,
          username: user.username,
          password: user.password,
          bio: user.bio,
          profilePhoto: user.profilePhoto,
        })
      );
    });
  });

  describe('#put /updateProfileSettings', () => {
    it('updates the bio for the user successfully', async () => {
      const bio = 'Updated Bio';
      const response = await server.inject({
        method: 'put',
        url: '/updateProfileSettings',
        payload: {
          bio,
        },
        headers: {
          Authorization: authHeader,
        },
      });
      expect(response.statusCode).toBe(200);
    });
  });
});
