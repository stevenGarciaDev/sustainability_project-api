import Boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { transaction } from 'objection';

import { generateToken } from '../auth-utils';
import User from '../models/User';

const AuthController = (server) => {
  server.route({
    method: 'POST',
    path: '/signup',
    handler: async (req) => {
      const { username, password } = req.payload;
      const hashedPassword = await bcrypt.hash(password, 12);
      try {
        const user = await transaction(User, async (User) => {
          return User.query().insert({
            username,
            password: hashedPassword,
          });
        });
        return generateToken(user.id);
      } catch (error) {
        throw Boom.badRequest(error);
      }
    },
    options: {
      auth: false,
      validate: {
        payload: User.joiSchema,
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/login',
    handler: async (req) => {
      const { username, password } = req.payload;
      const user = await User.query().findOne({
        username,
      });
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return generateToken(user.id);
      }
      throw Boom.badRequest('Invalid credentials');
    },
    options: {
      auth: false,
      validate: {
        payload: User.joiSchema,
      },
    },
  });
};

export default AuthController;
