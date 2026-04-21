import express from 'express';
import {
  createVolunteerApplication,
  getVolunteerApplications,
  approveVolunteerApplication,
  rejectVolunteerApplication,
} from '../controllers/volunteerApplicationController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createVolunteerApplication);
router.get('/', getVolunteerApplications);
router.put('/:id/approve', authenticate, isAdmin, approveVolunteerApplication);
router.put('/:id/reject', authenticate, isAdmin, rejectVolunteerApplication);

export default router;
