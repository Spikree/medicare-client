import { PatientStore } from "@/store/PatientStore";
import { useEffect } from "react";

const Home = () => {

    const {getDoctorList,getLabResults,getPatientDetails} = PatientStore();

    useEffect(() => {
        getDoctorList();
        getLabResults();
        getPatientDetails();
    },[getDoctorList,getLabResults,getPatientDetails])

  return <div>Home</div>;
};

export default Home;
