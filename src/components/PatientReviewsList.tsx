import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { PatientReview } from "@/store/PatientStore";
import { Loader2, MessageSquare } from "lucide-react";
import EmptyState from "@/components/EmptyState";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  patientReview: PatientReview[];
  isFetchingPatientReviews: boolean;
}

/** Side-effect strings the backend uses to mean "nothing to report". */
const NO_SIDE_EFFECTS = ["none.", "no side effects to rest"];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

const PatientReviewsList = ({
  isOpen,
  setIsOpen,
  patientReview,
  isFetchingPatientReviews,
}: Props) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[95vw] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Feedback on this record</DialogTitle>
          <DialogDescription>
            Notes left by the patient and the treating clinician.
          </DialogDescription>
        </DialogHeader>

        {isFetchingPatientReviews ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading feedback…
          </div>
        ) : patientReview?.length > 0 ? (
          <ScrollArea className="scrollbar-slim max-h-[60vh] pr-3">
            <ul className="space-y-3">
              {patientReview.map((review) => {
                const byDoctor = review?.reviewBy === "doctor";
                const author = byDoctor ? review.doctor : review.patient;
                const showSideEffects =
                  review.sideEffects &&
                  !NO_SIDE_EFFECTS.includes(
                    review.sideEffects.trim().toLowerCase()
                  );

                return (
                  <li
                    key={review._id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {initials(author?.name ?? "?")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {byDoctor ? `Dr. ${author?.name}` : author?.name}
                          </span>
                          <Badge variant={byDoctor ? "brand" : "muted"}>
                            {byDoctor ? "Clinician" : "Patient"}
                          </Badge>
                          <span className="tabular ml-auto text-xs text-muted-foreground">
                            {formatDate(review.createdOn)}
                          </span>
                        </div>

                        <p className="truncate text-xs text-muted-foreground">
                          {author?.email}
                        </p>

                        <p className="mt-3 text-sm leading-relaxed">
                          {review.patientReview}
                        </p>

                        {showSideEffects && (
                          <div className="mt-3 rounded-md border border-warning/25 bg-warning/10 p-3">
                            <p className="text-xs font-medium uppercase tracking-wider text-warning">
                              Side effects noted
                            </p>
                            <p className="mt-1 text-sm leading-relaxed">
                              {review.sideEffects}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No feedback yet"
            description="Feedback added against this record will appear here."
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientReviewsList;
