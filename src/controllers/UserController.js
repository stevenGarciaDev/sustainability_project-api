import Boom from '@hapi/boom';

import { User } from '../models';
import { UserConnection } from '../models';

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
        throw Boom.badRequest(err);
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/allUsers',
    handler: async (req) => {
      try {
        const { userId } = req.auth.credentials;
        const users = await User.query()
          .select('id', 'username', 'profilePhoto')
          .whereNot('id', userId);
        return users;
      } catch (err) {
        throw Boom.badRequest(err);
      }
    }
  });

  // get an array for the users whom the current user, userId,
  // is following
  server.route({
    method: 'GET',
    path: '/retrieveFollowedUsers',
    handler: async (req) => {
      try {
        const { userId } = req.auth.credentials;
        const response = await UserConnection.query()
          .where({
            follower_id: userId,
          }).then((data) => {
            return data;
          });
        return response;
      } catch (err) {
        throw Boom.badRequest(err);
      }
    }
  });

  // get an array for the users who are following
  // the current user, userId
  server.route({
    method: 'GET',
    path: '/retrieveFollowers',
    handler: async (req) => {
      try {
        const { userId } = req.auth.credentials;
        const response = await UserConnection.query()
          .where({
            user_followed_id: userId
          }).then((data) => {
            return data;
          });
          return response;
      } catch (err) {
        throw Boom.badRequest(err);
      }
    }
  })

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
            .update({
              username: user.username,
              password: user.password,
              id: user.id,
              profile_photo: req.payload.profile_photo,
              bio: req.payload.bio,
            })
            .returning('*')
            .catch((err) => console.error(err));
        }
      } catch (err) {
        console.log(err);
      }
      return [];
    },
  });

  server.route({
    method: 'POST',
    path: '/followUser',
    handler: async (req) => {
      try {
        const { userId } = req.auth.credentials;
        const response = await UserConnection.query().insert({
          follower_id: userId,
          user_followed_id: req.payload.user_to_follow_id,
        });
        return response;
      } catch (err) {
        console.log(err);
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/unfollowUser',
    handler: async (req) => {
      try {
        const { userId } = req.auth.credentials;
        const response = await UserConnection.query()
          .delete()
          .where('user_followed_id', req.payload.user_followed_id)
          .where('follower_id', userId);
        return response;
      } catch (err) {
        console.log(err);
      }
    }
  })
};

export default UserController;
