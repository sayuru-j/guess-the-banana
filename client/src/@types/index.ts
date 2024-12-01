export type User = {
  username: string;
  avatar: string;
  token: string;
};

export type GameplayConfig = {
  level: string;
  lives: number;
  initialScore: number;
  initialTime: number;
  reward: {
    score: number;
    timeIncrement: number;
  };
};
