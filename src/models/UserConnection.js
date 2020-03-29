import Joi from '@hapi/joi';
import BaseModel from './BaseModel';

class UserConnection extends BaseModel {
  static get tableName() {
    return 'user_connection';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.string().guid(),
      follower_id: Joi.string()
        .guid()
        .required(),
      user_followed_id: Joi.string()
        .guid()
        .required(),
    });
  }
}

export default UserConnection;
