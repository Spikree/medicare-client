import { PatientStore } from "@/store/PatientStore";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FileText, Loader2, Search, Upload, X } from "lucide-react";
import type { DoctorInterface } from "@/store/PatientStore";
import RenderDoctorAccordion from "@/components/RenderDoctorAccordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddNewDoctorDialog from "@/components/AddNewDoctorDialog";
import { toast } from "sonner";

const Home = () => {
  const {
    getDoctorList,
    getLabResults,
    // getPatientDetails,
    doctorList,
    uploadLabResults,
    getAllAddRequests,
    IncomingAddRequests,
    acceptAddRequest,
    isUploadingLabResults,
  } = PatientStore();
  const [isAddDoctorDialog, setIsAddDoctorDialog] = useState<boolean>(false);
  const [isUploadLabResultsDialogOpen, setIsUploadLabResultsDialogOpen] =
    useState<boolean>(false);
  const [labResultTitle, setLabResultTitle] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = () => {
    if (selectedFile && labResultTitle) {
      uploadLabResults(selectedFile, labResultTitle).then(() => {
        setSelectedFile(null);
        setLabResultTitle("");
        setIsUploadLabResultsDialogOpen(false);
      })
    } else {
      toast.error("All the fields are required");
    }
  };

  useEffect(() => {
    getDoctorList();
    getLabResults();
    // getPatientDetails();
    getAllAddRequests();
  }, [getDoctorList, getLabResults, getAllAddRequests]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchDoctorList, setSearchDoctorList] = useState<DoctorInterface[]>(
    []
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    const filteredList = doctorList.filter((doctor) =>
      doctor.doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchDoctorList(filteredList);
  }, [searchQuery, doctorList]);

  const currentDoctorList = doctorList.filter(
    (doctor) => doctor.patientStatus === "current"
  );

  const oldDoctorList = doctorList.filter(
    (doctor) => doctor.patientStatus === "old"
  );

  return (
    <Dialog
      open={isAddDoctorDialog}
      onOpenChange={() => {
        setIsAddDoctorDialog((prev) => !prev);
      }}
    >
      <Dialog
        open={isUploadLabResultsDialogOpen}
        onOpenChange={() => {
          setIsUploadLabResultsDialogOpen(!isUploadLabResultsDialogOpen);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Lab Results
            </DialogTitle>
            <DialogDescription>
              Select a file to upload patient lab results or medical documents
            </DialogDescription>
            <span className="text-sm font-medium text-gray-700">Title</span>
            <Input
              value={labResultTitle}
              onChange={(e) => {
                setLabResultTitle(e.target.value);
              }}
              placeholder="Lab result title"
            />
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />

              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {selectedFile ? selectedFile.name : "Choose a file to upload"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX
                </p>

                <Button
                  onClick={handleClick}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  {selectedFile ? "Change File" : "Select File"}
                </Button>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleFileUpload}
            variant="green"
            disabled={isUploadingLabResults}
          >
            {isUploadingLabResults ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </DialogContent>
      </Dialog>
      <div>
        <Card className=" max-w-auto max-h-full p-10 m-4 flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2 max-w-96">
            <div className="relative w-full">
              {searchQuery.length !== 0 ? (
                <X
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
                  onClick={() => clearSearch()}
                />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Doctors by name"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsUploadLabResultsDialogOpen(true)}
              variant={"green"}
            >
              Upload lab results
            </Button>
            <DialogTrigger asChild>
              <Button variant={"green"}>Add Doctor</Button>
            </DialogTrigger>
          </div>
        </Card>
        <Card className="max-w-auto max-h-full p-10 m-4">
          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">
                Current Doctors ({currentDoctorList.length})
              </TabsTrigger>
              <TabsTrigger value="old">
                Old DOctors ({oldDoctorList.length})
              </TabsTrigger>
            </TabsList>

            <Card className="py-2 mt-4 border-0 shadow-none">
              <TabsContent value="current">
                <RenderDoctorAccordion
                  doctors={
                    searchDoctorList.length === 0
                      ? currentDoctorList
                      : searchDoctorList
                  }
                />
              </TabsContent>

              <TabsContent value="old">
                <RenderDoctorAccordion doctors={oldDoctorList} />
              </TabsContent>
            </Card>
          </Tabs>
        </Card>
        <AddNewDoctorDialog
          acceptAddRequest={acceptAddRequest}
          open={isAddDoctorDialog}
          setOpen={setIsAddDoctorDialog}
          addRequests={IncomingAddRequests}
        />
      </div>
    </Dialog>
  );
};

export default Home;
