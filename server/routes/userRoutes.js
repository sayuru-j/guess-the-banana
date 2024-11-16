const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let { username, pin, avatarUrl } = req.body;

    // Validate PIN format before attempting to save
    if (!/^\d{4,6}$/.test(pin.toString())) {
      return res.status(400).json({
        success: false,
        message: "PIN must be between 4 and 6 digits",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Create new user
    const user = new User({
      username: username.toLowerCase(),
      pin: pin.toString(),
      avatarUrl,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, pin } = req.body;

    // Find user and include the pin field
    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("+pin");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account is locked. Please try again in ${lockTime} minutes`,
      });
    }

    // Verify pin
    const isMatch = await user.comparePin(pin);
    if (!isMatch) {
      await user.updateLoginAttempts();

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        remainingAttempts: Math.max(0, 5 - user.loginAttempts),
      });
    }

    // Reset login attempts and update last login
    await user.resetLoginAttempts();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          lastLogin: user.lastLogin,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
