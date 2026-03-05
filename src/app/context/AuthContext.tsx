import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "student" | "professor" | "admin";

export interface User {
  name: string;
  email: string;
  role: UserRole | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoAccounts: Record<string, any> = {
  "etudiant@demo.com": { password: "demo123", name: "Koffi Sènan", role: "student" },
  "professeur@demo.com": { password: "demo123", name: "Charlemagne Babatoundé Igué", role: "professor" },
  "admin@demo.com": { password: "demo123", name: "Moussa Soglo", role: "admin" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("campusflow_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("campusflow_user");
      return null;
    }
  });

  const login = (email: string, password: string): boolean => {
    const account = demoAccounts[email];
    if (account && account.password === password) {
      const userData = { email, name: account.name, role: account.role };
      setUser(userData);
      localStorage.setItem("campusflow_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campusflow_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
