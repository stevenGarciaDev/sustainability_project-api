import Joi from '@hapi/joi';
import { Model } from 'objection';

import BaseModel from './BaseModel';
import User from './User';
import Task from './Task';

class UserTask extends BaseModel {
  static get tableName() {
    return 'user_task';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.string(),
      userId: Joi.string()
        .guid()
        .required(),
      taskId: Joi.string()
        .guid()
        .required(),
      count: Joi.number()
        .integer()
        .min(0),
    });
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_task.user_id',
          to: 'user.id',
        },
      },
      task: {
        relation: Model.BelongsToOneRelation,
        modelClass: Task,
        join: {
          from: 'user_task.task_id',
          to: 'task.id',
        },
      },
    };
  }
}

export default UserTask;
