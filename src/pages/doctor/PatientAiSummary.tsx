import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DoctorStore } from "@/store/DoctorStore";
import { Send, Loader2, Sparkles, User, ChevronDown, Lock } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import BreadcrumbElement from "@/components/BreadcrumbElement";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

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
    <div className="space-y-4">
      <BreadcrumbElement currentPage="AI summary" />

      <Card className="relative flex h-[calc(100vh-11rem)] flex-col overflow-hidden">
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden transition-all duration-500",
            !isSubscribed && "pointer-events-none select-none blur-md grayscale"
          )}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </span>
              <h1 className="text-sm font-semibold">AI summary</h1>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {patientName}
            </p>
          </div>

          <div
            className="scrollbar-slim flex-1 space-y-5 overflow-y-auto p-5"
            ref={messagesContainerRef}
          >
            {aiChatHistoryList?.history?.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">
                  Ask about this patient
                </h3>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Query their medical history, symptoms, or treatment plans and
                  get a summary drawn from their record.
                </p>
              </div>
            ) : (
              aiChatHistoryList?.history?.map((msg, index) => {
                const isModel = msg.role === "model";
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3",
                      !isModel && "flex-row-reverse"
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      {isModel ? (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Sparkles className="h-4 w-4" />
                        </AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage
                            src={authUser?.profilePicture}
                            alt="User"
                          />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed",
                        "prose-sm [&_a]:underline [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_strong]:font-semibold [&_table]:my-2 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
                        isModel
                          ? "border border-border bg-muted/50"
                          : "bg-primary text-primary-foreground"
                      )}
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
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking…
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showScrollButton && isSubscribed && (
            <Button
              onClick={scrollToBottom}
              size="icon"
              className="absolute bottom-24 left-1/2 z-10 h-9 w-9 -translate-x-1/2 rounded-full shadow-lg"
              aria-label="Scroll to latest"
            >
              <ChevronDown />
            </Button>
          )}

          <div className="shrink-0 border-t border-border p-4">
            <div className="mx-auto flex max-w-3xl items-center gap-2">
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about patient history…"
                className="flex-1"
                disabled={aiResponseLoading || !isSubscribed}
              />
              <Button
                onClick={askAiQuestions}
                disabled={aiResponseLoading || !aiQuery.trim() || !isSubscribed}
                size="icon"
                aria-label="Send"
              >
                {aiResponseLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Send />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Paywall overlay */}
        {!isSubscribed && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 p-4 backdrop-blur-[2px]">
            <Card className="animate-fade-in-up mx-auto flex max-w-sm flex-col items-center p-8 text-center shadow-xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </span>
              <h3 className="mt-4 text-base font-semibold">
                Subscription required
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                AI-powered patient summaries need an active subscription or an
                ongoing trial.
              </p>
              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={() => navigate("/checkOut")}
              >
                Set up payment
              </Button>
              <button
                onClick={() => navigate(-1)}
                className="mt-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Go back
              </button>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientAiSummary;
