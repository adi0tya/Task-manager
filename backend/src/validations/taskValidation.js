const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Title must be at least 2 characters.',
    'string.max': 'Title cannot exceed 100 characters.',
    'any.required': 'Title is required.',
  }),
  description: Joi.string().max(500).allow('').default('').messages({
    'string.max': 'Description cannot exceed 500 characters.',
  }),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(2).max(100).messages({
    'string.min': 'Title must be at least 2 characters.',
    'string.max': 'Title cannot exceed 100 characters.',
  }),
  description: Joi.string().max(500).allow('').messages({
    'string.max': 'Description cannot exceed 500 characters.',
  }),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ success: false, message: messages });
  }
  req.body = value;
  next();
};

module.exports = {
  validateCreateTask: validate(createTaskSchema),
  validateUpdateTask: validate(updateTaskSchema),
};
