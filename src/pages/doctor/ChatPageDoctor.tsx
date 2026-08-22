import { CommonStore } from "@/store/CommonStore";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, Loader2, MessageSquare } from "lucide-react";
import type { chatInterface } from "@/store/CommonStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BreadcrumbElement from "@/components/BreadcrumbElement";
import socket from "@/socket/socket";
import { useAuthStore } from "@/store/useAuthStore";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatComposer from "@/components/chat/ChatComposer";
import TypingIndicator from "@/components/chat/TypingIndicator";
import EmptyState from "@/components/EmptyState";

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
        socket.emit("setActiveStatus", { userId });
      }
    }

    socket.off("newMessage");
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

    socket.on("userTyping", (data) => {
      if (data.chatId === actualChatId && data.senderId !== userId) {
        setTypingUser(data.isTyping ? data.senderId : null);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
    };
  }, [userId, patientId, actualChatId, setMessage]);

  const handleTyping = () => {
    // Only emit typing event if not already typing
    if (!isTyping && actualChatId) {
      socket.emit("typing", {
        senderId: userId,
        receiverId: patientId,
        chatId: actualChatId,
      });
      setIsTyping(true);
    }

    // Clear existing timeout
    if (typingTimeRef.current) {
      clearTimeout(typingTimeRef.current);
    }

    // Set new timeout to stop typing
    typingTimeRef.current = setTimeout(() => {
      if (actualChatId) {
        socket.emit("stopTyping", {
          senderId: userId,
          receiverId: patientId,
          chatId: actualChatId,
        });
        setIsTyping(false);
      }
    }, 1500); // Increased from 200ms to 1500ms
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

      // Stop typing when message is sent
      if (typingTimeRef.current) {
        clearTimeout(typingTimeRef.current);
      }
      if (isTyping && actualChatId) {
        socket.emit("stopTyping", {
          senderId: userId,
          receiverId: patientId,
          chatId: actualChatId,
        });
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessages();
    }
  };
  return (
    <div className="space-y-4">
      <BreadcrumbElement currentPage="Chat" />

      <Card className="relative flex h-[calc(100vh-11rem)] flex-col overflow-hidden">
        <ChatHeader
          name={getUserByIdProfile?.name}
          profilePicture={getUserByIdProfile?.profilePicture}
          subtitle="Patient"
        />

        {isFetchingMessages ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading messages…
          </div>
        ) : (
          <div
            ref={messagesContainerRef}
            className="scrollbar-slim flex-1 space-y-4 overflow-y-auto p-5"
          >
            {messages && messages.length > 0 ? (
              messages.map((message: chatInterface, index: number) => (
                <ChatBubble
                  key={message._id || index}
                  incoming={message.senderId === patientId}
                  text={message.text}
                  imageUrl={message.imageUrl}
                  createdAt={message.createdAt}
                  authorImage={getUserByIdProfile?.profilePicture}
                />
              ))
            ) : (
              <div className="flex h-full items-center justify-center">
                <EmptyState
                  icon={MessageSquare}
                  title="Start the conversation"
                  description="Send a message to begin consulting with this patient."
                  className="border-0"
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {typingUser && <TypingIndicator />}

        {showScrollButton && (
          <Button
            onClick={scrollToBottom}
            size="icon"
            className="absolute bottom-28 left-1/2 z-10 h-9 w-9 -translate-x-1/2 rounded-full shadow-lg"
            aria-label="Scroll to latest"
          >
            <ChevronDown />
          </Button>
        )}

        <ChatComposer
          text={text}
          onTextChange={(value) => {
            setText(value);
            handleTyping();
          }}
          onSend={sendMessages}
          onKeyDown={handleKeyPress}
          fileInputRef={fileInputRef}
          onImageSelect={handleImageSelect}
          imagePreview={imagePreview}
          onRemoveImage={removeSelectedImage}
          hasAttachment={Boolean(selectedImage)}
        />
      </Card>
    </div>
  );
};

export default ChatPageDoctor;
