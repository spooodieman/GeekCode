import React, { useState, useContext, createContext } from "react";

type User = {
  id: number;
  username: string;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user] = useState<User | null>({
    id: 1,
    username: "User",
  });
  const [isLoading] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ user, setUser: () => {}, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
