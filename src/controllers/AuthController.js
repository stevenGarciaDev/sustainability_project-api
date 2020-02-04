import Boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { transaction } from 'objection';

import { generateToken } from '../auth-utils';
import User from '../models/User';

const AuthController = (server) => {
  server.route({
    method: 'POST',
    path: '/signup',
    handler: async (req, h) => {
      const { username, password } = req.payload;
      const hashedPassword = await bcrypt.hash(password, 12);
      try {
        const user = await transaction(User, async (User) => {
          return await User.query().insert({
            username,
            password: hashedPassword,
          });
        });
        return { token: generateToken(user.id) };
      } catch (error) {
        throw Boom.badRequest(error);
      }
    },
    options: {
      validate: {
        payload: User.joiSchema,
      },
    },
  });
};

export default AuthController;
