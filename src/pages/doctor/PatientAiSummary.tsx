import { useParams } from "react-router-dom";

const PatientAiSummary = () => {
  const { patientId } = useParams();

  return <div>{patientId}</div>;
};

export default PatientAiSummary;
