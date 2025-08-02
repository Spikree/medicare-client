import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
// import type { AxiosResponse } from "axios";
import { toast } from "sonner";

interface CommonStore {
  updateProfile: (bio: string, profilePicture: File) => Promise<void>;
}

export const CommonStore = create<CommonStore>(() => ({
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
}));
