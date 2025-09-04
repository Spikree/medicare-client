import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
// import type { AxiosResponse } from "axios";
import { toast } from "sonner";

export interface chatInterface {
  _id: string;
  senderId: string;
  reveiverId: string;
  text: string;
  chatId: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "patient" | "doctor";
  createdOn: string;
  profilePicture: string;
}

interface CommonStore {
  updateProfile: (bio: string, profilePicture: File) => Promise<void>;
  getMessages: (receiverId: string) => Promise<void>;
  sendMessage: (
    receiverId: string,
    text: string,
    image?: File
  ) => Promise<void>;
  getUserById: (userId: string) => Promise<void>;

  messages: chatInterface[];
  getUserByIdProfile: UserProfile | null;

  isFetchingMessages: boolean;
}

export const CommonStore = create<CommonStore>((set) => ({
  messages: [],
  getUserByIdProfile: null,
  isFetchingMessages: false,

  updateProfile: async (bio: string, profilePicture: File) => {
    const formData = new FormData();

    formData.append("bio", bio);
    formData.append("profilePicture", profilePicture);

    try {
      const response = await axiosInstance.post(
        "/common/updateProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error updating profile";
      toast.error(errorMessage);
    }
  },

  getMessages: async (receiverId: string) => {
    set({ isFetchingMessages: true });
    try {
      const response = await axiosInstance.get(
        `/chatRoute/getMessages/${receiverId}`
      );
      set({ messages: response.data.messages });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fetching messages";
      toast.error(errorMessage);
    } finally {
      set({ isFetchingMessages: false });
    }
  },

  sendMessage: async (receiverId: string, text: string, image?: File) => {
    try {
      const formData = new FormData();
      formData.append("text", text);

      if (image) {
        formData.append("image", image);
      }

      await axiosInstance.post(
        `/chatRoute/sendMessage/${receiverId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error sending messages";
      toast.error(errorMessage);
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await axiosInstance.get(
        `/common/getUserProfile/${userId}`
      );
      set({ getUserByIdProfile: response.data.user });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fetching user";
      toast.error(errorMessage);
    }
  },
}));
