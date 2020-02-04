import jwt from 'jsonwebtoken';

export default (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30 days' });
};
