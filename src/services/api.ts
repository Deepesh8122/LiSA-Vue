import axios from 'axios';
import sessionManager from './sessionManager';
import responseParser, { ParsedApiResponse } from './responseParser';

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

// Enhanced response interface for new API structure
export interface EnhancedApiResponse extends ApiResponse {
  parsedData?: ParsedApiResponse;
  sessionId?: string;
}

const getBaseUrl = () => {
  if (import.meta.env.MODE === 'development') {
    // Use direct API URL in development (assuming you're using Vite's dev server proxy)
    return import.meta.env.VITE_API_BASE_URL;
  } else {
    // In production, use the /api prefix which will be handled by our server.js
    return '/api';
  }
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
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

const HF_BEARER_TOKEN = import.meta.env.VITE_HF_TOKEN;

const api = {
  // Legacy method - keeping for backward compatibility
  processPdfs(files: File[]): Promise<ApiResponse> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return apiClient.post('/process-pdfs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // New document upload method using the new API endpoint
  uploadDocument(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post('http://109.228.57.128:8080/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${HF_BEARER_TOKEN}`
      },
      timeout: 30000,
      onUploadProgress: onProgress ? (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || file.size)
        );
        onProgress(percentCompleted);
      } : undefined
    });
  },

  // Method to handle multiple files using the new API (uploads all files in single request)
  uploadDocuments(files: File[]): Promise<ApiResponse> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return axios.post('http://109.228.57.128:8080/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${HF_BEARER_TOKEN}`
      },
      timeout: 100000,
    });
  },

  // Enhanced bulk upload with progress tracking
  async uploadDocumentsWithProgress(files: File[], onProgress?: (progress: number) => void): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const result = await axios.post('http://109.228.57.128:8080/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${HF_BEARER_TOKEN}`
        },
        timeout: 100000,
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || files.reduce((acc, file) => acc + file.size, 0))
          );
          onProgress(percentCompleted);
        } : undefined
      });

      return result;
    } catch (error: any) {
      // Provide more detailed error information
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout - please check your connection and try again');
      } else if (error.response?.status === 413) {
        throw new Error('Files too large - please upload smaller files');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error - please try again later');
      } else if (error.response?.status >= 400) {
        throw new Error(`Upload failed: ${error.response.data?.message || 'Invalid file format'}`);
      } else {
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
      }
    }
  },

  // Enhanced upload with individual progress tracking
  async uploadDocumentWithProgress(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse> {
    try {
      const result = await this.uploadDocument(file, onProgress);
      return result;
    } catch (error: any) {
      // Provide more detailed error information
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout - please check your connection and try again');
      } else if (error.response?.status === 413) {
        throw new Error('File too large - please upload files smaller than 10MB');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error - please try again later');
      } else if (error.response?.status >= 400) {
        throw new Error(`Upload failed: ${error.response.data?.message || 'Invalid file format'}`);
      } else {
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
      }
    }
  },

  // Enhanced chat query method with session management and response parsing
  async chatQuery(message: string): Promise<EnhancedApiResponse> {
    try {
      // Get current session ID
      const sessionId = sessionManager.getSessionId();
      
      // Make API request with session_id
      const response = await axios.post('http://109.228.57.128:8080/chat/query', {
        message: message,
        session_id: sessionId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_BEARER_TOKEN}`
        },
        timeout: 100000,
      });

      // Validate response structure
      if (!responseParser.isValidResponse(response.data)) {
        console.warn('Invalid response structure:', response.data);
        // Fall back to basic response handling
        return {
          data: response.data.response || response.data.answer || response.data,
          status: response.status,
          sessionId: sessionId
        };
      }

      // Parse structured response
      const parsedData = responseParser.parseResponse(response.data);
      
      // Update session
      sessionManager.incrementMessageCount();

      // Return enhanced response
      return {
        data: response.data,
        status: response.status,
        parsedData: parsedData,
        sessionId: sessionId
      };

    } catch (error: any) {
      console.error('Chat query error:', error);
      
      // Provide better error messages
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out - the server may be busy. Please try again.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed - please check your credentials.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error - please try again in a moment.');
      } else if (error.response?.status >= 400) {
        throw new Error('Bad request - please check your message and try again.');
      } else {
        throw new Error(`Request failed: ${error.message || 'Unknown error'}`);
      }
    }
  },

  // Legacy chat query method for backward compatibility
  async chatQueryLegacy(message: string): Promise<ApiResponse<AskResponse>> {
    return axios.post('http://109.228.57.128:8080/chat/query', {
      message: message
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_BEARER_TOKEN}`
      },
      timeout: 100000,
    });
  },

  // Speech-to-text method using Hugging Face Whisper API
  async speechToText(audioBlob: Blob): Promise<ApiResponse<string>> {
    try {
      const hfToken = import.meta.env.VITE_HF_TOKEN;
      if (!hfToken) {
        throw new Error('HF_TOKEN not found in environment variables');
      }

      // Determine content type based on blob type
      let contentType = 'audio/flac';
      if (audioBlob.type.includes('wav')) {
        contentType = 'audio/wav';
      } else if (audioBlob.type.includes('webm')) {
        contentType = 'audio/webm';
      } else if (audioBlob.type.includes('mp4')) {
        contentType = 'audio/mp4';
      }

      console.log('Sending audio with content type:', contentType, 'Size:', audioBlob.size);

      const response = await axios.post(
        'https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3-turbo',
        audioBlob,
        {
          headers: {
            'Authorization': `Bearer ${hfToken}`,
            'Content-Type': contentType,
            'Accept': 'application/json',
            'X-HF-Bill-To': 'artglobal'
          },
          timeout: 30000, // 30 seconds timeout for speech processing
        }
      );

      return {
        data: response.data.text || response.data,
        status: response.status
      };
    } catch (error: any) {
      console.error('Speech-to-text error:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Speech processing timed out - please try again with a shorter recording');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed - invalid HF token');
      } else if (error.response?.status === 413) {
        throw new Error('Audio file too large - please try a shorter recording');
      } else if (error.response?.status >= 500) {
        throw new Error('Speech service temporarily unavailable - please try again');
      } else if (error.response?.status >= 400) {
        throw new Error(`Speech processing failed: ${error.response.data?.message || 'Invalid audio format'}`);
      } else {
        throw new Error(`Speech processing failed: ${error.message || 'Unknown error'}`);
      }
    }
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
