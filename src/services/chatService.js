import api from './api.js'

export const chatService = {
  // Send a chat message (uses function calling)
  async sendMessage(message, sessionId = null) {
    const payload = {
      message,
      ...(sessionId && { session_id: sessionId })
    }
    return await api.post('/chat/query', payload)
  },

  // Get chat history for a session
  async getChatHistory(sessionId) {
    return await api.get(`/chat/history/${sessionId}`)
  },

  // Get all chat sessions
  async getChatSessions() {
    return await api.get('/chat/sessions')
  },

  // Direct document search
  async searchDocuments(query, topK = 5) {
    return await api.post(`/chat/search?query=${encodeURIComponent(query)}&top_k=${topK}`)
  },

  // Get available functions
  async getFunctions() {
    return await api.get('/chat/functions')
  }
}
