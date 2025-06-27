import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const AddNewPatientDialog = () => {
  const [searchPatient, setSearchPatient] = useState("");
  const demoPatientlist = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Alice Johnson", email: "alice@example.com" },
    { name: "Bob Lee", email: "bob@example.com" },
  ];

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
              onChange={(e) => setSearchPatient(e.target.value)}
              placeholder="Search Patients"
              className="pl-10"
            />
          </div>

          <Button variant="green" className="w-full sm:w-auto">
            Search
          </Button>
        </Card>
      </DialogHeader>

      <div className="space-y-3 mt-2">
        {demoPatientlist.map((patient, index) => (
          <Card
            key={index}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3 sm:gap-0"
          >
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-medium">
                {patient.name}
              </span>
              <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>

            <Button variant="green" className="w-full sm:w-auto">
              Add
            </Button>
          </Card>
        ))}
      </div>
    </DialogContent>
  );
};

export default AddNewPatientDialog;
