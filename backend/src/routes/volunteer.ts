import express from 'express';
import { emailNewVolunteerApplication } from '../services/email';
import Volunteer from '../models/Volunteer';
import { optionalAuthMiddleware } from '../middleware/optionalAuth';

const router = express.Router();

// Volunteer application submission (public, but captures user ID if authenticated)
router.post('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { name, email, phone, volunteerType, skills, availability, message } = req.body;

    // Validate required fields
    if (!name || !email || !volunteerType || !skills || !availability) {
      return res.status(400).json({ message: 'Name, email, volunteer type, skills, and availability are required' });
    }

    // Store in MongoDB first
    const volunteer = new Volunteer({
      userId: req.user?.userId || undefined,
      name: name.toString().trim(),
      email: email.toString().trim(),
      phone: phone?.toString().trim() || '',
      volunteerType: volunteerType.toString().trim(),
      skills: skills.toString().trim(),
      availability: availability.toString().trim(),
      message: message?.toString().trim() || '',
    });

    await volunteer.save();

    // Send email notifications
    await emailNewVolunteerApplication({
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      volunteerType: volunteer.volunteerType,
      skills: volunteer.skills,
      availability: volunteer.availability,
      message: volunteer.message,
    });

    res.status(200).json({ 
      message: 'Volunteer application submitted successfully',
      volunteerId: volunteer._id 
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to submit application';
    console.error('Volunteer form error:', error);
    res.status(500).json({ message: msg });
  }
});

export default router;
