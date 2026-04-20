import type {
  Post,
  Guideline,
  GenerateRequest,
  GenerateResponse,
  RefineRequest,
} from '../types';

const BASE = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// Posts
export const getPosts = () => request<Post[]>('/api/posts');
export const getPost = (id: string) => request<Post>(`/api/posts/${id}`);
export const savePost = (data: { title: string; content: string; notes?: string }) =>
  request<Post>('/api/posts', { method: 'POST', body: JSON.stringify(data) });
export const updatePost = (id: string, data: Partial<Post>) =>
  request<Post>(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePost = (id: string) =>
  request<{ success: boolean }>(`/api/posts/${id}`, { method: 'DELETE' });

export const getPostsCount = () => request<{ count: number }>('/api/posts/count');

// Guidelines
export const getGuidelines = () => request<Guideline[]>('/api/guidelines');
export const addGuideline = (data: { title: string; content: string }) =>
  request<Guideline>('/api/guidelines', { method: 'POST', body: JSON.stringify(data) });
export const deleteGuideline = (id: string) =>
  request<{ success: boolean }>(`/api/guidelines/${id}`, { method: 'DELETE' });

// Documents (Brand Assets)
export const getDocuments = () => request<import('../types').Document[]>('/api/documents');
export const getDocument = (id: string) => request<import('../types').Document>(`/api/documents/${id}`);
export const addDocument = (data: { title: string; content: string }) =>
  request<import('../types').Document>('/api/documents', { method: 'POST', body: JSON.stringify(data) });
export const updateDocument = (id: string, data: { title?: string; content?: string }) =>
  request<import('../types').Document>(`/api/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDocument = (id: string) =>
  request<{ success: boolean }>(`/api/documents/${id}`, { method: 'DELETE' });

// Generate
export const generatePost = (data: GenerateRequest) =>
  request<GenerateResponse>('/api/generate', { method: 'POST', body: JSON.stringify(data) });
export const refinePost = (data: RefineRequest) =>
  request<GenerateResponse>('/api/generate/refine', { method: 'POST', body: JSON.stringify(data) });
