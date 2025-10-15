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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientStore, type RequestInterface } from "@/store/PatientStore";

interface Props {
  setOpen: (value: boolean) => void;
  acceptAddRequest: (value: string) => void;
  open: boolean;
  addRequests: RequestInterface[];
}

const AddNewDoctorDialog = ({ open, addRequests, acceptAddRequest }: Props) => {
  const { searchDoctors, searchDoctorsList, addDoctorRequest } = PatientStore();
  const [searchDoctorsQuery, setSearchDoctorsQuery] = useState("");

  useEffect(() => {
    if (open === false) {
      setSearchDoctorsQuery("");
    }
  }, [open]);

  const searchDoctorsFunction = () => {
    searchDoctors(searchDoctorsQuery);
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptAddRequest(requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    console.log("Declining request:", requestId);
    // Add your logic to decline the request here
  };

  const addDoctor = (doctorId: string) => {
    addDoctorRequest(doctorId);
  };

  return (
    <DialogContent className="w-full max-w-2xl  p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
      <DialogHeader className="mb-4">
        <DialogTitle className="text-xl sm:text-2xl">
          Manage Doctors
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search & Add</TabsTrigger>
          <TabsTrigger value="requests">
            Incoming Requests
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {/* 1. Use addRequests.length for the badge count */}
              {addRequests?.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4">
          <Card className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchDoctorsQuery}
                onChange={(e) => {
                  setSearchDoctorsQuery(e.target.value);
                  searchDoctorsFunction();
                }}
                placeholder="Search Doctors with name or email"
                className="pl-10"
              />
            </div>
            <Button variant="green" className="w-full sm:w-auto">
              Search
            </Button>
          </Card>
          <div className="space-y-3 mt-4">
            {searchDoctorsQuery ? (
              searchDoctorsList.length > 0 ? (
                searchDoctorsList.map((doctor, index) => (
                  <Card
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3 sm:gap-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg font-medium">
                        {doctor?.name}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {doctor.email}
                      </p>
                    </div>
                    <Button
                      onClick={() => addDoctor(doctor?._id)}
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
              <Card className="flex justify-center p-6">
                <span className="text-gray-600">
                  Search results will appear here
                </span>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <div className="space-y-3">
            {addRequests?.length > 0 ? (
              addRequests.map((request) => (
                <Card
                  key={request._id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3"
                >
                  <div>
                    {/* 2. Access the nested sender object for name and email */}
                    <span className="text-base font-medium">
                      {request?.sender?.name}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {request?.sender?.email}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="green"
                      className="flex-1"
                      onClick={() => handleAcceptRequest(request._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDeclineRequest(request._id)}
                    >
                      Decline
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="flex justify-center p-10">
                <span className="text-gray-600">No incoming requests</span>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default AddNewDoctorDialog;
