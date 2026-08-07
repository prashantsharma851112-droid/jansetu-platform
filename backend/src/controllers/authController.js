const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jansetu_secret', {
    expiresIn: '30d',
  });
};

const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `+91${cleaned}`;
  if (cleaned.length === 12 && cleaned.startsWith('91')) return `+${cleaned}`;
  return phone.startsWith('+') ? phone : `+${cleaned}`;
};

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const formattedPhone = formatPhoneNumber(phone);
    if (formattedPhone.length < 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number' });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Clear old OTPs for this phone
    await Otp.deleteMany({ phone: formattedPhone });

    // Store new OTP
    await Otp.create({ phone: formattedPhone, code });

    console.log(`📱 [SMS OTP SIMULATOR] Sent OTP ${code} to ${formattedPhone}`);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${formattedPhone}`,
      phone: formattedPhone,
      otp: code, // Sent in response for instant demo testing & UI notification toast
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and OTP code are required' });
    }

    const formattedPhone = formatPhoneNumber(phone);
    const validOtp = await Otp.findOne({ phone: formattedPhone, code: otp.trim() });

    if (!validOtp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    // Find existing citizen user by phone
    const user = await User.findOne({ phone: formattedPhone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered citizen account found with this phone number. Please complete registration first with your Full Name, Email, and Password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated by Admin' });
    }

    // Delete used OTP
    await Otp.deleteMany({ phone: formattedPhone });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. Logged in.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        area: user.area,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerWithOtp = async (req, res) => {
  try {
    const { name, email, password, phone, address, area, otp } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email Address is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit Phone Number is required' });
    }
    if (!area || !area.trim()) {
      return res.status(400).json({ success: false, message: 'Residential Area / Ward is required' });
    }
    if (!otp || !otp.trim()) {
      return res.status(400).json({ success: false, message: 'OTP verification code is required' });
    }

    const formattedPhone = formatPhoneNumber(phone);
    const validOtp = await Otp.findOne({ phone: formattedPhone, code: otp.trim() });

    if (!validOtp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists' });
    }

    const existingPhone = await User.findOne({ phone: formattedPhone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'An account with this phone number already exists. Please login instead.' });
    }

    // Clear used OTP
    await Otp.deleteMany({ phone: formattedPhone });

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password,
      phone: formattedPhone,
      address: address || '',
      area: area.trim(),
      department: 'General Civic Care',
      role: 'CITIZEN',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Citizen account created and verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        area: user.area,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, area } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Public registration is strictly for CITIZEN role only.
    // Worker accounts are provisioned exclusively by Admin.
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      phone: phone || '',
      address: address || '',
      area: area || 'Central Zone',
      department: 'General Civic Care',
      role: 'CITIZEN',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        area: user.area,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: `No account found with email '${cleanEmail}'` });
    }

    const isMatch = await user.comparePassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password entered' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated by Admin' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        area: user.area,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, area, avatar, password, department } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (area !== undefined) user.area = area;
    if (avatar) user.avatar = avatar;
    if (department) user.department = department;
    if (password) user.passwordHash = password;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        area: user.area,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
