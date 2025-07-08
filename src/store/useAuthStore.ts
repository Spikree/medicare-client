import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface authUser {
  _id: string;
  name: string;
  email: string;
  role: "doctor" | "patient";
  bio?: string;
  profilePicture?: string;
  doctorId?: string;
}

interface AuthStore {
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;

  authUser: authUser | null;
  isCheckingAuth: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: false,
  login: async (email: string, password: string) => {
    const formData = {
      email,
      password,
    };
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      set({ authUser: response.data.user });
      localStorage.setItem("user_role", response.data.user.role)
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    const formData = {
      name,
      email,
      password,
      role,
    };
    try {
      const response = await axiosInstance.post("/auth/register", formData);
      console.log(response);
      set({ authUser: response.data.user });
      toast(response.data.message);
      localStorage.setItem("user_role", response.data.user.role)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Signup failed. Please try again.";
      toast.error(errorMessage);
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      toast.success(response.data.message)
      set({authUser: null});
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Error logging out";
      toast.error(errorMessage);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/checkAuth");
      set({ authUser: response.data });
    } catch (error) {
      // const axiosError = error as AxiosError<{ message: string }>;
      // const errorMessage =
      //   axiosError.response?.data?.message ||
      //   "Signup failed. Please try again.";
      // toast.error(errorMessage);
      console.log(error)
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
