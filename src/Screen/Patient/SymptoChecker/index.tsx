import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { RootState } from "../../../../store/store";
import {
  sendChatMessagePollingApi,
  getChatStatusApi,
} from "../../../services/chatApi";

import { Stethoscope } from "lucide-react";

type Doctor = {
  doctor_id: number;
  full_name: string;
  email: string;
  phone_no: string;
  specialization?: string[];
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  doctors?: Doctor[];
};

const SymptoChecker = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    setConversation([
      {
        role: "assistant",
        content: `Hi ${fullName || user.email || "Patient"}, how can I help you today?`,
      },
    ]);
  }, [user]);

  const pollChatStatus = (chatId: number) => {
    let count = 0;

    const interval = setInterval(async () => {
      try {
        count++;

        const response = await getChatStatusApi(chatId);
        const result = response.data;

        if (result?.success === false) {
          clearInterval(interval);
          setLoading(false);
          toast.error(result?.message || "Failed to get chatbot response");
          return;
        }

        if (result?.is_proccess === true || result?.is_failed === true) {
          clearInterval(interval);

          const botReply =
            result.bot_response?.reply ||
            result.data?.actual_response ||
            "No response";

          const doctors: Doctor[] =
            result.doctors || result.bot_response?.doctors || [];

          const newMessages: ChatMessage[] = [
            {
              role: "assistant",
              content: botReply,
            },
          ];

          if (doctors.length > 0) {
            newMessages.push({
              role: "assistant",
              content: "DOCTORS",
              doctors,
            });
          }

          setConversation((prev) => [...prev, ...newMessages]);
          setLoading(false);
        }

        if (count >= 40) {
          clearInterval(interval);
          setLoading(false);
          toast.error("Chatbot is taking too long. Please try again.");
        }
      } catch (error) {
        clearInterval(interval);
        setLoading(false);
        console.error("Polling Error:", error);
        toast.error("Failed to check chatbot status");
      }
    }, 6000);
  };

  const sendMessage = async () => {
    try {
      if (!message.trim()) {
        toast.error("Please enter your symptoms");
        return;
      }

      if (!user?.user_id) {
        toast.error("User not found. Please login again.");
        return;
      }

      const currentMessage = message;

      const userMessage: ChatMessage = {
        role: "user",
        content: currentMessage,
      };

      setConversation((prev) => [...prev, userMessage]);
      setMessage("");
      setLoading(true);

      const response = await sendChatMessagePollingApi({
        user_id: user.user_id,
        responder: "patient",
        message: currentMessage,
        conversation: [],
      });

      const result = response.data;

      if (result?.success === false) {
        setLoading(false);
        toast.error(result?.message || "Chatbot request failed");
        return;
      }

      if (!result?.chat_id) {
        setLoading(false);
        toast.error("Chat ID not received");
        return;
      }

      pollChatStatus(Number(result.chat_id));
    } catch (error) {
      console.error("Chat API Error:", error);
      setLoading(false);
      toast.error("Something went wrong while checking symptoms");
    }
  };

 return (
   

      <div className="max-w-screen mx-auto  bg-white/80 backdrop-blur-xl   overflow-hidden">
        <div className="px-6 py-4 text-cyan-800">
          <h3 className="text-4xl font-bold">AI Health Assistant</h3>
          <p className="text-sm text-cyan-">
            Tell me your symptoms and I’ll suggest the right specialist.
          </p>
        </div>

        <div className="relative min-h-[560px] max-h-[560px] overflow-y-auto px-8 py-8 space-y-6 bg-[radial-gradient(circle_at_top_left,_#e0faff,_transparent_35%),radial-gradient(circle_at_bottom_right,_#dff6ff,_transparent_35%)]">
          {conversation.map((chat, index) => (
            <div key={index}>
              {chat.content !== "DOCTORS" && (
                <div
                  className={`flex items-end gap-3 ${
                    chat.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {chat.role === "assistant" && (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 shadow-md flex items-center justify-center text-white text-sm font-bold">
                      <Stethoscope size={25}/>
                    </div>
                  )}

                  <div>
                    <div
                      className={`max-w-[620px] whitespace-pre-line px-5 py-4 text-[15px] leading-7 shadow-md ${
                        chat.role === "user"
                          ? "rounded-3xl rounded-br-md bg-gradient-to-r from-cyan-600 to-sky-500 text-white"
                          : "rounded-3xl rounded-bl-md bg-white text-slate-800 border border-cyan-100"
                      }`}
                    >
                      {chat.content}
                    </div>

                    <p
                      className={`mt-1 text-[11px] text-slate-400 ${
                        chat.role === "user" ? "text-right pr-2" : "pl-2"
                      }`}
                    >
                      Just now
                    </p>
                  </div>
                </div>
              )}

              {chat.content === "DOCTORS" && (chat.doctors?.length ?? 0) > 0 && (
                <div className="ml-12 mt-4 max-w-2xl">
                  <p className="font-semibold text-cyan-800 mb-3">
                    Suggested Doctors
                  </p>

                  <div className="space-y-3">
                    {(chat.doctors ?? []).map((doc) => (
                      <div
                        key={doc.doctor_id}
                        className="rounded-2xl border border-cyan-100 bg-white/90 p-4 shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-cyan-900">
                              Dr. {doc.full_name}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              Email: {doc.email}
                            </p>
                            <p className="text-sm text-slate-600">
                              Phone: {doc.phone_no}
                            </p>

                            <span className="inline-block mt-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
                              {doc.specialization?.join(", ") || "-"}
                            </span>
                          </div>

                          <button className="rounded-xl bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700 shadow">
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 shadow-md flex items-center justify-center text-white text-sm font-bold">
                AI
              </div>

              <div className="rounded-3xl rounded-bl-md bg-white px-5 py-4 shadow-md border border-cyan-100">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce"></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:150ms]"></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:300ms]"></span>
                  <span className="ml-2 text-sm text-slate-600">
                    Analyzing symptoms...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/90 px-6 py-5 border-t border-cyan-100">
          <div className="rounded-3xl border border-cyan-200 bg-white shadow-xl p-3 flex items-center gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              className="flex-1 px-4 py-3 outline-none text-slate-700 bg-transparent"
              placeholder="Ask about your symptoms..."
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-cyan-600 to-sky-500 px-6 py-3 text-white font-medium shadow-md hover:from-cyan-700 hover:to-sky-600 disabled:opacity-60"
            >
              {loading ? "Waiting..." : "Send"}
            </button>
          </div>
        </div>
      </div>
  );
};
export default SymptoChecker;