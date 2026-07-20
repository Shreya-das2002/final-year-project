import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Stethoscope } from "lucide-react";

import type { RootState } from "../../../../store/store";
import {
  sendChatMessagePollingApi,
  getChatStatusApi,
} from "../../../services/chatApi";

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
  const navigate = useNavigate();

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const [message, setMessage] = useState("");

  const [conversation, setConversation] =
    useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);

  /*
   * Welcome message is calculated during rendering.
   * No synchronous setState inside useEffect.
   */
  const fullName = `${user?.first_name || ""} ${
    user?.last_name || ""
  }`.trim();

  const welcomeMessage: ChatMessage = {
    role: "assistant",
    content: `Hi ${
      fullName || user?.email || "Patient"
    }, how can I help you today?`,
  };

  const displayedConversation: ChatMessage[] = user
    ? [welcomeMessage, ...conversation]
    : conversation;

  const pollChatStatus = (chatId: number) => {
    let count = 0;

    const interval = window.setInterval(async () => {
      try {
        count += 1;

        const response = await getChatStatusApi(chatId);
        const result = response.data;

        if (result?.success === false) {
          window.clearInterval(interval);
          setLoading(false);

          toast.error(
            result?.message ||
              "Failed to get chatbot response"
          );

          return;
        }

        if (
          result?.is_proccess === true ||
          result?.is_failed === true
        ) {
          window.clearInterval(interval);

          const botReply =
            result.bot_response?.reply ||
            result.data?.actual_response ||
            "No response";

          const doctors: Doctor[] =
            result.doctors ||
            result.bot_response?.doctors ||
            [];

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

          setConversation((previous) => [
            ...previous,
            ...newMessages,
          ]);

          setLoading(false);
          return;
        }

        if (count >= 40) {
          window.clearInterval(interval);
          setLoading(false);

          toast.error(
            "Chatbot is taking too long. Please try again."
          );
        }
      } catch (error) {
        window.clearInterval(interval);
        setLoading(false);

        console.error("Polling Error:", error);

        toast.error(
          "Failed to check chatbot status"
        );
      }
    }, 6000);
  };

  const sendMessage = async () => {
    try {
      const currentMessage = message.trim();

      if (!currentMessage) {
        toast.error(
          "Please enter your symptoms"
        );

        return;
      }

      if (!user?.user_id) {
        toast.error(
          "User not found. Please login again."
        );

        return;
      }

      const userMessage: ChatMessage = {
        role: "user",
        content: currentMessage,
      };

      setConversation((previous) => [
        ...previous,
        userMessage,
      ]);

      setMessage("");
      setLoading(true);

      const response =
        await sendChatMessagePollingApi({
          user_id: user.user_id,
          responder: "patient",
          message: currentMessage,
          conversation: [],
        });

      const result = response.data;

      if (result?.success === false) {
        setLoading(false);

        toast.error(
          result?.message ||
            "Chatbot request failed"
        );

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

      toast.error(
        "Something went wrong while checking symptoms"
      );
    }
  };

  return (
    <div
      className="
        mx-auto
        flex
        h-[calc(100vh-4rem)]
        max-w-screen
        flex-col
        overflow-hidden
        bg-white/80
        backdrop-blur-xl
      "
    >
      {/* FIXED HEADER */}

      <div className="shrink-0 px-6 py-4 text-cyan-800">
        <h3 className="text-4xl font-bold">
          AI Health Assistant
        </h3>

        <p className="text-sm text-cyan-700">
          Tell me your symptoms and I’ll suggest the
          right specialist.
        </p>
      </div>

      {/* ONLY MIDDLE CHAT SECTION SCROLLS */}

      <div
        className="
          relative
          min-h-0
          flex-1
          space-y-6
          overflow-y-auto
          bg-[radial-gradient(circle_at_top_left,_#e0faff,_transparent_35%),radial-gradient(circle_at_bottom_right,_#dff6ff,_transparent_35%)]
          px-8
          py-8
        "
      >
        {displayedConversation.map(
          (chat, index) => (
            <div
              key={`${chat.role}-${index}-${chat.content.slice(
                0,
                20
              )}`}
            >
              {chat.content !== "DOCTORS" && (
                <div
                  className={`
                    flex
                    items-end
                    gap-3
                    ${
                      chat.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }
                  `}
                >
                  {chat.role === "assistant" && (
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-br
                        from-cyan-400
                        to-sky-600
                        text-sm
                        font-bold
                        text-white
                        shadow-md
                      "
                    >
                      <Stethoscope size={25} />
                    </div>
                  )}

                  <div>
                    <div
                      className={`
                        max-w-[620px]
                        whitespace-pre-line
                        px-5
                        py-4
                        text-[15px]
                        leading-7
                        shadow-md
                        ${
                          chat.role === "user"
                            ? `
                              rounded-3xl
                              rounded-br-md
                              bg-gradient-to-r
                              from-cyan-600
                              to-sky-500
                              text-white
                            `
                            : `
                              rounded-3xl
                              rounded-bl-md
                              border
                              border-cyan-100
                              bg-white
                              text-slate-800
                            `
                        }
                      `}
                    >
                      {chat.content}
                    </div>

                    <p
                      className={`
                        mt-1
                        text-[11px]
                        text-slate-400
                        ${
                          chat.role === "user"
                            ? "pr-2 text-right"
                            : "pl-2"
                        }
                      `}
                    >
                      Just now
                    </p>
                  </div>
                </div>
              )}

              {chat.content === "DOCTORS" &&
                (chat.doctors?.length ?? 0) >
                  0 && (
                  <div className="ml-12 mt-4 max-w-2xl">
                    <p className="mb-3 font-semibold text-cyan-800">
                      Suggested Doctors
                    </p>

                    <div className="space-y-3">
                      {(chat.doctors ?? []).map(
                        (doctor) => (
                          <div
                            key={
                              doctor.doctor_id
                            }
                            className="
                              rounded-2xl
                              border
                              border-cyan-100
                              bg-white/90
                              p-4
                              shadow-lg
                            "
                          >
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >
                              <div>
                                <p className="font-bold text-cyan-900">
                                  Dr.{" "}
                                  {
                                    doctor.full_name
                                  }
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                  Email:{" "}
                                  {doctor.email}
                                </p>

                                <p className="text-sm text-slate-600">
                                  Phone:{" "}
                                  {
                                    doctor.phone_no
                                  }
                                </p>

                                <span
                                  className="
                                    mt-2
                                    inline-block
                                    rounded-full
                                    bg-cyan-100
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    text-cyan-700
                                  "
                                >
                                  {doctor.specialization?.join(
                                    ", "
                                  ) || "-"}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/patient/doctors/${doctor.doctor_id}`
                                  )
                                }
                                className="
                                  rounded-xl
                                  bg-cyan-600
                                  px-4
                                  py-2
                                  text-sm
                                  text-white
                                  shadow
                                  hover:bg-cyan-700
                                "
                              >
                                Book
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )
        )}

        {loading && (
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-cyan-400
                to-sky-600
                text-sm
                font-bold
                text-white
                shadow-md
              "
            >
              AI
            </div>

            <div
              className="
                rounded-3xl
                rounded-bl-md
                border
                border-cyan-100
                bg-white
                px-5
                py-4
                shadow-md
              "
            >
              <div className="flex items-center gap-1">
                <span
                  className="
                    h-2
                    w-2
                    animate-bounce
                    rounded-full
                    bg-cyan-500
                  "
                />

                <span
                  className="
                    h-2
                    w-2
                    animate-bounce
                    rounded-full
                    bg-cyan-500
                    [animation-delay:150ms]
                  "
                />

                <span
                  className="
                    h-2
                    w-2
                    animate-bounce
                    rounded-full
                    bg-cyan-500
                    [animation-delay:300ms]
                  "
                />

                <span className="ml-2 text-sm text-slate-600">
                  Analyzing symptoms...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIXED INPUT AND SEND SECTION */}

      <div
        className="
          sticky
          bottom-0
          z-20
          shrink-0
          border-t
          border-cyan-100
          bg-white/90
          px-6
          py-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            rounded-3xl
            border
            border-cyan-200
            bg-white
            p-3
            shadow-xl
          "
        >
          <input
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !loading
              ) {
                void sendMessage();
              }
            }}
            className="
              flex-1
              bg-transparent
              px-4
              py-3
              text-slate-700
              outline-none
            "
            placeholder="Ask about your symptoms..."
            disabled={loading}
          />

          <button
            type="button"
            onClick={() =>
              void sendMessage()
            }
            disabled={loading}
            className="
              rounded-2xl
              bg-gradient-to-r
              from-cyan-600
              to-sky-500
              px-6
              py-3
              font-medium
              text-white
              shadow-md
              hover:from-cyan-700
              hover:to-sky-600
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "Waiting..."
              : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptoChecker;