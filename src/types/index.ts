export interface Post {
  id: string;
  title: string;
  content: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Guideline {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface GenerateRequest {
  title: string;
  notes?: string;
  outline?: string;
  recentPostsLimit?: number;
  documentIds?: string[];
  specificPostIds?: string[];
}

export interface GenerateResponse {
  title: string;
  content: string;
  messages: ChatMessage[];
}

export interface RefineRequest {
  messages: ChatMessage[];
  instruction: string;
}

export interface OutlineRequest {
  title: string;
  notes?: string;
  recentPostsLimit?: number;
  documentIds?: string[];
  specificPostIds?: string[];
}

export interface OutlineResponse {
  outline: string[];
  messages: ChatMessage[];
}

export interface OutlineRefineRequest {
  messages: ChatMessage[];
  instruction: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
