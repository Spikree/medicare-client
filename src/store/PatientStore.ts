import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface DoctorInterface {
  _id: string;
  name: string;
  email: string;
  doctor: string;
  patient: string;
  patientStatus: string;
  createdOn: string;
}

interface PatientLabResults {
  _id: string;
  title: string;
  labResult: string;
  patient: string;
  createdOn: string;
}

interface PatientStore {
  getDoctorList: () => Promise<void>;
  getLabResults: () => Promise<void>;

  doctorList: DoctorInterface[];
  patientLabResultList: PatientLabResults[];
}

export const PatientStore = create<PatientStore>((set) => ({
  doctorList: [],
  patientLabResultList: [],
  getDoctorList: async () => {
    try {
      const response = await axiosInstance.get("/patient/getDoctorList");
      set({ doctorList: response.data.doctors });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fecthing doctor list";
      toast.error(errorMessage);
    }
  },

  getLabResults: async () => {
    try {
      const response = await axiosInstance.get("/patient/getLabResults");
      set({ patientLabResultList: response.data.patientLabResults });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fecthing lab results";
      toast.error(errorMessage);
    }
  },
}));
