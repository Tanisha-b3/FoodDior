import express from 'express';
import { createContactMessage, getContactMessages } from '../controllers/contactMessageController.js';

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', getContactMessages);

export default router;
