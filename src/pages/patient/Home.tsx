import { PatientStore } from "@/store/PatientStore";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const { getDoctorList, getLabResults, getPatientDetails, doctorList } =
    PatientStore();

  useEffect(() => {
    getDoctorList();
    getLabResults();
    getPatientDetails();
  }, [getDoctorList, getLabResults, getPatientDetails]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Patient Dashboard
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Doctors</h2>

        {doctorList && doctorList.length > 0 ? (
          <div className="space-y-4">
            {doctorList.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between py-4 px-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {item.doctor.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{item.doctor.email}</p>
                </div>
                <div className="flex-1 flex items-center justify-end space-x-6">
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-700">Patient: </span>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-700">Status: </span>
                    <Badge
                      variant={item.patientStatus === 'current' ? 'default' : 'outline'}
                      className={
                        item.patientStatus === 'current'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {item.patientStatus}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-700">Created: </span>
                    <span className="text-sm text-gray-600">
                      {new Date(item.createdOn).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-6 bg-gray-50 border-b border-gray-200 text-center">
            <p className="text-gray-500 text-lg">No doctors found</p>
            <p className="text-gray-400 text-sm mt-2">
              Please check back later or contact support.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;