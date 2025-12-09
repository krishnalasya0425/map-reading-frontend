// context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (armyId, password) => {
    const res = await api.post("/auth/login", { armyId, password });

    const userData = {
      id: res.data.id,
      role: res.data.role,
      batchNo: res.data.batchNo,
      token: res.data.token,
    };

    setUser(userData);
    localStorage.setItem("token", res.data.token);

    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
