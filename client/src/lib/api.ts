import { apiRequest } from "./queryClient";

export interface User {
  id: string;
  username: string;
  storageQuota: number;
  storageUsed: number;
}

export interface FileItem {
  id: string;
  userId: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export const authAPI = {
  async register(username: string, password: string): Promise<User> {
    const response = await apiRequest("POST", "/api/auth/register", { username, password });
    return response.json();
  },

  async login(username: string, password: string): Promise<User> {
    const response = await apiRequest("POST", "/api/auth/login", { username, password });
    return response.json();
  },

  async logout(): Promise<void> {
    await apiRequest("POST", "/api/auth/logout");
  },

  async me(): Promise<User> {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  },
};

export const filesAPI = {
  async list(): Promise<FileItem[]> {
    const response = await apiRequest("GET", "/api/files");
    return response.json();
  },

  async upload(file: File): Promise<FileItem> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao fazer upload");
    }

    return response.json();
  },

  async download(fileId: string): Promise<void> {
    window.location.href = `/api/files/${fileId}/download`;
  },

  async delete(fileId: string): Promise<void> {
    await apiRequest("DELETE", `/api/files/${fileId}`);
  },
};
