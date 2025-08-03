import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import type { PatientAllData } from "@/store/PatientStore";

// Add this interface to avoid TypeScript errors with lastAutoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY?: number;
  };
}

/**
 * Generates and downloads a PDF file containing the patient's medical records.
 *
 * @param patientData The PatientAllData object to be included in the PDF.
 */
export const downloadPatientDataPdf = (patientData: PatientAllData) => {
  try {
    if (!patientData) {
      toast.error("No patient data available to download.");
      return;
    }

    const doc: jsPDFWithAutoTable = new jsPDF(); // Use the extended interface
    let yPos = 20;

    // Header (No changes)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Patient Medical Report", 105, yPos, { align: "center" });
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(
      `Report Date: ${new Date().toLocaleDateString()}`,
      105,
      yPos,
      { align: "center" }
    );
    yPos += 20;

    // User Information (No changes)
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Personal Information", 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Name: ${patientData.userInfo?.name || "N/A"}`, 20, yPos);
    doc.text(`Email: ${patientData.userInfo?.email || "N/A"}`, 110, yPos);
    yPos += 7;
    doc.text(`Bio: ${patientData.userInfo?.bio || "N/A"}`, 20, yPos);
    
    // Medical Records (Patient Details)
    if (patientData.patientDetails && patientData.patientDetails.length > 0) {
      yPos += 20;
      doc.setFontSize(16);
      doc.text("Medical Records", 20, yPos);
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 10;

      patientData.patientDetails.forEach((detail, index) => {
        if (yPos > doc.internal.pageSize.height - 40) { // Increased margin for safety
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(12);
        doc.text(`- Record ${index + 1}`, 20, yPos);
        yPos += 7;
        doc.text(`Doctor: ${detail.doctor?.name || "N/A"}`, 30, yPos);
        doc.text(`Disease: ${detail.Disease || "N/A"}`, 110, yPos);
        yPos += 7;
        doc.text(`Symptom: ${detail.symptom || "N/A"}`, 30, yPos);
        doc.text(
          `Medication: ${detail.medicationPrescribed || "N/A"}`,
          110,
          yPos
        );
        yPos += 7;
        doc.text(
          `Experience: ${detail.patientExperience || "N/A"}`,
          30,
          yPos
        );
        yPos += 10;
      });
    }

    // Lab Results (MODIFIED SECTION)
    if (patientData.labResults && patientData.labResults.length > 0) {
      // Check for page break before adding a new section
      if (yPos > doc.internal.pageSize.height - 40) {
          doc.addPage();
          yPos = 20;
      }
      yPos += 10;
      doc.setFontSize(16);
      doc.text("Lab Results", 20, yPos);
      doc.line(20, yPos + 2, 190, yPos + 2);

      autoTable(doc, {
        startY: yPos + 5,
        head: [["Title", "Added By", "Date"]],
        body: patientData.labResults.map((lr) => [
          lr.title || "N/A",
          lr.addedBy?.name || "Self",
          new Date(lr.createdOn).toLocaleDateString(),
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        margin: { left: 20, right: 20 },
        didDrawPage: function (data) {
          // Footer
          doc.setFontSize(10);
          doc.setTextColor(150);
          doc.text(
            "Confidential Patient Data. For medical use only.",
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });
      
      // **CRITICAL FIX: Update yPos to the position after the table**
      yPos = doc.lastAutoTable?.finalY || yPos + 10;
    }

    // Add Patient Reviews section (MODIFIED SECTION)
    if (patientData.patientReviews && patientData.patientReviews.length > 0) {
      // Check if there is enough space for the new section header and some content
      if (yPos > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPos = 20;
      }
      
      yPos += 15; // Add some margin after the previous section
      doc.setFontSize(16);
      doc.text("Patient Reviews", 20, yPos);
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 10;

      patientData.patientReviews.forEach((review, index) => {
        if (yPos > doc.internal.pageSize.height - 40) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(12);
        doc.text(`- Review ${index + 1}`, 20, yPos);
        yPos += 7;
        doc.text(`Review: ${review.patientReview || "N/A"}`, 30, yPos);
        yPos += 7;
        doc.text(`Side Effects: ${review.sideEffects || "N/A"}`, 30, yPos);
        yPos += 10;
      });
    }

    const fileName = `${patientData.userInfo?.name?.replace(/\s+/g, "_") || "patient"}_medical_report.pdf`;
    
    doc.save(fileName);
    toast.success("Medical report downloaded successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF. Please try again.");
  }
};