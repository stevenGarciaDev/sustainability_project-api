import jwt from 'jsonwebtoken';
import Boom from '@hapi/boom';

export default (request) => {
  const req = request.raw.req;
  const authorization = req.headers.authorization;
  console.log('req.headers', req.headers);
  if (!authorization) {
    throw Boom.unauthorized();
  }
  const token = authorization.replace('Bearer ', '');
  let tokenString = token.split(',');
  tokenString = tokenString[0];
  let decoded;
  // If verify fails, it will throw an error by itself
  try {
    decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
  } catch (error) {
    throw Boom.unauthorized();
  }
  return decoded.userId;
};
