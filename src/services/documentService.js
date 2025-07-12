import api from './api.js'

export const documentService = {
  // Upload a PDF document
  async uploadDocument(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },

  // Get all documents
  async getDocuments() {
    return await api.get('/documents/')
  },

  // Get document by ID
  async getDocument(id) {
    return await api.get(`/documents/${id}`)
  },

  // Delete document
  async deleteDocument(id) {
    return await api.delete(`/documents/${id}`)
  },

  // Get document content
  async getDocumentContent(id) {
    return await api.get(`/documents/${id}/content`)
  }
}
