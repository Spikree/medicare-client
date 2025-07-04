import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { DoctorStore } from "@/store/DoctorStore";

interface Props {
  setOpen: (value: boolean) => void;
  open: boolean;
}

const AddNewPatientDialog = ({ setOpen, open }: Props) => {
  const [searchPatient, setSearchPatient] = useState("");
  const { searchPatients, searchPatientList, addPatient, getPatientList } =
    DoctorStore();

  const searchPatientFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchPatients(e.target.value);
  };

  const addPatients = (patientId: string) => {
    addPatient(patientId).then((response) => {
      if (response?.status === 200) {
        setOpen(false);
        setSearchPatient("");
        getPatientList();
      }
    });
  };

  useEffect(() => {
    if (open === false) {
      setSearchPatient("");
    }
  }, [open]);

  return (
    <DialogContent className="w-full max-w-2xl mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
      <DialogHeader className="mb-4 space-y-4">
        <DialogTitle className="text-xl sm:text-2xl">
          Search and add new patients
        </DialogTitle>

        <Card className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              value={searchPatient}
              onChange={(e) => {
                setSearchPatient(e.target.value);
                searchPatientFunction(e);
              }}
              placeholder="Search Patients with name or email"
              className="pl-10"
            />
          </div>

          <Button variant="green" className="w-full sm:w-auto">
            Search
          </Button>
        </Card>
      </DialogHeader>

      <div className="space-y-3 mt-2">
        {searchPatient ? (
          searchPatientList.length > 0 ? (
            searchPatientList.map((patient, index) => (
              <Card
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3 sm:gap-0"
              >
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-medium">
                    {patient.name}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {patient.email}
                  </p>
                </div>
                <Button
                  onClick={() => addPatients(patient?._id)}
                  variant="green"
                  className="w-full sm:w-auto"
                >
                  Add
                </Button>
              </Card>
            ))
          ) : (
            <Card className="flex justify-center p-10">
              <span className="text-gray-600">No patients found</span>
            </Card>
          )
        ) : (
          <Card className="flex justify-center p-10">
            <span className="text-gray-600">
              Search results will appear here
            </span>
          </Card>
        )}
      </div>
    </DialogContent>
  );
};

export default AddNewPatientDialog;
