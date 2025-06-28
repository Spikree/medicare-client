import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
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

interface Searchpatient {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdOn: string;
}

interface DoctorStore {
  getPatientList: () => Promise<void>;
  addPatient: (patientId: string) => Promise<AxiosResponse | void>;
  searchPatients: (query: string) => Promise<void>;

  patientList: Patient[];
  searchPatientList: Searchpatient[];
}

export const DoctorStore = create<DoctorStore>((set) => ({
  patientList: [],
  searchPatientList: [],

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

  searchPatients: async (query: string) => {
    try {
      const response = await axiosInstance.post("/doctor/searchPatients", {
        patientName: query,
        patientEmail: query,
      });
      set({ searchPatientList: response.data.patients });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error searching patient list";
      toast.error(errorMessage);
    }
  },

  addPatient: async (patientId: string) => {
    try {
      const response = await axiosInstance.post("/doctor/addPatient", {
        patientId,
      });
      toast(response.data.message);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error adding patient";
      toast.error(errorMessage);
    }
  },
}));
