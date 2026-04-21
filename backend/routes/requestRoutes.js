import express from 'express';
import { 
  createRequest, 
  getRequests, 
  getRequestById, 
  updateRequestStatus, 
  deleteRequest,
  getMyRequests 
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/', createRequest);
router.get('/', getRequests);
router.get('/my/:userId', getMyRequests);
router.get('/:id', getRequestById);
router.patch('/:id', updateRequestStatus);
router.delete('/:id', deleteRequest);

export default router;