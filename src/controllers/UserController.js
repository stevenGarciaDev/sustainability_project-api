import Boom from '@hapi/boom';

import { User } from '../models';

const UserController = async (server) => {
  server.route({
    method: 'GET',
    path: '/profileSettings',
    handler: async (req) => {
      try {
        const { userId } = req.auth.credentials;
        const response = await User.query()
          .where({
            id: userId,
          })
          .then((userInfo) => {
            return userInfo[0];
          });
        return response;
      } catch (err) {
        console.log(`err is ${err}`);
      }
      return [];
    },
	});

  server.route({
    method: 'PUT',
    path: '/updateProfileSettings',
    handler: async (req) => {
      try {
        const { userId } = req.auth.credentials;
        const where = { id: userId };
				const user = await User.query().findOne(where);
        if (user && req.payload.bio) {
          return User.query()
            .findOne(where)
            .update({ ...user, bio : req.payload.bio })
						.returning('*')
            .catch((err) => console.log('error', err));
        }
      } catch (err) {
				console.log(err);
      }
      return [];
    },
  });
};

export default UserController;
