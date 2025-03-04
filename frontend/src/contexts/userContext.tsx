import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

interface User {
  username: string;
  ethDepositAddress?: string;
  solDepositAddress?: string;
  ethBalance: number;
  solBalance: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const BACKEND_URL = "https://nova-backend-as1d.onrender.com/";
  const [user, setUser] = useState<User | null>(null);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { token } = authContext;
  const fetchUser = async () => {
    try {
      const response = await axios.get<User>(`${BACKEND_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
