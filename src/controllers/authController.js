const User = require('../models/User');

// Register a new user
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, gender } = req.body;

    // Check if user already exists with email or phone
    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    if (query.length > 0) {
      const existingUser = await User.findOne({
        $or: query,
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'User already exists with this email or phone',
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      gender,
    });

    // Generate token
    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      statusCode: 201,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          gender: user.gender,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    // Check if either email or phone is provided
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Please provide email or phone',
      });
    }

    // Find user by email or phone and include password field
    const query = email ? { email } : { phone };
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'Invalid credentials',
      });
    }

    // Generate token
    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      statusCode: 200,
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          phone: user.phone,
          name: user?.name,
          gender: user?.gender,
          role: user?.role,

        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current logged in user (POST method)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Search user by email or phone with pagination (POST method)
const searchUser = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.body.page) || 1,
      limit: parseInt(req.body.limit) || 10,
      sort: req.body.sort || { createdAt: -1 },
      select: '-password',
    };

    const users = await User.paginate(req.body.search || {}, options);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ statusCode: 200, data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ statusCode: 200, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  searchUser,
  updateUser,
  deleteUser,
};
