import jwt from 'jsonwebtoken';
import setupServer from '../src/setupServer';
import { User } from '../src/models';

describe('AuthController', () => {
  let server;
  let users;
  beforeEach(async () => {
    server = await setupServer(4001, 'localhost');
    users = await User.query();
  });

  describe('#post /signup', () => {
    it('creates a user given valid credentials', async () => {
      const payload = {
        username: 'test',
        password: 'password',
      };
      const res = await server.inject({
        method: 'post',
        url: '/signup',
        payload,
      });
      expect(res.statusCode).toBe(200);
      const createdUser = await User.query().findOne({
        username: payload.username,
      });
      expect(createdUser).toBeTruthy();
    });
    it('returns 400 when given invalid credentials', async () => {
      const payload = {
        username: 'notAUsername',
        password: 'short',
      };
      const res = await server.inject({
        method: 'post',
        url: '/signup',
        payload,
      });
      expect(res.statusCode).toBe(400);
    });
  });
  describe('#post /login', () => {
    it('returns a valid JWT token upon successful login', async () => {
      const payload = {
        username: users[0].username,
        password: 'password',
      };
      const res = await server.inject({
        method: 'post',
        url: '/login',
        payload,
      });
      const { token } = await JSON.parse(res.payload);
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      expect(userId).toEqual(users[0].id);
    });
    it('returns 400 when given invalid credentials', async () => {
      const payload = {
        username: users[0].username,
        password: 'wrong_password',
      };
      const res = await server.inject({
        method: 'post',
        url: '/login',
        payload,
      });
      expect(res.statusCode).toBe(400);
    });
  });
});
