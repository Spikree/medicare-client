import { CommonStore } from "@/store/CommonStore";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Loader, Send, User, ChevronDown, Image, X } from "lucide-react";
import type { chatInterface } from "@/store/CommonStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import BreadcrumbElement from "@/components/BreadcrumbElement";
import socket from "@/socket/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";

const ChatPageDoctor = () => {
  const { patientId } = useParams();
  const {
    getMessages,
    sendMessage,
    messages,
    getUserById,
    getUserByIdProfile,
    isFetchingMessages,
    setMessage,
  } = CommonStore();
  const { authUser } = useAuthStore();
  const userId = authUser?._id;

  const actualChatId =
    userId && patientId ? [userId, patientId].sort().join("_") : "";

  const [text, setText] = useState<string>("");
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [typingUser, setTypingUser] = useState(null);

  const typingTimeRef = useRef<NodeJS.Timeout | null>(null);

  // SOCKET CONNECTION
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (userId) {
      socket.auth = { userId };
      socket.emit("join", userId);

      if (actualChatId) {
        socket.emit("joinChat", actualChatId);
      }

      socket.emit("setActiveStatus", { userId });
    }

    socket.off("newMessage");
    socket.off("userActiveStatus");
    socket.off("userTyping");

    socket.on("newMessage", (newMessage) => {
      if (
        (newMessage.senderId === userId &&
          newMessage.receiverId === patientId) ||
        (newMessage.senderId === patientId && newMessage.receiverId === userId)
      ) {
        setMessage(newMessage);
      }
    });

    // socket.on("userActiveStatus", (data) => {
    //   if (data.chatId === actualChatId && data.senderId === patientId) {
    //     setTypingUser(data.isTyping ? data.senderId : null);
    //   }
    // });

    socket.on("userTyping", (data) => {
      if (data.chatId === actualChatId && data.senderId !== userId) {
        setTypingUser(data.isTyping ? data.senderId : null);
        setIsTyping(true);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("userActiveStatus");
      socket.off("userTyping");
    };
  }, [userId, patientId, actualChatId, setMessage]);

  const handelTyping = () => {
    if (isTyping && actualChatId) {
      socket.emit("typing", {
        senderId: userId,
        receiverId: patientId,
        chatId: actualChatId,
      });
      setIsTyping(true);
    }

    if (typingTimeRef.current) {
      clearTimeout(typingTimeRef.current);
    }

    typingTimeRef.current = setTimeout(() => {
      if (actualChatId) {
        socket.emit("stopTyping", {
          senderId: userId,
          receiverId: patientId,
          chatId: actualChatId,
        });
        setIsTyping(false);
      }
    }, 200);
  };

  // Clean up useEffects - only one for auto-scroll
  useEffect(() => {
    if (!showScrollButton) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showScrollButton]);

  useEffect(() => {
    if (patientId) {
      getMessages(patientId);
      getUserById(patientId);
    }
  }, [getMessages, patientId, getUserById]);

  // Handle scroll detection
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Find the actual scrollable element (might be a child)
    const scrollableElement =
      container.querySelector(".overflow-y-auto") || container;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    scrollableElement.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => scrollableElement.removeEventListener("scroll", handleScroll);
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const sendMessages = () => {
    if (patientId && (text.trim() || selectedImage)) {
      sendMessage(patientId, text, selectedImage || undefined);
      setText("");
      removeSelectedImage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessages();
    }
  };

  return (
    <Card className="flex flex-col gap-2 p-2 h-full">
      <Card className="flex-shrink-0 flex justify-between items-center flex-wrap text-center bg-white border-b border-gray px-6 py-3">
        <BreadcrumbElement currentPage={"Chat"} />
        <div className="flex justify-center items-center gap-2">
          <img
            className="h-10 w-10 rounded-full hidden sm:block"
            src={getUserByIdProfile?.profilePicture}
            alt="patient profile picture"
          />
          <p className="text-gray-600 items-center">{getUserByIdProfile?.name}</p>
        </div>
      </Card>

      <Card className="flex-1 flex flex-col overflow-hidden relative">
        {isFetchingMessages ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader className="animate-spin size-6" />
          </div>
        ) : (
          <>
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {messages && messages.length > 0 ? (
                messages.map((message: chatInterface, index: number) => {
                  const isPatient = message.senderId === patientId;
                  return (
                    <div
                      key={message._id || index}
                      className={`flex items-start gap-4 ${
                        !isPatient && "flex-row-reverse"
                      }`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        {isPatient ? (
                          <>
                            <AvatarImage
                              src={getUserByIdProfile?.profilePicture}
                              alt="Patient"
                            />
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
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          isPatient
                            ? "bg-white border"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl}
                            alt="Message attachment"
                            className="max-w-64 max-h-64 rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() =>
                              window.open(message.imageUrl, "_blank")
                            }
                          />
                        )}
                        {message.text && (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                            {message.text}
                          </p>
                        )}
                        {message.createdAt && (
                          <p className="text-xs mt-2 opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
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
          </>
        )}

        {/* Typing Indicator */}
        {typingUser && (
          <div className="flex px-4 mb-2">
            <div className="flex items-center space-x-1 p-2 bg-white rounded-full shadow-sm w-fit">
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ y: [0, -3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ y: [0, -3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ y: [0, -3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
            </div>
          </div>
        )}

        {/* Scroll to Bottom Button - centered */}
        {showScrollButton && (
          <Button
            onClick={scrollToBottom}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 h-12 w-12 rounded-xl bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-200 z-50"
            size="icon"
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
        )}

        <div className="flex-shrink-0 border-t bg-white px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="max-w-32 max-h-32 rounded-lg border"
                />
                <Button
                  onClick={removeSelectedImage}
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Input
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  handelTyping();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 h-11"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="icon"
                variant="outline"
                className="h-11 w-11"
              >
                <Image className="w-4 h-4" />
              </Button>
              <Button
                onClick={sendMessages}
                disabled={!text.trim()}
                size="icon"
                className="h-11 w-11 bg-green-600 hover:bg-green-700"
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
