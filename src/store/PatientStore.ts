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
  getPatientDetails: () => Promise<void>;
  uploadLabResults: (file: File, title: string) => Promise<void>;
  addAllergiesAndHealthinfo: (
    allergies: string,
    generalHealthInfo: string
  ) => Promise<void>;
  reviewOnMedication: (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string
  ) => Promise<void>;

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

  getPatientDetails: async () => {
    try {
      const response = await axiosInstance.get("/patient/getPatientDetails");
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fecthing patient details";
      toast.error(errorMessage);
    }
  },

  uploadLabResults: async (file: File, title: string) => {
    const formData = new FormData();
    formData.append("labFile", file);
    formData.append("title", title);
    try {
      const response = await axiosInstance.post(
        "/patient/uploadLabResults",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error uploading lab results";
      toast.error(errorMessage);
    }
  },

  addAllergiesAndHealthinfo: async (
    allergies: string,
    generalHealthInfo: string
  ) => {
    const formData = {
      allergies,
      generalHealthInfo,
    };
    try {
      const response = await axiosInstance.post(
        "/patient/uploadAllergiesAndHealthinfo",
        formData
      );
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Error uploading allergies and general health info";
      toast.error(errorMessage);
    }
  },

  reviewOnMedication: async (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string
  ) => {
    const formData = {
      patientReview,
      sideEffects,
    };
    try {
      const response = await axiosInstance.post(
        `/patient/reviewOnMedication/${patientDetailId}`,
        formData
      );
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Error uploading allergies and general health info";
      toast.error(errorMessage);
    }
  },
}));
