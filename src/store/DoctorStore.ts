import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";

export interface Patient {
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

export interface PatientDetails {
  _id: string;
  name: string;
  doctor: string;
  patient: string;
  Disease: string;
  symptom: string;
  patientFeedback: string;
  patientExperience?: string;
  medicationPrescribed: string;
  createdOn: string;
}

export interface PatientLabResults {
  _id: string;
  title: string;
  labResult: string;
  patient: string;
  createdOn: string;
}

interface PatientReview {
  _id: string;
  name: string;
  patient: {
    _id: string;
    name: string;
    email: string;
  };
  doctor: {
    _id: string;
    name: string;
    email: string;
  };
  patientDetail: string;
  patientReview: string;
  sideEffects: string;
  reviewBy: string;
  createdOn: string;
  __v: number;
}

export interface RequestInterface {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
  createdOn: string;
}

interface DoctorStore {
  getPatientList: () => Promise<void>;
  addPatient: (patientId: string) => Promise<AxiosResponse | void>;
  searchPatients: (query: string) => Promise<void>;
  getPatientDetails: (patientId: string) => Promise<void>;
  uploadLabResults: (
    patientId: string,
    file: File,
    title: string
  ) => Promise<void>;
  getPatientLabResults: (patientId: string) => Promise<void>;
  addPatientDetails: (
    patientId: string,
    Disease: string,
    symptom: string,
    patientExperience: string,
    medicationPrescribed: string
  ) => Promise<void>;
  addPatientReview: (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string,
    reviewBy: string
  ) => Promise<void>;
  getPatientReviews: (patientDetailId: string) => Promise<void>;
  getAllAddRequests: () => Promise<void>;
  acceptAddRequest: (requestId: string) => Promise<void>;

  patientList: Patient[];
  isUploadingLabResults: boolean;
  searchPatientList: Searchpatient[];
  patientDetailsList: PatientDetails[];
  patientLabResults: PatientLabResults[];
  patientReview: PatientReview[];
  incomingAddRequests: RequestInterface[];
}

export const DoctorStore = create<DoctorStore>((set) => ({
  patientList: [],
  searchPatientList: [],
  patientDetailsList: [],
  patientLabResults: [],
  patientReview: [],
  incomingAddRequests: [],
  isUploadingLabResults: false,

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
      const response = await axiosInstance.post(
        `/doctor/addPatientRequest/${patientId}`
      );
      toast(response.data.message);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error adding patient";
      toast.error(errorMessage);
    }
  },

  getPatientDetails: async (patientId: string) => {
    try {
      const response = await axiosInstance.get(
        `/doctor/getPatientDetails/${patientId}`
      );
      set({ patientDetailsList: response.data.patientDetails });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error getting patient info";
      toast.error(errorMessage);
    }
  },

  uploadLabResults: async (patientId: string, file: File, title: string) => {
    set({ isUploadingLabResults: true });
    const formData = new FormData();
    formData.append("labFile", file);
    formData.append("title", title);
    try {
      const response = await axiosInstance.post(
        `/doctor/uploadLabResults/${patientId}`,
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
        axiosError.response?.data?.message || "Error uploading lab results";
      toast.error(errorMessage);
    } finally {
      set({ isUploadingLabResults: false });
    }
  },

  getPatientLabResults: async (patientId: string) => {
    try {
      const response = await axiosInstance.get(
        `/doctor/getPatientLabResults/${patientId}`
      );
      set({ patientLabResults: response.data.patientLabResults });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fetching lab results";
      toast.error(errorMessage);
    }
  },

  addPatientDetails: async (
    patientId: string,
    Disease: string,
    symptom: string,
    patientExperience: string,
    medicationPrescribed: string
  ) => {
    const payload = {
      Disease,
      symptom,
      patientExperience,
      medicationPrescribed,
    };
    try {
      const response = await axiosInstance.post(
        `/doctor/addPatientDetails/${patientId}`,
        payload
      );
      console.log(response);
      console.log("patient records added");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Error fetching adding patient details";
      toast.error(errorMessage);
    }
  },

  addPatientReview: async (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string,
    reviewBy: string
  ) => {
    const payload = {
      patientReview: patientReview,
      sideEffects: sideEffects,
      reviewBy: reviewBy,
    };

    try {
      const response = await axiosInstance.post(
        `/doctor/addPatientReview/${patientDetailId}`,
        payload
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Error fetching adding patient details";
      toast.error(errorMessage);
    }
  },

  getPatientReviews: async (patientDetailId: string) => {
    try {
      const response = await axiosInstance.get(
        `/doctor/getPatientReviews/${patientDetailId}`
      );
      set({ patientReview: response.data.patientReview });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Error fetching adding patient reviews";
      toast.error(errorMessage);
    }
  },

  getAllAddRequests: async () => {
    try {
      const response = await axiosInstance.get("/doctor/getAllAddRequests");
      set({ incomingAddRequests: response.data.requests });
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Error fetching adding patient requests";
      toast.error(errorMessage);
    }
  },

  acceptAddRequest: async (requestId: string) => {
    try {
      const response = await axiosInstance.post(
        `/doctor/acceptAddRequest/${requestId}`
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error accepting add request";
      toast.error(errorMessage);
    }
  },
}));
