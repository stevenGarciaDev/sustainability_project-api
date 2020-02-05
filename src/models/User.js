import Joi from '@hapi/joi';
import BaseModel from './BaseModel';

class User extends BaseModel {
  static get tableName() {
    return 'user';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.string(),
      username: Joi.string()
        .min(3)
        .max(30)
        .required(),
      password: Joi.string()
        .min(8)
        .required(),
    });
  }
}

export default User;
