import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import type { User } from "../interfaces/AuthInterfaces";
import { AuthContext } from "./AuthContext";
import { loginUser } from "@/api/auth.api";
import type { AuthFormType } from "@/validators/auth.validators";


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isAuthenticated = !!user;


    useEffect(() => {
        let isMounted = true;
        const checkAtuh = async () => {
            try {
                const res = await axiosInstance.get("/auth/me");
                if (isMounted) setUser(res?.data?.user);
            } catch (err) {
                console.error("The check auth error is", err);
                if (isMounted) setUser(null)
            }
            finally {
                if (isMounted) setIsLoading(false);
            };
        }
        checkAtuh();


        return () => { isMounted = false; };
    }, []);



    const login = async (credentials: AuthFormType) => {
        try {
            const loggedInUser = await loginUser(credentials);
            setUser(loggedInUser);
            toast.success("Logged in successfully!");
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            setUser(null);
            toast.success("User logged out successfully");
        }
        catch (err) {
            console.error("The login auth error is", err);
        }
    }


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
};
