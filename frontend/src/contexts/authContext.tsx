import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const BACKEND_URL = "https://nova-backend-as1d.onrender.com";
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<{
        message: string;
        token: string;
      }>(`${BACKEND_URL}/api/auth/login`, { email, password });

      setToken(response.data.token);

      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      await axios.post<{
        message: string;
      }>(`${BACKEND_URL}/api/auth/signup`, { username, email, password });
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);

    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
