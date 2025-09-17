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

  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/documents/upload`, formData, {
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

  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/documents/upload`, formData, {
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

  const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/documents/upload`, formData, {
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
    const timeoutDuration = 60000; // 60 seconds
    const cancelToken = axios.CancelToken.source();
    let timeoutHandle: number | undefined;

    try {
      let sessionId = sessionManager.getSessionId();
      
      // If no session ID exists, create a new session
      if (!sessionId) {
        console.log('No session ID found, creating new session...');
        try {
          const newSession = await this.createNewSession();
          sessionId = newSession.data?.session_id;
          if (!sessionId) {
            throw new Error('Failed to create new session');
          }
          console.log('New session created:', sessionId);
        } catch (error) {
          console.error('Failed to create new session:', error);
          throw new Error('Failed to create new chat session');
        }
      }
      
      // Set up timeout handler
      timeoutHandle = window.setTimeout(() => {
        cancelToken.cancel('Request timed out after ' + timeoutDuration/1000 + ' seconds');
      }, timeoutDuration);

      // Make the request
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chat/query`, {
        message: message,
        session_id: sessionId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_BEARER_TOKEN}`
        },
        timeout: timeoutDuration,
        cancelToken: cancelToken.token
      });

      if (timeoutHandle) {
        window.clearTimeout(timeoutHandle);
      }

      // Process response
      const processedResponse = responseParser.parseResponse(response.data);
      sessionManager.incrementMessageCount();

      return {
        data: response.data,
        status: response.status,
        parsedData: processedResponse,
        sessionId: sessionId
      };

      // Log full axios response (stringified to reveal nested structure)
      try {
        console.log('chatQuery -> full response (stringified):', JSON.stringify(response.data, null, 2));
      } catch (e) {
        console.log('chatQuery -> full response (raw):', response.data);
      }

      // Helper: attempt to extract source_attribution from common places,
      // including if response.data.response is stringified JSON.
      const extractSourceAttribution = (raw: any) => {
        if (!raw) return null;
        // direct field
        if (raw.source_attribution) return raw.source_attribution;
        // nested under response (could be object or JSON string)
        const candidates = [raw.response, raw.answer, raw.data];
        for (const c of candidates) {
          if (!c) continue;
          if (typeof c === 'string') {
            try {
              const parsed = JSON.parse(c);
              if (parsed?.source_attribution) return parsed.source_attribution;
            } catch (e) {
              // not JSON - skip
            }
          } else if (typeof c === 'object' && c?.source_attribution) {
            return c.source_attribution;
          }
        }
        return null;
      };

      const rawSourceAttr = extractSourceAttribution(response.data);

      // Validate response structure
      if (!responseParser.isValidResponse(response.data)) {
        console.warn('Invalid response structure:', response.data);
        // Fall back to basic response handling, but include raw source_attribution
        return {
          data: response.data.response || response.data.answer || response.data,
          status: response.status,
          sessionId: sessionId,
          // attach rawResponse so callers can inspect full payload
          parsedData: undefined,
          // @ts-ignore - adding extra debug prop
          rawResponse: response.data,
          // preserve source attribution so UI can show it
          // @ts-ignore
          source_attribution: rawSourceAttr ?? null
        };
      }

      // Parse structured response
      const parsedData = responseParser.parseResponse(response.data);

      // Ensure source_attribution is preserved if parser didn't populate it
      if (!parsedData.source_attribution && rawSourceAttr) {
        parsedData.source_attribution = rawSourceAttr;
      }

      // Update session
      sessionManager.incrementMessageCount();

      // Return enhanced response including rawResponse for debugging/inspection
      return {
        data: response.data,
        status: response.status,
        parsedData: parsedData,
        sessionId: sessionId,
        // @ts-ignore
        rawResponse: response.data
      };

    } catch (error: any) {
      console.error('Chat query error:', error);
      
      // Clean up timeout if it exists
      if (timeoutHandle) {
        window.clearTimeout(timeoutHandle);
      }
      
      // Provide better error messages
      const errorMessage = 
        error.code === 'ECONNABORTED' || error.message?.includes('timeout')
          ? 'Request timed out - the server may be busy. Please try again.'
          : error.response?.status === 401
          ? 'Authentication failed - please check your credentials.'
          : error.response?.status >= 500
          ? 'Server error - please try again in a moment.'
          : error.response?.status >= 400
          ? 'Bad request - please check your message and try again.'
          : `Request failed: ${error.message || 'Network error'}`;
      
      throw new Error(errorMessage);
    } finally {
      // Ensure timeout is always cleared
      if (timeoutHandle) {
        window.clearTimeout(timeoutHandle);
      }
    }
  },

  // Legacy chat query method for backward compatibility
  async chatQueryLegacy(message: string): Promise<ApiResponse<AskResponse>> {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/chat/query`, {
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
      const response = await apiClient.get('/health');
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
  },

  // Session Management Methods
  async getChatSessions(): Promise<ApiResponse> {
    try {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chat/sessions`, {
        headers: {
          'Authorization': `Bearer ${HF_BEARER_TOKEN}`
        }
      });
      return response;
    } catch (error: any) {
      console.error('Failed to fetch chat sessions:', error);
      throw new Error(error.response?.data?.message || 'Failed to load chat sessions');
    }
  },

  async getChatHistory(sessionId: string) {
    try {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}chat/history/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${HF_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      // Make sure we return the data in a consistent format
      return {
        data: Array.isArray(response.data) ? response.data : [],
        status: response.status
      };
    } catch (error: any) {
      console.error('Failed to fetch chat history:', error);
      throw new Error(error.response?.data?.message || 'Failed to load chat history');
    }
  },

  async createNewSession(): Promise<ApiResponse> {
    try {
      console.log('Creating new session...');
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chat/query`, {
        message: "",
        new_session: true
      }, {
        headers: {
          'Authorization': `Bearer ${HF_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      // Extract session ID from response
      const sessionId = response.data?.session_id;
      
      if (!sessionId) {
        throw new Error('No session ID returned from server');
      }

      // Set session ID in manager and reset message count
      const session = await sessionManager.setSessionId(sessionId, 0);
      console.log('New session created and stored:', sessionId);

      // Dispatch session created event
      window.dispatchEvent(new CustomEvent('sessionCreated', {
        detail: {
          sessionId: session.id,
          messageCount: 0
        }
      }));

      return response;
    } catch (error: any) {
      console.error('Failed to create new session:', error);
      throw new Error('Failed to create new chat session');
    }
  },

  async deleteSession(sessionId: string): Promise<ApiResponse> {
  return axios.delete(`${import.meta.env.VITE_API_BASE_URL}/chat/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${HF_BEARER_TOKEN}`
      }
    });
  }
};

export default api;
