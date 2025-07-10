import { PatientStore } from "@/store/PatientStore";
import { useEffect } from "react";

const Home = () => {

    const {getDoctorList,getLabResults} = PatientStore();

    useEffect(() => {
        getDoctorList();
        getLabResults();
    },[getDoctorList,getLabResults])

  return <div>Home</div>;
};

export default Home;
