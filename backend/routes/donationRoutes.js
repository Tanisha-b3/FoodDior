import express from 'express';
import { 
  createDonation, 
  getDonations, 
  getDonationById, 
  updateDonation, 
  deleteDonation,
  updateDonationStatus 
} from '../controllers/donationController.js';

const router = express.Router();

router.post('/', createDonation);
router.get('/', getDonations);
router.get('/:id', getDonationById);
router.put('/:id', updateDonation);
router.delete('/:id', deleteDonation);
router.patch('/:id/status', updateDonationStatus);

export default router;