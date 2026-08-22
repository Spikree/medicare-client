import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, ExternalLink } from "lucide-react";

type LabResult = {
  _id: string;
  title: string;
  labResult: string;
  createdOn: string;
};

type Props = {
  results: LabResult[];
};

/** Uniform gallery of uploaded lab reports, shared by both roles' views. */
export function LabResultGrid({ results }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <Card key={result._id} className="overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden border-b border-border bg-muted">
            <img
              src={result.labResult}
              alt={result.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          </div>

          <div className="p-4">
            <h3 className="truncate text-sm font-medium capitalize">
              {result.title}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="tabular">
                {new Date(result.createdOn).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => window.open(result.labResult, "_blank")}
            >
              <ExternalLink />
              View full size
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default LabResultGrid;
