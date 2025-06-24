import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   password: string;
//   role: "doctor" | "patient";
//   bio: string;
//   profilePicture: string;
//   doctorId: string;
// }

interface authUser {
  _id: string;
  name?: string;
  email: string;
  role?: "doctor" | "patient";
}

interface AuthStore {
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<void>;
  authUser: authUser | null;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  login: async (email: string, password: string) => {
    const formData = {
      email,
      password,
    };
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      set({ authUser: response.data.user });
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  },

  signup: async (
    email: string,
    password: string,
    name: string,
    role: string
  ) => {
    const formData = {
      email,
      name,
      password,
      role,
    };
    try {
      const response = await axiosInstance.post("/auth/register", formData);
      console.log(response);
      set({ authUser: response.data.user });
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Signup failed. Please try again.";
      toast.error(errorMessage);
    }
  },
}));
