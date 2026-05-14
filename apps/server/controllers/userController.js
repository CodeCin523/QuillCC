const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET /me
const getMe = async (req, res) => {
  res.json(req.user);
};

// PATCH /me
const updateMe = async (req, res) => {
  const updates = {};
  const { username, email, logo, password } = req.body;

  if (username) updates.username = username;
  if (email) updates.email = email;
  if (logo) updates.logo = logo;
  if (password) updates.passwordHash = await bcrypt.hash(password, 10);

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMe, updateMe };