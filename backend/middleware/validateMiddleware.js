const Joi = require('joi');
const { errorResponse } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errors = error.details.map((d) => d.message.replace(/"/g, ''));
    return errorResponse(res, errors.join('; '), 422, errors);
  }
  next();
};

//  Auth Schemas 
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  department: Joi.string().optional(),
  semester: Joi.number().min(1).max(8).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

//  Company Schemas 
const companySchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(10).required(),
  website: Joi.string().uri().optional().allow(''),
  industry: Joi.string().optional().allow(''),
  headquarters: Joi.string().optional().allow(''),
  driveSchedule: Joi.date().optional(),
  driveVenue: Joi.string().optional().allow(''),
});

const roleSchema = Joi.object({
  roleTitle: Joi.string().required(),
  salaryPackage: Joi.string().required(),
  jobDescription: Joi.string().min(20).required(),
  responsibilities: Joi.array().items(Joi.string()).optional(),
  requiredSkills: Joi.array().items(Joi.string()).min(1).required(),
  interviewRounds: Joi.array().items(Joi.string()).optional(),
  openings: Joi.number().min(1).optional(),
  eligibilityCriteria: Joi.object({
    minCGPA: Joi.number().min(0).max(10).optional(),
    allowedDepartments: Joi.array().items(Joi.string()).optional(),
    allowedSemesters: Joi.array().items(Joi.number()).optional(),
  }).optional(),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  companySchema,
  roleSchema,
};