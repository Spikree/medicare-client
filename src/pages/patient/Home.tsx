import { PatientStore } from "@/store/PatientStore";
import { useEffect } from "react";

const Home = () => {

    const {getDoctorList} = PatientStore();

    useEffect(() => {
        getDoctorList()
    },[getDoctorList])

  return <div>Home</div>;
};

export default Home;
