import express from 'express';
import { 
  createNotification, 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', createNotification);
router.get('/', getNotifications);
router.get('/user/:userId/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;