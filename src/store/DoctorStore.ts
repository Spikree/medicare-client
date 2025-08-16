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

interface AiChatHistory {
  _id: string;
  patientId: string;
  history: {
    role: "model" | "user";
    parts: {
      text: string;
      _id: string;
    }[]
    _id: string;
  }[];
  message: string;
  createdAt: string;
  updatedAt: string;
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
  getAllPatientInfo: (patientId: string) => Promise<AxiosResponse | void>;
  askAi: (patientId: string, query: string) => Promise<void>;
  getAiChatHistory: (patientId: string) => Promise<void>;

  patientList: Patient[];
  isUploadingLabResults: boolean;
  searchPatientList: Searchpatient[];
  patientDetailsList: PatientDetails[];
  patientLabResults: PatientLabResults[];
  patientReview: PatientReview[];
  incomingAddRequests: RequestInterface[];
  aiChatHistoryList: AiChatHistory;

  isFetchingPatinetList: boolean;

  aiResponse: string;
  
  aiResponseLoading: boolean;

  fetchingPatientList: boolean;

  fetchingPatientDetails : boolean;
}

export const DoctorStore = create<DoctorStore>((set) => ({
  patientList: [],
  searchPatientList: [],
  patientDetailsList: [],
  patientLabResults: [],
  patientReview: [],
  incomingAddRequests: [],
  aiChatHistoryList: {} as AiChatHistory,
  isUploadingLabResults: false,
  isFetchingPatinetList: false,
  aiResponseLoading: false,
  fetchingPatientList: false,
  fetchingPatientDetails: false,
  aiResponse: "",

  getPatientList: async () => {
    set({fetchingPatientList: true});
    try {
      const response = await axiosInstance.get("/doctor/getPatientList");
      set({ patientList: response.data.patientList });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fecthing patient list";
      toast.error(errorMessage);
    } finally {
      set({fetchingPatientList: false})
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
    set({fetchingPatientDetails: true});
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
    } finally {
      set({fetchingPatientDetails: false});
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
      toast.success(response.data.message);
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

  getAllPatientInfo: async (patientId: string) => {
    try {
      const response = await axiosInstance.get(
        `/doctor/getAllPatientInfo/${patientId}`
      );
      return response.data.allPatientInfo;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error get All Patient Info";
      toast.error(errorMessage);
    }
  },

  askAi: async (patientId: string, query: string) => {
    set({aiResponseLoading: true})
    try {
      const response = await axiosInstance.post(
        `/gemini/ai-chat/${patientId}`,
        {
          query,
        }
      );
      set({aiChatHistoryList: response.data.newChatHistory})
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error generating ai response";
      toast.error(errorMessage);
    } finally {
      set({aiResponseLoading: false})
    }
  },

  getAiChatHistory: async (patientId: string) => {
    try {
      const response = await axiosInstance.get(
        `/gemini/getAiChatHistory/${patientId}`
      );
      console.log(response.data.aiChatHistory.history[0].parts[0].text)
      set({ aiChatHistoryList: response.data.aiChatHistory });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fetching ai chat history";
      toast.error(errorMessage);
    }
  },
}));
