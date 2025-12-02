export type ChatContent =
  | { type: "user"; user: string }
  | { type: "output"; output: string };

export interface ChatMessage {
  userId: string;
  role: "user" | "assistant";
  content: ChatContent;
}

export interface ChatHistoryResponse {
  chatHistory: ChatMessage[];
}
