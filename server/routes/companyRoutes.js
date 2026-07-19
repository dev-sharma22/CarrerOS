import express from 'express';
import {
  getCompanies,
  getCompanyDetails,
  addInterviewExperience,
  createCompany,
  deleteCompany
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { cacheRoute } from '../middleware/cacheMiddleware.js';

const router = express.Router();

router.route('/')
  .get(cacheRoute(30), getCompanies)
  .post(protect, authorize('admin', 'recruiter'), createCompany);

router.route('/:name')
  .get(cacheRoute(30), getCompanyDetails)
  .delete(protect, authorize('admin', 'recruiter'), deleteCompany);

router.post('/:name/experience', protect, authorize('student'), addInterviewExperience);

export default router;
