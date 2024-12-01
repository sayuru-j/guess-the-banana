import { GameplayConfig } from "../@types";

export const beginner: GameplayConfig = {
  lives: 5,
  initialScore: 0,
  reward: {
    score: 10,
    timeIncrement: 45000,
  },
  initialTime: 45000,
};

export const intermediate: GameplayConfig = {
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
  initialScore: 0,
  reward: {
    score: 1,
    timeIncrement: 15000,
  },
  initialTime: 15000,
};
