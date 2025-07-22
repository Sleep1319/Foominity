import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [state, setState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user", { withCredentials: true });
        setState(response.data);
      } catch (error) {
        setState(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post("/api/logout", { withCredentials: true });
    } catch (error) {
      alert("로그아웃 요청 실패");
    }

    setState(null);
    window.location.href = "/";
    setTimeout(() => setIsLoggingOut(false), 1000); // 플래그 초기화
  };

  const updateUser = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ state, setState, logout, isLoading, isLoggingOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
