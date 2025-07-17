import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const createTaskSchema = Joi.object({
  url: Joi.string().uri().required(),
  selectors: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
  }).required(),
  pagination: Joi.object({
    enabled: Joi.boolean().required(),
    next_button_selector: Joi.string().when('enabled', {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().optional()
    })
  }).required()
});

export function validateCreateTask(req: Request, res: Response, next: NextFunction) {
  const { error } = createTaskSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
}

export function validateTaskId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      error: 'Invalid task ID'
    });
  }
  
  next();
}