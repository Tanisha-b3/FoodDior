import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import donationRoutes from './routes/donationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import contactMessageRoutes from './routes/contactMessageRoutes.js';
import volunteerApplicationRoutes from './routes/volunteerApplicationRoutes.js';
import communityRequestRoutes from './routes/communityRequestRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/api/auth", userRoutes)
app.use('/api/donations', donationRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact-messages', contactMessageRoutes);
app.use('/api/volunteer-applications', volunteerApplicationRoutes);
app.use('/api/community-requests', communityRequestRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Waste Food Management API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
