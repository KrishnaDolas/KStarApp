// Controllers/userController.js
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../Config/index');

// Register user with email, password, and optional role
exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Set default role if not provided
    const userRole = role || 'employee';

    // Validate role value
    if (!['employee', 'admin'].includes(userRole)) {
      return res.status(400).json({ error: 'Invalid role value' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role: userRole });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Login user with email and password
// Admin login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      secretKey,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Employee login
// Example in userController.js or your route handler

exports.employeeLogin = async (req, res, next) => {
  console.log('Received employeeLogin request:', req.body);
  try {
    const { email, password } = req.body;
    // existing code ...
    const user = await User.findOne({ email });
    console.log('Found user:', user);
    if (!user || user.role !== 'employee') {
      console.log('Invalid credentials or role mismatch');
      return res.status(401).json({ error: 'Invalid employee credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      secretKey,
      { expiresIn: '1h' }
    );
    console.log('Generated token:', token);
    res.json({ token });
  } catch (error) {
    console.error('Error in employeeLogin:', error);
    next(error);
  }
};

// Register admin user with email, password, and role
exports.registerAdmin = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Input validation
    if (!email || !password || role !== 'admin') {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};