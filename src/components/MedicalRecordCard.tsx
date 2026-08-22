import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Eye } from "lucide-react";

type RecordLike = {
  Disease: string;
  symptom: string;
  createdOn: string;
};

type Props = {
  record: RecordLike;
  onViewMore: () => void;
};

/**
 * One row in a patient's visit history. Shared by the clinician-facing and
 * patient-facing record lists so a record always reads the same way.
 */
export function MedicalRecordCard({ record, onViewMore }: Props) {
  return (
    <Card className="p-4 transition-colors hover:border-ring/40 hover:bg-muted/30 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <dl className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Diagnosis
            </dt>
            <dd className="mt-1 break-words text-sm font-medium">
              {record.Disease}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Symptoms
            </dt>
            <dd className="mt-1 break-words text-sm text-muted-foreground">
              {record.symptom}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Date
            </dt>
            <dd className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="tabular">
                {new Date(record.createdOn).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </dd>
          </div>
        </dl>

        <Button
          variant="outline"
          size="sm"
          onClick={onViewMore}
          className="w-full shrink-0 lg:w-auto"
        >
          <Eye />
          View details
        </Button>
      </div>
    </Card>
  );
}

export default MedicalRecordCard;
