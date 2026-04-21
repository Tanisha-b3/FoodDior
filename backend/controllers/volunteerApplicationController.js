import VolunteerApplication from '../models/VolunteerApplication.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { serializeUser } from '../utils/serializers.js';

const buildVolunteerName = (application) => `${application.firstName} ${application.lastName}`.trim();

const buildApplicationResponse = (application) => ({
  _id: application._id,
  id: application._id,
  firstName: application.firstName,
  lastName: application.lastName,
  email: application.email,
  phone: application.phone,
  city: application.city,
  state: application.state,
  skills: application.skills,
  availability: application.availability,
  status: application.status,
  userId: application.userId,
  reviewedAt: application.reviewedAt,
  createdAt: application.createdAt,
});

export const createVolunteerApplication = async (req, res) => {
  try {
    const application = new VolunteerApplication(req.body);
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVolunteerApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await VolunteerApplication.find(filter).sort({ createdAt: -1 });
    res.json(applications.map(buildApplicationResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveVolunteerApplication = async (req, res) => {
  try {
    const application = await VolunteerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Volunteer application not found' });
    }

    if (application.status === 'approved' && application.userId) {
      const approvedUser = await User.findById(application.userId).select('-password');

      return res.json({
        message: 'Volunteer application already approved',
        application: buildApplicationResponse(application),
        user: approvedUser ? serializeUser(approvedUser) : null,
        credentials: null,
      });
    }

    const fullName = buildVolunteerName(application);
    let user = await User.findOne({ email: application.email });
    let credentials = null;

    if (user) {
      user.name = fullName;
      user.phone = application.phone;
      user.city = application.city;
      user.state = application.state;
      user.role = 'volunteer';
      user.isActive = true;
      await user.save();
    } else {
      const temporaryPassword = `Temp@${randomBytes(4).toString('hex')}`;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

      user = await User.create({
        name: fullName,
        email: application.email,
        phone: application.phone,
        password: hashedPassword,
        role: 'volunteer',
        city: application.city,
        state: application.state,
      });

      credentials = {
        email: user.email,
        password: temporaryPassword,
      };
    }

    application.status = 'approved';
    application.userId = user._id;
    application.reviewedAt = new Date();
    await application.save();

    res.json({
      message: credentials
        ? 'Volunteer approved and login credentials generated'
        : 'Volunteer approved. Existing account upgraded to volunteer',
      application: buildApplicationResponse(application),
      user: serializeUser(user),
      credentials,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectVolunteerApplication = async (req, res) => {
  try {
    const application = await VolunteerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Volunteer application not found' });
    }

    application.status = 'rejected';
    application.reviewedAt = new Date();
    await application.save();

    res.json({
      message: 'Volunteer application rejected',
      application: buildApplicationResponse(application),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
