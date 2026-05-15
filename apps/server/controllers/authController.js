const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createDefaultWorkspace = require('../utils/ensureUserWorkspace');

const register = async (req, res) => {
  const { username, email, password, logo } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    user = new User({
      username,
      email,
      passwordHash,
      logo,
    });

    await user.save();

    // Create default workspace
    await createDefaultWorkspace(
      user._id,
      username,
    );

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.status(201).json({
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    // Ensure user has a workspace
    await createDefaultWorkspace(
      user._id,
      user.username,
    );

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.json({
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { register, login };