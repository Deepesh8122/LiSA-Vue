import axios from 'axios';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface AskResponse {
  answer: string;
  sources?: string[];
}

export interface StatusResponse {
  status: string;
  message: string;
}

const apiClient = axios.create({
  baseURL: 'http://109.228.57.128',
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = {
  processPdfs(files: File[]): Promise<ApiResponse> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return apiClient.post('/process-pdfs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  askQuestion(question: string, sessionId: string): Promise<ApiResponse<AskResponse>> {
    return apiClient.post('/ask', {
      question,
      session_id: sessionId,
    });
  },

  getStatus(): Promise<ApiResponse<StatusResponse>> {
    return apiClient.get('/status');
  },
};

export default api;