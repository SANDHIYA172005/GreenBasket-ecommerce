const Contact = require('../models/Contact');

exports.submitContactForm = async (req, res, next) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({ success: false, message: 'First name, email, and message are required.' });
    }

    await Contact.create({
      firstName,
      lastName: lastName || '',
      email,
      subject: subject || 'general',
      message,
    });

    res.status(201).json({ success: true, message: 'Your message has been received. We will get back to you soon!' });
  } catch (err) {
    next(err);
  }
};
