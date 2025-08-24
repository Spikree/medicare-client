import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader } from "./ui/card";
import type { PatientReview } from "@/store/PatientStore";
import { Loader } from "lucide-react";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  patientReview: PatientReview[];
  isFetchingPatientReviews: boolean;
}

const PatientReviewsList = ({
  isOpen,
  setIsOpen,
  patientReview,
  isFetchingPatientReviews,
}: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[750px] bg-slate-50 dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Patient Feedback
          </DialogTitle>
          <DialogDescription>
            Here's what patients are saying about their experience.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] w-full rounded-md border p-4 bg-white dark:bg-slate-950">
          {isFetchingPatientReviews ? (
            <div className="flex justify-center">
              <Loader className="animate-spin"/>
            </div>
            
          ) : (
            <div className="space-y-4">
              {patientReview?.length > 0 ? (
                patientReview.map((review) => (
                  <Card
                    key={review._id}
                    className="shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-slate-800"
                  >
                    {review?.reviewBy === "doctor" ? (
                      <CardHeader className="flex flex-row items-start space-x-4 pb-3">
                        <div className="flex flex-col gap-2">
                          <p className=" text-gray-500 dark:text-gray-400">
                            {review.doctor.name}
                          </p>
                          <div className="flex flex-col gap-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {review.doctor.email}
                            </p>
                            <hr />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Reviewed on {formatDate(review.createdOn)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    ) : (
                      <CardHeader>
                        <div className="flex flex-col gap-2">
                          <p className=" text-gray-500 dark:text-gray-400">
                            {review.patient.name}
                          </p>
                          <div className="flex flex-col gap-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {review.patient.email}
                            </p>
                            <hr />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Reviewed on {formatDate(review.createdOn)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    )}
                    <CardContent>
                      <div>
                        <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                          Review:
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          "{review.patientReview}"
                        </p>
                      </div>
                      {review.sideEffects &&
                        review.sideEffects.toLowerCase() !== "none." &&
                        review.sideEffects.toLowerCase() !==
                          "no side effects to rest" && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                              Side Effects Noted:
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {review.sideEffects}
                            </p>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-semibold">No Reviews Yet</p>
                  <p>Check back later for patient feedback.</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PatientReviewsList;
