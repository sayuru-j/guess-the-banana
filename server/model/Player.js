const mongoose = require("mongoose");

const GameplaySchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
      min: 1,
    },
    highestScore: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const PlayerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gameplay: [GameplaySchema],
    totalGamesPlayed: {
      type: Number,
      default: 0,
    },
    highestOverallScore: {
      type: Number,
      default: 0,
    },
    lastPlayed: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
PlayerSchema.index({ userId: 1 });
PlayerSchema.index({ "gameplay.level": 1 });
PlayerSchema.index({ "gameplay.highestScore": -1 });

// Method to add new gameplay record
PlayerSchema.methods.addGameplay = async function (level, score) {
  // Find existing gameplay record for this level
  const existingGameplay = this.gameplay.find((g) => g.level === level);

  if (existingGameplay) {
    // Update if new score is higher
    if (score > existingGameplay.highestScore) {
      existingGameplay.highestScore = score;
      existingGameplay.timestamp = new Date();
    }
  } else {
    // Add new gameplay record
    this.gameplay.push({
      level,
      highestScore: score,
      timestamp: new Date(),
    });
  }

  // Update player statistics
  this.totalGamesPlayed += 1;
  this.lastPlayed = new Date();
  this.highestOverallScore = Math.max(this.highestOverallScore, score);

  // Save the changes
  return await this.save();
};

// Static method to get player leaderboard
PlayerSchema.statics.getLeaderboard = async function (level = null) {
  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
  ];

  if (level) {
    // Leaderboard for specific level
    pipeline.push(
      {
        $unwind: "$gameplay",
      },
      {
        $match: {
          "gameplay.level": level,
        },
      },
      {
        $sort: {
          "gameplay.highestScore": -1,
        },
      }
    );
  } else {
    // Overall leaderboard
    pipeline.push({
      $sort: {
        highestOverallScore: -1,
      },
    });
  }

  pipeline.push(
    {
      $project: {
        name: 1,
        score: level ? "$gameplay.highestScore" : "$highestOverallScore",
        level: level ? "$gameplay.level" : null,
        lastPlayed: 1,
      },
    },
    {
      $limit: 10,
    }
  );

  return await this.aggregate(pipeline);
};

// Method to get player statistics
PlayerSchema.methods.getStats = function () {
  return {
    totalGames: this.totalGamesPlayed,
    highestScore: this.highestOverallScore,
    levelsPlayed: this.gameplay.length,
    lastPlayed: this.lastPlayed,
    levelStats: this.gameplay
      .map((g) => ({
        level: g.level,
        highestScore: g.highestScore,
        lastPlayed: g.timestamp,
      }))
      .sort((a, b) => a.level - b.level),
  };
};

const Player = mongoose.model("Player", PlayerSchema);

module.exports = Player;
