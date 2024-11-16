const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Player = require("../model/Player");

// Simple auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create player profile
router.post("/players", auth, async (req, res) => {
  try {
    let player = await Player.findOne({ userId: req.user._id });
    if (player) {
      return res.status(400).json({
        success: false,
        message: "Player profile already exists",
      });
    }

    // Create new player
    player = new Player({
      userId: req.user._id,
      name: req.body.name,
    });

    await player.save();

    res.status(201).json({
      success: true,
      data: {
        id: player._id,
        name: player.name,
        ...player.getStats(),
      },
    });
  } catch (error) {
    console.error("Player creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating player profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Update gameplay score
router.post("/gameplay", auth, async (req, res) => {
  try {
    const { level, score } = req.body;

    if (
      !Number.isInteger(level) ||
      level < 1 ||
      !Number.isInteger(score) ||
      score < 0
    ) {
      return res.status(400).json({ message: "Invalid level or score" });
    }

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    await player.addGameplay(level, score);
    res.json({
      stats: player.getStats(),
      gameplay: player.gameplay.find((g) => g.level === level),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get player profile
router.get("/profile", auth, async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({
      id: player._id,
      name: player.name,
      ...player.getStats(),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get global leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [leaderboard, total] = await Promise.all([
      Player.find()
        .sort({ highestOverallScore: -1 })
        .skip(skip)
        .limit(limit)
        .select("name highestOverallScore"),
      Player.countDocuments(),
    ]);

    res.json({
      leaderboard,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get level leaderboard
router.get("/leaderboard/:level", async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    if (!Number.isInteger(level) || level < 1) {
      return res.status(400).json({ message: "Invalid level" });
    }

    const leaderboard = await Player.aggregate([
      { $unwind: "$gameplay" },
      { $match: { "gameplay.level": level } },
      { $sort: { "gameplay.highestScore": -1 } },
      { $limit: 10 },
      {
        $project: {
          name: 1,
          score: "$gameplay.highestScore",
        },
      },
    ]);

    res.json({ level, leaderboard });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
