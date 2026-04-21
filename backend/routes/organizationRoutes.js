import express from 'express';
import { 
  createOrganization, 
  getOrganizations, 
  getOrganizationById, 
  updateOrganization,
  verifyOrganization,
  deleteOrganization 
} from '../controllers/organizationController.js';

const router = express.Router();

router.post('/', createOrganization);
router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);
router.put('/:id', updateOrganization);
router.patch('/:id/verify', verifyOrganization);
router.delete('/:id', deleteOrganization);

export default router;