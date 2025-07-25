# LiSA Vue + RAG Backend Integration Guide

## Overview
This integration connects your Vue.js LiSA chat application with the Python RAG backend that uses Mistral 3.2 with function calling to eliminate hallucination.

## Features Integrated

### 🔧 Function Calling RAG
- **No Hallucination**: Uses structured function calls for document queries
- **Document Count**: Exact document counts via `get_document_count()`
- **Document Search**: Semantic search via `search_documents()`
- **Document Management**: Upload, view, and delete PDFs

### 📁 Document Management
- **PDF Upload**: Drag & drop or click to upload PDF documents
- **Document List**: View all uploaded documents in sidebar
- **Quick Actions**: Ask about specific documents or delete them
- **File Metadata**: Shows file size and upload date

### 💬 Enhanced Chat
- **Real-time Function Calls**: See when LiSA calls backend functions
- **Source Attribution**: Know which documents were used for answers
- **Loading Indicators**: Visual feedback during API calls
- **Error Handling**: Graceful error messages

## Setup Instructions

### 1. Start Your RAG Backend
Make sure your Python RAG application is running:
```bash
cd /path/to/your/lisa_backend2
python app/main.py
```
The backend should be running at `http://localhost:8080`

### 2. Start Vue Frontend
```bash
npm run dev
```

### 3. Environment Configuration
The integration uses environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

## Usage Examples

### Upload Documents
1. Click the 📎 (attach) button in the chat input
2. Select a PDF file
3. Document appears in the sidebar automatically

### Chat with Documents
Try these example queries:
- "How many documents do I have?" → Uses `get_document_count()`
- "Search for information about AI" → Uses `search_documents()`
- "What's in my latest document?" → Uses `get_document_metadata()` and content functions

### Function Call Visualization
When LiSA makes function calls, you'll see:
- 🔧 Blue badges showing which functions were called
- 📚 Green badges showing source documents used
- ⚠️ Red badges for any errors

## API Integration Details

### Services Created
- `src/services/api.js` - Axios configuration
- `src/services/documentService.js` - Document upload/management
- `src/services/chatService.js` - Chat and function calling

### State Management
- `src/stores/useAppStore.js` - Centralized state for documents and chat
- Reactive document list
- Real-time message updates

### New Components
- `MessageInput.vue` - Enhanced with PDF upload
- `MessageList.vue` - Shows function calls and sources
- `DocumentsList.vue` - Sidebar document management
- `LoadingIndicator.vue` - Chat loading states

## Backend API Endpoints Used

### Documents
- `POST /documents/upload` - Upload PDFs
- `GET /documents/` - List documents
- `DELETE /documents/{id}` - Delete documents

### Chat
- `POST /chat/query` - Send messages (with function calling)
- `GET /chat/history/{session_id}` - Chat history
- `POST /chat/search` - Direct document search

## Troubleshooting

### Backend Connection Issues
1. Verify RAG backend is running at `http://localhost:8080`
2. Check browser console for CORS errors
3. Ensure `.env` has correct `VITE_API_BASE_URL`

### Document Upload Issues
1. Only PDF files are supported
2. Check file size limits in backend configuration
3. Verify backend has write permissions for document storage

### Function Calling Not Working
1. Ensure Mistral 3.2 server is running at `http://localhost:11434/v1`
2. Check backend logs for function call errors
3. Verify all required functions are properly configured

## Development Notes

### Adding New Functions
To add new RAG functions:
1. Add function to backend `rag_functions.py`
2. Update `chatService.js` if needed
3. Enhance UI to show new function results

### Customizing UI
- Modify `LoadingIndicator.vue` for different loading states
- Update `DocumentsList.vue` for different document actions
- Customize function call badges in `MessageList.vue`

## Next Steps

Consider adding:
- Document search interface
- Chat session management
- Function call history
- Advanced document metadata
- Bulk document operations
