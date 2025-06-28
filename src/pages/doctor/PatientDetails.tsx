import { DoctorStore } from "@/store/DoctorStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  User, 
  Stethoscope, 
  Activity, 
  AlertCircle, 
  MessageSquare, 
  Pill, 
  Calendar,
  ArrowLeft,
  FileText,
  Eye
} from "lucide-react";

interface PatientDetails {
  _id: string;
  name: string;
  doctor: string;
  patient: string;
  Disease: string;
  symptom: string;
  patientFeedback?: string;
  patientExperience?: string;
  medicationPrescribed: string;
  createdOn: string;
}

const PatientDetails = () => {
  const { patientId } = useParams();
  const { getPatientDetails, patientDetailsList } = DoctorStore();
  const [selectedRecord, setSelectedRecord] = useState<PatientDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getPatientDetails(patientId || "");
  }, [getPatientDetails, patientId]);

  if (!patientDetailsList) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (patientDetailsList.length === 0) {
    return (
      <div className="w-full p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patient Details</h1>
            <p className="text-muted-foreground">No records found</p>
          </div>
        </div>

        {/* No Records Message */}
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Records Yet</h2>
            <p className="text-muted-foreground">This patient has no medical records yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewMore = (record: PatientDetails) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const patientName = patientDetailsList[0]?.name || "Unknown Patient";

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{patientName}</h1>
          <p className="text-muted-foreground">Medical Records ({patientDetailsList.length} entries)</p>
        </div>
      </div>

      {/* Patient Records List */}
      <div className="space-y-4">
        {patientDetailsList.map((record: PatientDetails) => (
          <Card key={record._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  {/* Disease */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Disease
                    </label>
                    <Badge variant="destructive" className="text-sm">
                      {record.Disease}
                    </Badge>
                  </div>

                  {/* Symptoms */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Symptoms
                    </label>
                    <p className="text-sm text-foreground">{record.symptom}</p>
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Date
                    </label>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(record.createdOn).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* View More Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewMore(record)}
                  className="flex items-center gap-2 ml-4"
                >
                  <Eye className="h-4 w-4" />
                  View More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-full w-[95vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Complete Medical Record
            </DialogTitle>
            <DialogDescription>
              Detailed information for this medical record
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6 mt-4">
              {/* Patient Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Patient Information</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{selectedRecord.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Patient ID:</span>
                    <p className="font-mono text-xs">{selectedRecord.patient}</p>
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Disease & Symptoms</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="mb-2">
                      <Badge variant="destructive">{selectedRecord.Disease}</Badge>
                    </div>
                    <p className="text-sm text-red-900">{selectedRecord.symptom}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Medication Prescribed</span>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                    <p className="text-sm text-purple-900">{selectedRecord.medicationPrescribed}</p>
                  </div>
                </div>

                {(selectedRecord.patientFeedback || selectedRecord.patientExperience) && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Patient Feedback</span>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                      <p className="text-sm text-orange-900">
                        {selectedRecord.patientFeedback || selectedRecord.patientExperience}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Doctor Information</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-sm text-green-900">Doctor ID: {selectedRecord.doctor}</p>
                  </div>
                </div>
              </div>

              {/* Record Metadata */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Record Details</span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Created: {formatDate(selectedRecord.createdOn)}</p>
                  <p>Record ID: {selectedRecord._id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDetails;