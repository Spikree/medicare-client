import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "doctor" | "patient";
  bio: string;
  profilePicture: string;
  doctorId: string;
}

interface authData {
  name?: string;
  email: string;
  password: string;
  role?: "doctor" | "patient";
  doctorId: string;
}

interface AuthStore {
  login: (data: authData) => Promise<void>;
  signup: (data : authData) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    login: async (data: authData) => {
        try {
            const response = await axiosInstance.post("/auth/login", data);
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    },

    signup: async (data: authData) => {
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }
}));
