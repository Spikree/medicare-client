import { CommonStore } from "@/store/CommonStore";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, User, ArrowLeft } from "lucide-react";
import type { chatInterface } from "@/store/CommonStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ChatPageDoctor = () => {
  const { patientId } = useParams();
  const {
    getMessages,
    sendMessage,
    messages,
    getUserById,
    getUserByIdProfile,
  } = CommonStore();

  const [text, setText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (patientId) {
      getMessages(patientId);
      getUserById(patientId);
    }
  }, [getMessages, patientId, getUserById]);

  const sendMessages = () => {
    if (patientId && text.trim()) {
      sendMessage(patientId, text);
      setText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessages();
    }
  };

  return (
    <Card className="flex flex-col gap-2 p-2 h-screen">
      
      <Card className="flex-shrink-0 flex justify-between flex-wrap text-center bg-white border-b border-gray px-6 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={getUserByIdProfile?.profilePicture} 
                alt={getUserByIdProfile?.name || "Profile Picture"} 
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold">
                {getUserByIdProfile?.name}
              </h1>
              <Badge variant="secondary" className="text-xs">
                Online consultation
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages && messages.length > 0 ? (
            messages.map((message: chatInterface, index: number) => {
              const isPatient = message.senderId === patientId;
              return (
                <div
                  key={message._id || index}
                  className={`flex items-start gap-4 ${!isPatient && "flex-row-reverse"}`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {isPatient ? (
                      <>
                        <AvatarImage src={getUserByIdProfile?.profilePicture} alt="Patient" />
                        <AvatarFallback className="bg-gray-200">
                          <User className="w-4 h-4 text-gray-700" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="bg-green-600 text-white">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    isPatient ? 'bg-white border' : 'bg-green-600 text-white'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                      {message.text}
                    </p>
                    {message.createdAt && (
                      <p className="text-xs mt-2 opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Avatar className="w-12 h-12 mb-4 bg-blue-100">
                <AvatarFallback className="bg-transparent">
                  <User className="w-6 h-6 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Start the conversation
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                Send a message to begin consulting with this patient
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex-shrink-0 border-t bg-white px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 h-11"
              />
              <Button
                onClick={sendMessages}
                disabled={!text.trim()}
                size="icon"
                className="h-11 w-11 bg-green-500 hover:bg-green-600"
                variant={"green"}
              >
                <Send className="w-4 h-4" />
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

export default ChatPageDoctor;