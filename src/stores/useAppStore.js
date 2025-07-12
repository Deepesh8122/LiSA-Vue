import { ref, reactive } from 'vue'
import { documentService } from '../services/documentService.js'
import { chatService } from '../services/chatService.js'

// Global state
const documents = ref([])
const messages = ref([])
const currentSessionId = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Documents state
const documentsStore = reactive({
  documents,
  isLoading: ref(false),
  error: ref(null),

  async loadDocuments() {
    this.isLoading = true
    this.error = null
    try {
      const response = await documentService.getDocuments()
      documents.value = response.documents || []
    } catch (err) {
      this.error = err.message
      console.error('Failed to load documents:', err)
    } finally {
      this.isLoading = false
    }
  },

  async uploadDocument(file) {
    this.isLoading = true
    this.error = null
    try {
      const response = await documentService.uploadDocument(file)
      await this.loadDocuments() // Reload documents after upload
      return response
    } catch (err) {
      this.error = err.message
      console.error('Failed to upload document:', err)
      throw err
    } finally {
      this.isLoading = false
    }
  },

  async deleteDocument(id) {
    this.isLoading = true
    this.error = null
    try {
      await documentService.deleteDocument(id)
      await this.loadDocuments() // Reload documents after delete
    } catch (err) {
      this.error = err.message
      console.error('Failed to delete document:', err)
      throw err
    } finally {
      this.isLoading = false
    }
  }
})

// Chat state
const chatStore = reactive({
  messages,
  currentSessionId,
  isLoading,
  error,

  async sendMessage(messageText) {
    if (!messageText.trim()) return

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: messageText,
      timestamp: new Date()
    }
    messages.value.push(userMessage)

    this.isLoading = true
    this.error = null

    try {
      // Send to RAG API
      const response = await chatService.sendMessage(messageText, currentSessionId.value)
      
      // Update session ID if returned
      if (response.session_id) {
        currentSessionId.value = response.session_id
      }

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        type: 'text',
        content: response.response || response.message,
        timestamp: new Date(),
        functionCalls: response.function_calls || null,
        sources: response.sources || null
      }
      messages.value.push(aiMessage)

    } catch (err) {
      this.error = err.message
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        type: 'text',
        content: `Sorry, I encountered an error: ${err.message}`,
        timestamp: new Date(),
        isError: true
      }
      messages.value.push(errorMessage)
    } finally {
      this.isLoading = false
    }
  },

  async loadChatHistory(sessionId) {
    this.isLoading = true
    this.error = null
    try {
      const response = await chatService.getChatHistory(sessionId)
      messages.value = response.messages || []
      currentSessionId.value = sessionId
    } catch (err) {
      this.error = err.message
      console.error('Failed to load chat history:', err)
    } finally {
      this.isLoading = false
    }
  },

  clearChat() {
    messages.value = []
    currentSessionId.value = null
    this.error = null
  },

  async searchDocuments(query) {
    try {
      const response = await chatService.searchDocuments(query)
      return response.results || []
    } catch (err) {
      console.error('Failed to search documents:', err)
      throw err
    }
  }
})

export function useAppStore() {
  return {
    documentsStore,
    chatStore
  }
}
