import type { AuthFormType } from "@/validators/auth.validators";
import axiosInstance from "../lib/axios";
import type { User } from "@/interfaces/AuthInterfaces";
import toast from "react-hot-toast";

export const registerUser = async (data: AuthFormType): Promise<User> => {
  try {
    const res = await axiosInstance.post("/auth/register", data);
    toast.success(res?.data.message || "Registered successfully");
    return res.data.user;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Registration failed");
    throw error; 
  }
};

export const loginUser = async (data: AuthFormType): Promise<User> => {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data.user;
};