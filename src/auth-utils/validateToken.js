import jwt from 'jsonwebtoken';
import Boom from '@hapi/boom';

export default (request) => {
  const req = request.raw.req;
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw Boom.unauthorized();
  }
  const token = authorization.replace('Bearer ', '');
  let decoded;
  //If verify fails, it will throw an error by itself
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw Boom.unauthorized();
  }
  return decoded.userId;
};
