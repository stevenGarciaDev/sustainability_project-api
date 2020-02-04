import Boom from '@hapi/boom';
import User from '../models/User';

const AuthController = (server) => {
  server.route({
    method: 'POST',
    path: '/signup',
    handler: async (req, h) => {
      const { username, password } = req.payload;
      const { error } = User.joiSchema.validate({ username, password });
      if (error) {
        throw Boom.badRequest(error);
      }

      const user = await User.query().insert({
        username,
        password,
      });
      return user;
    },
  });
};

export default AuthController;
