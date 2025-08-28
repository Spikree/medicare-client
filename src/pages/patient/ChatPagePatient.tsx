import { CommonStore } from "@/store/CommonStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Send, User, ArrowLeft } from "lucide-react";
import type { chatInterface } from "@/store/CommonStore";

const ChatPagePatient = () => {
  const { doctorId } = useParams();
  const { getMessages, sendMessage, messages } = CommonStore();

  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (doctorId) {
      getMessages(doctorId);
    }
  }, [getMessages, doctorId]);

  const sendMessages = () => {
    if (doctorId && text.trim()) {
      sendMessage(doctorId, text);
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Patient #{doctorId}
              </h1>
              <p className="text-sm text-gray-500">Online consultation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message: chatInterface, index: number) => (
            <div
              key={message._id || index}
              className={`flex ${
                message.senderId === doctorId
                  ? " justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.senderId === doctorId
                    ? "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                    : "bg-blue-500 text-white rounded-br-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.createdAt && (
                  <p
                    className={`text-xs mt-2 ${
                      message.senderId === doctorId
                        ? "text-gray-500"
                        : "text-blue-100"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Start the conversation</p>
              <p className="text-sm">
                Send a message to begin consulting with this patient
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              rows={1}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
              }}
            />
          </div>
          <button
            onClick={sendMessages}
            disabled={!text.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full p-3 transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPagePatient;
