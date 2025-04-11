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
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: false
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    console.log('Request:', {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      env: import.meta.env.MODE
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);


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

  async getStatus(): Promise<ApiResponse<StatusResponse>> {
    try {
      const response = await apiClient.get('/status');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
      throw error;
    }
  },

  async testConnection(): Promise<void> {
    try {
      const response = await this.getStatus();
      console.log('Connection successful:', response);
    } catch (error) {
      console.error('Connection test failed:', {
        error,
        baseURL: apiClient.defaults.baseURL,
        env: import.meta.env.MODE
      });
      throw error;
    }
  }
};

export default api;