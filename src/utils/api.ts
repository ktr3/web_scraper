import { Task, CreateTaskRequest, TaskResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithError(url: string, options?: RequestInit): Promise<Response> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
  }
  return response;
}

export const api = {
  async createTask(taskData: CreateTaskRequest): Promise<TaskResponse> {
    const response = await fetchWithError(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return response.json();
  },

  async getTasks(): Promise<Task[]> {
    const response = await fetchWithError(`${API_BASE_URL}/tasks`);
    return response.json();
  },

  async getTask(id: string): Promise<Task> {
    const response = await fetchWithError(`${API_BASE_URL}/tasks/${id}`);
    return response.json();
  },

  async deleteTask(id: string): Promise<void> {
    await fetchWithError(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  async exportResults(id: string, format: 'csv' | 'json'): Promise<Blob> {
    const response = await fetchWithError(`${API_BASE_URL}/tasks/${id}/export?format=${format}`);
    return response.blob();
  },
};