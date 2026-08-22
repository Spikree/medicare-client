import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientStore, type RequestInterface } from "@/store/PatientStore";
import { Inbox, SearchX, UserRoundSearch } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import PersonRow from "@/components/PersonRow";
import EmptyState from "@/components/EmptyState";

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

  const handleSearchChange = (value: string) => {
    setSearchDoctorsQuery(value);
    searchDoctors(value);
  };

  const requestCount = addRequests?.length ?? 0;

  return (
    <DialogContent className="w-[95vw] max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add doctors</DialogTitle>
        <DialogDescription>
          Find a clinician to connect with, or accept a request they sent you.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requestCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold tabular text-primary-foreground">
                {requestCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <SearchInput
            value={searchDoctorsQuery}
            onChange={handleSearchChange}
            placeholder="Search doctors by name or email"
          />

          {!searchDoctorsQuery ? (
            <EmptyState
              icon={UserRoundSearch}
              title="Search for a doctor"
              description="Results will appear here as you type."
            />
          ) : searchDoctorsList.length > 0 ? (
            <ul className="space-y-2">
              {searchDoctorsList.map((doctor) => (
                <PersonRow
                  key={doctor._id}
                  name={doctor?.name}
                  email={doctor.email}
                  actions={
                    <Button
                      size="sm"
                      onClick={() => addDoctorRequest(doctor?._id)}
                    >
                      Add
                    </Button>
                  }
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No doctors found"
              description="Check the spelling, or try searching by email instead."
            />
          )}
        </TabsContent>

        <TabsContent value="requests">
          {requestCount > 0 ? (
            <ul className="space-y-2">
              {addRequests.map((request) => (
                <PersonRow
                  key={request._id}
                  name={request?.sender?.name}
                  email={request?.sender?.email}
                  actions={
                    <>
                      <Button
                        size="sm"
                        onClick={() => acceptAddRequest(request._id)}
                      >
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                    </>
                  }
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No incoming requests"
              description="Clinicians who ask to connect with you will show up here."
            />
          )}
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default AddNewDoctorDialog;
