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
  error_message?: string;
  created_at: Date;
  updated_at: Date;
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