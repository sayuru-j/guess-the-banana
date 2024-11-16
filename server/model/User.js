const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_-]+$/.test(v);
        },
        message:
          "Username can only contain letters, numbers, underscores and hyphens",
      },
    },
    pin: {
      type: String,
      required: [true, "PIN is required"],
      validate: {
        validator: function (v) {
          // Only validate PIN format for new records or when PIN is modified
          if (this.isNew || this.isModified("pin")) {
            return /^\d{4,6}$/.test(v);
          }
          return true;
        },
        message: "PIN must be between 4 and 6 digits",
      },
      select: false,
    },
    avatarUrl: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || validator.isURL(v);
        },
        message: "Avatar URL must be a valid URL",
      },
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the pin before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) {
    return next();
  }

  try {
    // Only hash if it's not already hashed (prevents double hashing)
    if (!this.pin.startsWith("$2a$")) {
      const salt = await bcrypt.genSalt(12);
      this.pin = await bcrypt.hash(this.pin.toString(), salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePin = async function (candidatePin) {
  try {
    return await bcrypt.compare(candidatePin.toString(), this.pin);
  } catch (error) {
    throw error;
  }
};

UserSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Add method to update login attempts without triggering pin validation
UserSchema.methods.updateLoginAttempts = async function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }
  // Use updateOne to bypass validation
  return await this.constructor.updateOne(
    { _id: this._id },
    {
      $set: {
        loginAttempts: this.loginAttempts,
        lockUntil: this.lockUntil,
      },
    }
  );
};

// Add method to reset login attempts without triggering pin validation
UserSchema.methods.resetLoginAttempts = async function () {
  // Use updateOne to bypass validation
  return await this.constructor.updateOne(
    { _id: this._id },
    {
      $set: {
        loginAttempts: 0,
        lockUntil: null,
        lastLogin: new Date(),
      },
    }
  );
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
