const express = require('express');
const router = express.Router();
const {
  createCompany, getAllCompanies, getCompanyById,
  updateCompany, deleteCompany,
  addRole, updateRole, deleteRole,
  postUpdate, checkEligibility,
} = require('../controllers/companyController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validate, companySchema, roleSchema } = require('../middleware/validateMiddleware');

// Public / Student
router.get('/', authenticate, getAllCompanies);
router.get('/:id', authenticate, getCompanyById);
router.get('/:id/eligibility', authenticate, authorize('student'), checkEligibility);

// Admin only
router.post('/', authenticate, authorize('admin'), validate(companySchema), createCompany);
router.put('/:id', authenticate, authorize('admin'), updateCompany);
router.delete('/:id', authenticate, authorize('admin'), deleteCompany);

// Roles
router.post('/:id/roles', authenticate, authorize('admin'), validate(roleSchema), addRole);
router.put('/:companyId/roles/:roleId', authenticate, authorize('admin'), updateRole);
router.delete('/:companyId/roles/:roleId', authenticate, authorize('admin'), deleteRole);

// Updates
router.post('/:id/updates', authenticate, authorize('admin'), postUpdate);

module.exports = router;