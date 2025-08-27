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
  createdAt: string;
  updatedAt: string;
}

interface CommonStore {
  updateProfile: (bio: string, profilePicture: File) => Promise<void>;
  getMessages: (receiverId: string) => Promise<void>;
  sendMessage: (receiverId: string, text: string) => Promise<void>;

  messages: chatInterface[];
}

export const CommonStore = create<CommonStore>((set) => ({
  messages: [],

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
    }
  },

  sendMessage: async (receiverId: string, text: string) => {
    try {
      await axiosInstance.post(`/chatRoute/sendMessage/${receiverId}`, {
        text,
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error sending messages";
      toast.error(errorMessage);
    }
  },
}));
