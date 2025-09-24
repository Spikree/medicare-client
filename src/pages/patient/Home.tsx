import { PatientStore } from "@/store/PatientStore";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FileText, Loader2, Search, Upload, X } from "lucide-react";
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
    doctorList,
    uploadLabResults,
    getAllAddRequests,
    IncomingAddRequests,
    acceptAddRequest,
    isUploadingLabResults,
    isFetchingDoctorList,
  } = PatientStore();
  
  const [isAddDoctorDialog, setIsAddDoctorDialog] = useState<boolean>(false);
  const [isUploadLabResultsDialogOpen, setIsUploadLabResultsDialogOpen] = useState<boolean>(false);
  const [labResultTitle, setLabResultTitle] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getDoctorList();
    getLabResults();
    getAllAddRequests();
  }, [getDoctorList, getLabResults, getAllAddRequests]);

  const currentDoctorList = doctorList?.filter(
    (doctor) => doctor.patientStatus === "current"
  );

  const oldDoctorList = doctorList?.filter(
    (doctor) => doctor.patientStatus === "old"
  );

  const filteredCurrentDoctorList = currentDoctorList?.filter((doctor) =>
    doctor.doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOldDoctorList = oldDoctorList?.filter((doctor) =>
    doctor.doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      });
    } else {
      toast.error("All the fields are required");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
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

        <Card className="max-w-auto max-h-full p-4 sm:p-10 m-2 sm:m-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-2 justify-between">
          <div className="flex gap-2 w-full sm:max-w-96">
            <div className="relative w-full">
              {searchQuery.length !== 0 ? (
                <X
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
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

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setIsUploadLabResultsDialogOpen(true)}
              variant={"green"}
              className="flex-1 sm:flex-none"
            >
              Upload lab results
            </Button>
            <DialogTrigger asChild>
              <Button variant={"green"} className="flex-1 sm:flex-none">
                Add Doctor
              </Button>
            </DialogTrigger>
          </div>
        </Card>

        <Card className="max-w-auto max-h-full p-4 sm:p-10 m-2 sm:m-4 mt-4">
          <Tabs defaultValue="current">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">
                  Current Doctors ({currentDoctorList.length})
                </span>
                <span className="sm:hidden">
                  Current ({currentDoctorList.length})
                </span>
              </TabsTrigger>
              <TabsTrigger value="old" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">
                  Old Doctors ({oldDoctorList.length})
                </span>
                <span className="sm:hidden">Old ({oldDoctorList.length})</span>
              </TabsTrigger>
            </TabsList>

            <Card className="mt-4 border-0 shadow-none">
              <TabsContent value="current">
                <RenderDoctorAccordion
                isFetchingDoctorList={isFetchingDoctorList}
                  doctors={filteredCurrentDoctorList}
                  doctorStatus={"current"}
                />
              </TabsContent>

              <TabsContent value="old">
                <RenderDoctorAccordion
                isFetchingDoctorList={isFetchingDoctorList}
                  doctors={filteredOldDoctorList}
                  doctorStatus={"old"}
                />
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
      </Dialog>
    </>
  );
};

export default Home;