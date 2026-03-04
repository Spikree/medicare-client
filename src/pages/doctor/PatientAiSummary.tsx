import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DoctorStore } from "@/store/DoctorStore";
import { Send, Loader2, Bot, User, ChevronDown, Lock } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import BreadcrumbElement from "@/components/BreadcrumbElement";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PatientAiSummary = () => {
  const { patientId, patientName } = useParams();
  const navigate = useNavigate();
  const [aiQuery, setAiQuery] = useState<string>("");
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { askAi, getAiChatHistory, aiChatHistoryList, aiResponseLoading } =
    DoctorStore();

  // --- Subscription Logic ---
  const isSubscribed = useMemo(() => {
    if (!authUser?.subscription) return false;

    const now = new Date();
    const billingEnds = authUser.subscription.billingCycleEndsAt
      ? new Date(authUser.subscription.billingCycleEndsAt)
      : null;
    const trialEnds = authUser.subscription.trialEndsAt
      ? new Date(authUser.subscription.trialEndsAt)
      : null;

    // Returns true if either billing or trial is in the future
    return (billingEnds && billingEnds > now) || (trialEnds && trialEnds > now);
  }, [authUser]);

  // --- Auto-scroll Logic ---
  useEffect(() => {
    if (!showScrollButton) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showScrollButton, aiChatHistoryList?.history]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const scrollableElement =
      container.querySelector(".overflow-y-auto") || container;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    scrollableElement.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => scrollableElement.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  // --- API Calls ---
  useEffect(() => {
    if (patientId && isSubscribed) {
      getAiChatHistory(patientId);
    }
  }, [patientId, getAiChatHistory, isSubscribed]);

  const askAiQuestions = async () => {
    if (!patientId) {
      toast.error("Patient ID is missing");
      return;
    }
    if (!aiQuery.trim()) return;

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
    <Card className="relative flex flex-col gap-2 p-2 h-full overflow-hidden">
      {/* 1. Main Content Area (Blurred if not subscribed) */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-500 ${!isSubscribed ? "blur-md pointer-events-none select-none grayscale-[50%]" : ""}`}
      >
        <Card className="flex-shrink-0 flex justify-between flex-wrap text-center bg-white border-b border-gray px-6 py-3">
          <BreadcrumbElement currentPage={"AI Summary"} />
          <p className="text-gray-600 font-medium">{patientName}</p>
        </Card>

        <Card className="flex-1 flex flex-col overflow-hidden mt-2">
          <div
            className="flex-1 overflow-y-auto p-6 space-y-6"
            ref={messagesContainerRef}
          >
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
                  Ask me anything about this patient's medical history,
                  symptoms, or treatment plans.
                </p>
              </div>
            ) : (
              aiChatHistoryList?.history?.map((msg, index) => {
                const isModel = msg.role === "model";
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-4 ${
                      !isModel && "flex-row-reverse"
                    }`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {isModel ? (
                        <AvatarFallback className="bg-green-600 text-white">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage
                            src={authUser?.profilePicture}
                            alt="User"
                          />
                          <AvatarFallback className="bg-gray-200">
                            <User className="w-4 h-4 text-gray-700" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                        isModel ? "bg-white border" : "bg-green-600 text-white"
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.parts[0].text}
                      </ReactMarkdown>
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

          {showScrollButton && isSubscribed && (
            <Button
              onClick={scrollToBottom}
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2 h-10 w-10 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-10"
              size="icon"
            >
              <ChevronDown className="w-5 h-5" />
            </Button>
          )}

          <div className="flex-shrink-0 border-t bg-white px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <Input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about patient history..."
                  className="flex-1 h-11"
                  disabled={aiResponseLoading || !isSubscribed}
                />
                <Button
                  onClick={askAiQuestions}
                  disabled={
                    aiResponseLoading || !aiQuery.trim() || !isSubscribed
                  }
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
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Paywall Overlay */}
      {!isSubscribed && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
          <Card className="p-8 shadow-2xl border-2 flex flex-col items-center text-center max-w-sm mx-4 bg-white animate-in fade-in zoom-in duration-300">
            <div className=" p-4 rounded-full mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Subscription Required
            </h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              To access AI-powered patient summaries and insights, you need an
              active subscription or an ongoing trial.
            </p>
            <Button
              onClick={() => navigate("/checkOut")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12 shadow-md transition-transform active:scale-95"
            >
              Set Up Payment Now
            </Button>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600"
            >
              Go back
            </button>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default PatientAiSummary;
