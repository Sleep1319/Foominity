import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [state, setState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

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
    navigate("/", { state: { from: "logout" } });
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

//====================================
// 기존 코드
// import React from "react";
// import { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [state, setState] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get("/api/user", { withCredentials: true });
//         setState(response.data);
//       } catch (error) {
//         if (state) {
//           // 문법 오류 수정했음
//           // if(!state == null) {
//           setState(null);
//           navigate("/");
//         }
//       }
//     };
//     fetchUser();
//   }, []);

//   const logout = async () => {
//     try {
//       await axios.post("/api/logout", { withCredentials: true });
//     } catch (error) {
//       alert("로그아웃 요청 실패");
//     }

//     setState(null);
//     navigate("/");
//   };

//   return <UserContext.Provider value={{ state, setState, logout }}>{children}</UserContext.Provider>;
// }

// export function useUser() {
//   return useContext(UserContext);
// }
