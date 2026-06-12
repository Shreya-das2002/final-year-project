import { urls } from "../Environment";
import { API } from "./api";

/* ---------- CHAT TYPES ---------- */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatPayload {
  user_id?: number;
  responder: string;
  message: string;
  conversation?: ChatMessage[];
}

/* ---------- API ---------- */

// OLD (blocking)
export const sendChatMessageApi = (data: ChatPayload) => {
  return API.post(`${urls.chatUrl}/send`, data, {
    validateStatus: () => true,
  });
};

// NEW (polling start)
export const sendChatMessagePollingApi = (data: ChatPayload) => {
  return API.post(`${urls.chatUrl}/send-polling`, data, {
    validateStatus: () => true,
  });
};

// NEW (polling status)
export const getChatStatusApi = (chat_id: number) => {
  return API.get(`${urls.chatUrl}/status/${chat_id}`, {
    validateStatus: () => true,
  });
};