export interface Task {
  id: string;
  url: string;
  selectors: {
    title: string;
    content: string;
  };
  pagination: {
    enabled: boolean;
    next_button_selector?: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: ScrapingResult[];
  created_at: string;
  updated_at?: string;
}

export interface ScrapingResult {
  title: string;
  content: string;
  url?: string;
}

export interface CreateTaskRequest {
  url: string;
  selectors: {
    title: string;
    content: string;
  };
  pagination: {
    enabled: boolean;
    next_button_selector?: string;
  };
}

export interface TaskResponse {
  taskId: string;
  status: string;
}