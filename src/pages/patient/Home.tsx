import { PatientStore } from "@/store/PatientStore";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Plus, Upload } from "lucide-react";
import RenderDoctorAccordion from "@/components/RenderDoctorAccordion";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddNewDoctorDialog from "@/components/AddNewDoctorDialog";
import UploadLabResultsDialog from "@/components/UploadLabResultsDialog";
import PageHeader from "@/components/PageHeader";
import SearchInput from "@/components/SearchInput";
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
  const [isUploadLabResultsDialogOpen, setIsUploadLabResultsDialogOpen] =
    useState<boolean>(false);
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

  const pendingRequests = IncomingAddRequests?.length ?? 0;

  return (
    <Dialog open={isAddDoctorDialog} onOpenChange={setIsAddDoctorDialog}>
      <div className="space-y-6">
        <PageHeader
          title="My care team"
          description="Clinicians you're connected to, and the records you share with them."
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => setIsUploadLabResultsDialogOpen(true)}
              >
                <Upload />
                Upload lab results
              </Button>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  Add doctor
                  {pendingRequests > 0 && (
                    <span className="ml-1 rounded-full bg-primary-foreground/20 px-1.5 text-xs tabular">
                      {pendingRequests}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
            </>
          }
        />

        <Card>
          <div className="border-b border-border p-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search doctors by name"
              className="w-full sm:max-w-sm"
            />
          </div>

          <div className="p-4">
            <Tabs defaultValue="current">
              <TabsList>
                <TabsTrigger value="current">
                  Current
                  <span className="ml-1.5 tabular text-xs text-muted-foreground">
                    {currentDoctorList.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="old">
                  Past
                  <span className="ml-1.5 tabular text-xs text-muted-foreground">
                    {oldDoctorList.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                <RenderDoctorAccordion
                  isFetchingDoctorList={isFetchingDoctorList}
                  doctors={filteredCurrentDoctorList}
                  doctorStatus="current"
                />
              </TabsContent>

              <TabsContent value="old">
                <RenderDoctorAccordion
                  isFetchingDoctorList={isFetchingDoctorList}
                  doctors={filteredOldDoctorList}
                  doctorStatus="old"
                />
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>

      <UploadLabResultsDialog
        open={isUploadLabResultsDialogOpen}
        onOpenChange={setIsUploadLabResultsDialogOpen}
        title={labResultTitle}
        onTitleChange={setLabResultTitle}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onBrowse={() => fileInputRef.current?.click()}
        onClearFile={() => setSelectedFile(null)}
        selectedFile={selectedFile}
        onSubmit={handleFileUpload}
        isUploading={isUploadingLabResults}
        description="Share a lab report with the clinicians on your care team."
      />

      <AddNewDoctorDialog
        acceptAddRequest={acceptAddRequest}
        open={isAddDoctorDialog}
        setOpen={setIsAddDoctorDialog}
        addRequests={IncomingAddRequests}
      />
    </Dialog>
  );
};

export default Home;
