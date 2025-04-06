declare interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

declare interface AskResponse {
  answer: string;
  sources?: string[];
}

declare interface StatusResponse {
  status: string;
  message: string;
}

declare const api: {
  processPdfs(files: File[]): Promise<ApiResponse>;
  askQuestion(question: string, sessionId: string): Promise<ApiResponse<AskResponse>>;
  getStatus(): Promise<ApiResponse<StatusResponse>>;
};

export default api;