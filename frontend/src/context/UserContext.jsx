import React from "react";
import {createContext, useContext, useState, useEffect} from "react"
import{useNavigate} from "react-router-dom";
import axios from "axios";

const UserContext = createContext();

export function UserProvider ({ children }) {
    const [state, setState] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const response = await axios.get("/api/user", {withCredentials: true});
                setState(response.data);
            } catch (error) {
                if(!state == null) {
                    setState(null);
                    navigate("");
                }
            }
        }
        fetchUser()
        }, []);

    const logout = async() => {
        try{
            await axios.post("/api/logout", {withCredentials: true})
        } catch (error) {
            alert("로그아웃 요청 실패")
        }

        setState(null);
        navigate("/login")
    }

    return (
        <UserContext.Provider value={ {state, setState, logout} } >
            {children}
        </UserContext.Provider>
    );
}

export function useUser () { return useContext(UserContext); }