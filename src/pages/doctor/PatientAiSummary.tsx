import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DoctorStore } from "@/store/DoctorStore";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const PatientAiSummary = () => {
  const { patientId } = useParams();
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { askAi } = DoctorStore();

  const askAiQuestions = async () => {
    if (!patientId) {
      toast.error("Patient ID is missing");
      return;
    }
    if (!aiQuery.trim()) {
      toast.error("Please enter a query");
      return;
    }

    setIsLoading(true);
    try {
      const responseString: string = await askAi(patientId, aiQuery);

      if (responseString) {
        setAiResponse(responseString);
        setAiQuery("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full w-full flex flex-col p-4">
      {/* Header */}
      <Card className="mb-6 p-6 bg-white shadow-sm rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-800">AI Insights</h1>
        </div>
        <p className="text-gray-600">
          Use AI to uncover missing insights and recognize patterns for the
          patient
        </p>
      </Card>

      {/* Response - Takes up remaining space */}
      <Card className="flex-1 mb-6 p-6 bg-white shadow-sm rounded-lg">
        <div className="flex items-center justify-center h-full">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 size={18} className="animate-spin" />
              <span>Generating response...</span>
            </div>
          ) : aiResponse ? (
            <div className="w-full h-full">
              <div className="bg-gray-50 rounded-md p-4 border-l-3 border-blue-500 h-full overflow-auto">
                <pre className="text-gray-700 whitespace-pre-wrap font-sans leading-relaxed text-sm">
                  {aiResponse}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic text-center">
              Ask the AI a question to see insights here.
            </p>
          )}
        </div>
      </Card>

      {/* Input - Fixed at bottom */}
      <Card className="p-4 bg-white shadow-sm rounded-lg">
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-xs text-amber-800">
            <strong>⚠️ Important:</strong> AI responses are for informational
            purposes only and may contain errors. Do not use for prescriptions,
            diagnoses, or critical medical decisions. Always verify with
            clinical judgment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isLoading && askAiQuestions()
            }
            placeholder="e.g., 'Summarize the patient's last visit.'"
            className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
            title="AI query input"
            disabled={isLoading}
          />
          <Button
            onClick={askAiQuestions}
            disabled={isLoading || !aiQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {isLoading ? "Processing..." : "Send"}
          </Button>
        </div>
      </Card>
    </Card>
  );
};

export default PatientAiSummary;
