import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../@types";
import { API_PREFIX, commonHeaders } from "../api";
import { LoginResponse } from "../@types/api";

type LoginResponseClient = {
  success?: boolean;
  message?: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, pin: string) => Promise<LoginResponseClient>;
  logout: () => void;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Load user from localStorage
const loadUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user state from localStorage
  useEffect(() => {
    const storedUser = loadUserFromStorage();
    setUser(storedUser);
    setIsInitialized(true);
  }, []);

  const login = async (username: string, pin: string) => {
    try {
      const raw = {
        username,
        pin,
      };

      const response = await fetch(`${API_PREFIX}/login`, {
        method: "POST",
        body: JSON.stringify(raw),
        headers: commonHeaders,
      });

      const loginData = (await response.json()) as LoginResponse;

      if (!loginData.success) {
        return {
          success: false,
          message: loginData.message,
        };
      }

      const userData = {
        username: loginData.data?.user.username!,
        avatar: loginData.data?.user.avatarUrl!,
        token: loginData.data?.token!,
      };

      // Save to localStorage and state
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return {
        success: true,
        message: "Login Successful!",
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
