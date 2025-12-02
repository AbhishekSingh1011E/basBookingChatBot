import React, { useEffect, useRef, useState } from "react";
import { Send, Bus, Bot, User } from "lucide-react";
import { ChatHistoryResponse, ChatMessage } from "./types";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ask for userId when the component mounts
  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = prompt("Enter a userId anything:");
      if (storedUserId) {
        localStorage.setItem("userId", storedUserId);
      }
    }
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const getChatHistory = async () => {
      try {
        const response = await axios.post<ChatHistoryResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/chat/history`,
          { userId }
        );

        if (!response.data.chatHistory.length) {
          setMessages([
            {
              userId: userId,
              role: "assistant",
              content: {
                type: "output",
                output: "🚌 Welcome to RedBus! I'm your AI assistant for booking bus tickets across India. I can help you:\n\n✅ Search buses between any two cities\n✅ Check seat availability and prices\n✅ Book tickets instantly\n✅ Provide journey details\n\nWhere would you like to travel today?",
              },
            },
          ]);
        } else {
          setMessages(response.data.chatHistory);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getChatHistory();
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId?.trim()) return;

    setIsLoading(true);
    const newMessage = { userId, message: input };
    setMessages((prev) => [
      ...prev,
      { userId, role: "user", content: { type: "user", user: input } },
    ]);
    setInput("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chat`,
        newMessage
      );
      setMessages((prev) => [
        ...prev,
        {
          userId,
          role: "assistant",
          content: { type: "output", output: data.response },
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-t-xl shadow-sm p-4 flex items-center gap-3 border-b">
          <Bus className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              🚌 RedBus Booking Assistant
            </h1>
            <p className="text-sm text-gray-500">
              Online 24/7 to help you book bus tickets across India
            </p>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="bg-white h-[600px] overflow-y-auto p-4 flex flex-col gap-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user" ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5 text-blue-600" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-line">
                  {message.content.type === "user"
                    ? message.content.user
                    : message.content.output}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-xl flex items-end h-8">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSend}
          className="bg-white rounded-b-xl shadow-sm p-4 flex gap-2 border-t"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
