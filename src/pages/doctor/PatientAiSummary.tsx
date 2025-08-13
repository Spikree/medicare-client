import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DoctorStore } from "@/store/DoctorStore";
import { Send, Loader2, Bot, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import BreadcrumbElement from "@/components/BreadcrumbElement";

const PatientAiSummary = () => {
  const { patientId, patientName } = useParams();
  const [aiQuery, setAiQuery] = useState<string>("");
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { askAi, getAiChatHistory, aiChatHistoryList, aiResponseLoading } =
    DoctorStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (patientId) {
      getAiChatHistory(patientId);
    }
  }, [patientId, getAiChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [aiChatHistoryList?.history, aiResponseLoading]);

  const askAiQuestions = async () => {
    if (!patientId) {
      toast.error("Patient ID is missing");
      return;
    }
    if (!aiQuery.trim()) {
      return;
    }
    askAi(patientId, aiQuery).then(() => {
      setAiQuery("");
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !aiResponseLoading) {
      e.preventDefault();
      askAiQuestions();
    }
  };

  return (
    <Card className="flex flex-col gap-2 p-2 h-full">
      
      <Card className="flex-shrink-0 flex justify-between flex-wrap text-center bg-white border-b border-gray px-6 py-3">
        <BreadcrumbElement currentPage={"AI Summary"} />
        <p className="text-gray-600">{patientName}</p>
      </Card>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {aiChatHistoryList?.history?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Avatar className="w-12 h-12 mb-4 bg-blue-100">
                <AvatarFallback className="bg-transparent">
                  <Bot className="w-6 h-6 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                AI Assistant Ready
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                Ask me anything about this patient's medical history, symptoms, or treatment plans.
              </p>
            </div>
          ) : (
            aiChatHistoryList?.history?.map((msg, index) => {
              const isModel = msg.role === "model";
              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${!isModel && "flex-row-reverse"}`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {isModel ? (
                      <AvatarFallback className="bg-green-600 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage src={authUser?.profilePicture} alt="User" />
                        <AvatarFallback className="bg-gray-200">
                          <User className="w-4 h-4 text-gray-700" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    isModel ? 'bg-white border' : 'bg-green-600 text-white'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                      {msg.parts[0].text}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {aiResponseLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="w-8 h-8 flex-shrink-0">
                 <AvatarFallback className="bg-green-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white border">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex-shrink-0 border-t bg-white px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about patient history..."
                className="flex-1 h-11"
                disabled={aiResponseLoading}
              />
              <Button
                onClick={askAiQuestions}
                disabled={aiResponseLoading || !aiQuery.trim()}
                size="icon"
                className="h-11 w-11 bg-green-600 hover:bg-green-700"
              >
                {aiResponseLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for a new line.
            </p>
          </div>
        </div>
      </Card>
    </Card>
  );
};

export default PatientAiSummary;