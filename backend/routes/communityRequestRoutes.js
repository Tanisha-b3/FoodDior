import express from 'express';
import { createCommunityRequest, getCommunityRequests } from '../controllers/communityRequestController.js';

const router = express.Router();

router.post('/', createCommunityRequest);
router.get('/', getCommunityRequests);

export default router;
