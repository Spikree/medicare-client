import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DoctorStore } from "@/store/DoctorStore";
import { Send, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";

const PatientAiSummary = () => {
  const { patientId } = useParams();
  const [aiQuery, setAiQuery] = useState<string>("");
  const { authUser } = useAuthStore();

  const { askAi, getAiChatHistory, aiChatHistoryList, aiResponseLoading } =
    DoctorStore();

  useEffect(() => {
    if (patientId) {
      getAiChatHistory(patientId);
    }
  }, [patientId, getAiChatHistory]);

  const askAiQuestions = async () => {
    if (!patientId) {
      toast.error("Patient ID is missing");
      return;
    }
    if (!aiQuery.trim()) {
      toast.error("Please enter a query");
      return;
    }

    askAi(patientId, aiQuery).then(() => {
      setAiQuery("");
    });
  };

  return (
    <Card className="h-full w-full flex flex-col p-4">
      {/* Header */}

      {/* Response - Takes up remaining space */}
      <Card className="flex-1 mb-1 p-6 bg-gradient-to-b overflow-hidden from-gray-50 to-white shadow-lg rounded-2xl border border-gray-100">
        <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
          {aiChatHistoryList?.history?.map((msg, index) => {
            const isModel = msg.role === "model";
            return (
              <div
                key={index}
                className={`flex items-end gap-3 transition-all duration-300 ${
                  isModel ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <Avatar className="shadow-sm border border-gray-200">
                  {isModel ? (
                    <AvatarFallback className="font-bold bg-blue-500 text-white">AI</AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage
                        src={authUser?.profilePicture}
                        alt="User profile picture"
                      />
                      <AvatarFallback className="font-bold bg-gray-300 text-gray-800">
                        U
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div
                  className={`rounded-2xl px-5 py-3 max-w-[75%] shadow-sm text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    isModel
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.parts[0].text}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* <Card className="flex-1 mb-6 p-6 bg-white shadow-sm rounded-lg">
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
      </Card> */}

      {/* Input - Fixed at bottom */}
      <Card className="p-2 bg-white shadow-sm rounded-lg">
        <div className="flex items-center gap-3">
          <Input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !aiResponseLoading && askAiQuestions()
            }
            placeholder="e.g., 'Summarize the patient's last visit.'"
            className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
            title="AI query input"
            disabled={aiResponseLoading}
          />
          <Button
            onClick={askAiQuestions}
            disabled={aiResponseLoading || !aiQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50"
          >
            {aiResponseLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {aiResponseLoading ? "Processing..." : "Send"}
          </Button>
        </div>
      </Card>
    </Card>
  );
};

export default PatientAiSummary;
