import { create } from "zustand";
import axiosInstance from "@/utils/axios";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface DoctorInterface {
  _id: string;
  name: string;
  email: string;
  doctor: {
    _id: string;
    name: string;
    email: string;
  };
  patient: string;
  patientStatus: string;
  createdOn: string;
}

export interface PatientLabResults {
  _id: string;
  title: string;
  labResult: string;
  patient: string;
  addedBy: string;
  createdOn: string;
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

export interface DoctorDetailsInterface {
  _id: string;
  name: string;
  doctor: string;
  patient: string;
  Disease: string;
  symptom: string;
  patientExperience: string;
  medicationPrescribed: string;
  createdOn: string;
}

interface SearchDoctors {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdOn: string;
}

export interface PatientReview {
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

export interface PatientAllData {
  userInfo: {
    _id: string;
    name: string;
    email: string;
    role: "patient";
    createdOn: string;
    __v: number;
    bio: string;
    profilePicture: string;
  };
  patientDetails: {
    _id: string;
    name: string;
    doctor: {
      _id: string;
      name: string;
      email: string;
      profilePicture: string;
    };
    patient: string;
    Disease: string;
    symptom: string;
    patientExperience: string;
    medicationPrescribed: string;
    createdOn: string;
    __v: number;
  }[];
  allergiesAndHealthInfo: [];
  labResults: {
    _id: string;
    title: string;
    labResult: string;
    patient: string;
    addedBy?: {
      _id: string;
      name: string;
      email: string;
    };
    createdOn: string;
    __v: number;
  }[];
  patientReviews: {
    _id: string;
    name: string;
    patient: string;
    doctor?: string;
    patientDetail: {
      _id: string;
      Disease: string;
      symptom: string;
      medicationPrescribed: string;
    };
    patientReview: string;
    sideEffects: string;
    reviewBy: string;
    createdOn: string;
    __v: number;
  }[];
  doctorList: {
    _id: string;
    name: string;
    email: string;
    doctor: {
      _id: string;
      name: string;
      email: string;
      bio: string;
    };
    patient: string;
    patientStatus: string;
    createdOn: string;
    __v: number;
  }[];
  summary: {
    totalMedicalRecords: number;
    totalLabResults: number;
    totalReviews: number;
    totalDoctors: number;
  };
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
  getAllAddRequests: () => void;
  acceptAddRequest: (requestId: string) => void;
  searchDoctors: (query: string) => void;
  addDoctorRequest: (doctorId: string) => void;
  getDoctorDetails: (doctorId: string) => void;
  getLabResultsByDoctor: (doctorId: string) => void;
  addPatientReview: (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string,
    reviewBy: string
  ) => void;
  getPatientReviews: (patientDetailId: string) => void;
  getAllYourData: () => Promise<AxiosResponse | void>;
  removeDoctor: (doctorId: string) => Promise<void>;
  reassignDoctor: (doctorId: string) => Promise<void>;

  isUploadingLabResults: boolean;
  isFetchingPatientReviews: boolean;
  isFetchingDoctorDetails: boolean;
  isFetchingDoctorList: boolean;

  doctorList: DoctorInterface[];

  patientLabResultList: PatientLabResults[];
  LabResultsByDoctorList: PatientLabResults[];
  IncomingAddRequests: RequestInterface[];
  searchDoctorsList: SearchDoctors[];
  doctorDetailsList: DoctorDetailsInterface[];
  patientReview: PatientReview[];
  allPatientData: PatientAllData[];
}

export const PatientStore = create<PatientStore>((set, get) => ({
  doctorList: [],
  patientLabResultList: [],
  IncomingAddRequests: [],
  searchDoctorsList: [],
  doctorDetailsList: [],
  patientReview: [],
  LabResultsByDoctorList: [],
  allPatientData: [],

  isFetchingPatientReviews: false,
  isFetchingDoctorDetails: false,
  isFetchingDoctorList: false,

  isUploadingLabResults: false,
  getDoctorList: async () => {
    set({isFetchingDoctorList: true});
    try {
      const response = await axiosInstance.get("/patient/getDoctorList");
      set({ doctorList: response.data.doctors });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fecthing doctor list";
      toast.error(errorMessage);
    } finally {
      set({isFetchingDoctorList: false});
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
    set({ isUploadingLabResults: true });
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
        "Error uploading review on medication";
      toast.error(errorMessage);
    }
  },

  getAllAddRequests: async () => {
    try {
      const response = await axiosInstance.get("/patient/getAllAddRequests");
      set({ IncomingAddRequests: response.data.requests });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error getting all the requests";
      toast.error(errorMessage);
    }
  },

  acceptAddRequest: async (requestId: string) => {
    try {
      const response = await axiosInstance.post(
        `/patient/acceptAddRequest/${requestId}`
      );
      set((state) => ({
        IncomingAddRequests: state.IncomingAddRequests?.filter(
          (request) => request._id !== requestId
        ),
      }));
      toast.success(response.data.message);
      get().getDoctorList();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error while accepting request";
      toast.error(errorMessage);
    }
  },

  searchDoctors: async (query: string) => {
    try {
      const response = await axiosInstance.post("/patient/searchDoctors", {
        doctorName: query,
        doctorEmail: query,
      });
      set({ searchDoctorsList: response.data.doctors });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error searching for doctors";
      toast.error(errorMessage);
    }
  },

  addDoctorRequest: async (doctorId: string) => {
    try {
      const response = await axiosInstance.post(
        `/patient/addDoctorRequest/${doctorId}`
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error adding doctor";
      toast.error(errorMessage);
    }
  },

  getDoctorDetails: async (doctorId: string) => {
    set({isFetchingDoctorDetails: true});
    try {
      const response = await axiosInstance.get(
        `/patient/getDoctorDetails/${doctorId}`
      );
      set({ doctorDetailsList: response.data.doctorDetails });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error getting patient info";
      toast.error(errorMessage);
    } finally {
      set({isFetchingDoctorDetails: false});
    }
  },

  addPatientReview: async (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string,
    reviewBy: string
  ) => {
    const payload = {
      patientReview,
      sideEffects,
      reviewBy,
    };
    try {
      const response = await axiosInstance.post(
        `/patient/addPatientReview/${patientDetailId}`,
        payload
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error adding patient review";
      toast.error(errorMessage);
    }
  },

  getPatientReviews: async (patientDetailId: string) => {
    set({isFetchingPatientReviews: true});
    try {
      const response = await axiosInstance.get(
        `/patient/getPatientReviews/${patientDetailId}`
      );
      set({ patientReview: response.data.patientReviews });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error adding patient review";
      toast.error(errorMessage);
    } finally {
      set({isFetchingPatientReviews: false});
    }
  },

  getLabResultsByDoctor: async (doctorId: string) => {
    try {
      const response = await axiosInstance.get(
        `/patient/getLabResultsByDoctor/${doctorId}`
      );
      set({ LabResultsByDoctorList: response.data.labResultsByDoctor });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Error getting lab results by doctor";
      toast.error(errorMessage);
    }
  },

  getAllYourData: async () => {
    try {
      const response = await axiosInstance.get("/patient/getAllInfo");
      set({ allPatientData: response.data.allPatientInfo });
      return response.data.allPatientInfo;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error getting all your data";
      toast.error(errorMessage);
    }
  },

  removeDoctor: async (doctorId: string) => {
    try {
      const response = await axiosInstance.post(
        `/patient/removeDoctor/${doctorId}`
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error removing doctor";
      toast.error(errorMessage);
    }
  },

  reassignDoctor: async (doctorId: string) => {
    try {
      const response = await axiosInstance.post(
        `/patient/reassignDoctor/${doctorId}`
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Error reassigining doctor";
      toast.error(errorMessage);
    }
  },
}));
