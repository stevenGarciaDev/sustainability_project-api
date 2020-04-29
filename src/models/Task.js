import Joi from '@hapi/joi';
import BaseModel from './BaseModel';

class Task extends BaseModel {
  static get tableName() {
    return 'task';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.string().guid(),
      name: Joi.string()
        .min(5)
        .max(40)
        .required(),
      totalCount: Joi.number()
        .integer()
        .min(0),
    });
  }
}

export default Task;
