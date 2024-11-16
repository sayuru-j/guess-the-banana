export type LoginResponse = {
  success: boolean;
  message?: string;
  remainingAttempts?: number;
  data?: {
    user: {
      id: string;
      username: string;
      avatarUrl: string;
      lastLogin: string;
    };
    token: string;
  };
};
