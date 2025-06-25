import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface Patient {
  _id: string;
  name: string;
  email: string;
  doctor: string;
  patient: string;
  patientStatus: string;
  createdOn: string;
}

interface DoctorStore {
  getPatientList: () => Promise<void>;

  patientList: Patient[];
}

export const DoctorStore = create<DoctorStore>((set) => ({
  patientList: [],
  getPatientList: async () => {
    try {
      const response = await axiosInstance.get("/doctor/getPatientList");
      set({ patientList: response.data.patientList });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fecthing patient list";
      toast.error(errorMessage);
    }
  },
}));
