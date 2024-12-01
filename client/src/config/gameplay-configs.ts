import { GameplayConfig } from "../@types";

export const beginner: GameplayConfig = {
  level: "beginner",
  lives: 5,
  initialScore: 0,
  reward: {
    score: 10,
    timeIncrement: 45000,
  },
  initialTime: 45000,
};

export const intermediate: GameplayConfig = {
  level: "intermediate",
  lives: 3,
  initialScore: 0,
  reward: {
    score: 5,
    timeIncrement: 30000,
  },
  initialTime: 30000,
};

export const advanced: GameplayConfig = {
  lives: 2,
  level: "advanced",
  initialScore: 0,
  reward: {
    score: 1,
    timeIncrement: 15000,
  },
  initialTime: 15000,
};
