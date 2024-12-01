import { GameplayConfig } from "../@types";

export const returnGameLevelAsIntegerFromConfig = (config: GameplayConfig) => {
  switch (config.level) {
    case "beginner":
      return 10;

    case "intermediate":
      return 100;

    case "advanced":
      return 1000;

    default:
      break;
  }
};

export const returnGameLevelAsStringFromInteger = (level: number) => {
  switch (level) {
    case 10:
      return "beginner";

    case 100:
      return "intermediate";

    case 1000:
      return "advanced";

    default:
      break;
  }
};
