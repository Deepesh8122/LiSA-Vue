/**
 * Session Manager for LiSA Chat
 * Handles session persistence and management for chat conversations
 */

const SESSION_STORAGE_KEY = 'lisa_chat_session'
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export interface ChatSession {
  id: string
  createdAt: number
  lastUsed: number
  messageCount: number
}

class SessionManager {
  private currentSession: ChatSession | null = null

  /**
   * Get the current chat session if it exists
   */
  getCurrentSession(): ChatSession | null {
    if (this.currentSession && !this.isSessionExpired(this.currentSession)) {
      // Update last used time
      this.currentSession.lastUsed = Date.now()
      this.saveSession(this.currentSession)
      return this.currentSession
    }

    // Load from storage
    const stored = this.loadStoredSession()
    if (stored && !this.isSessionExpired(stored)) {
      this.currentSession = stored
      this.currentSession.lastUsed = Date.now()
      this.saveSession(this.currentSession)
      return this.currentSession
    }

    return null
  }

  /**
   * Get the current session ID for API calls
   */
  getSessionId(): string | null {
    const session = this.getCurrentSession()
    return session ? session.id : null
  }

  /**
   * Create a new chat session
   */
  createNewSession(): ChatSession {
    const session: ChatSession = {
      id: this.generateSessionId(),
      createdAt: Date.now(),
      lastUsed: Date.now(),
      messageCount: 0
    }

    this.currentSession = session
    this.saveSession(session)
    return session
  }

  /**
   * Increment message count for current session
   */
  incrementMessageCount(): void {
    const session = this.getCurrentSession()
    if (session) {
      session.messageCount++
      session.lastUsed = Date.now()
      this.saveSession(session)
    }
  }

  /**
   * Clear current session (force new session on next call)
   */
  clearSession(): void {
    this.currentSession = null
    this.removeStoredSession()
  }

  /**
   * Set session ID from external source (e.g., server response)
   */
  async setSessionId(sessionId: string, messageCount: number = 0): Promise<ChatSession> {
    // Create or update session
    const session: ChatSession = {
      id: sessionId,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      messageCount: messageCount
    }
    
    // Store the session
    this.currentSession = session
    this.saveSession(session)
    
    return session
  }

  /**
   * Activate an existing session on the server
   * This is now only called when actually needed
   */
  private async activateSession(sessionId: string): Promise<void> {
    try {
      // Only activate if really needed, without sending empty message
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_HF_TOKEN}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          activate_only: true
        })
      })
    } catch (error) {
      throw new Error(`Failed to activate session: ${error}`)
    }
  }

  /**
   * Check if session should persist across browser refreshes
   */
  shouldPersistSession(): boolean {
    return true // Always persist for now
  }

  /**
   * Get session info for debugging
   */
  getSessionInfo(): { 
    id: string | null; 
    age: string; 
    messageCount: number; 
    isExpired: boolean 
  } {
    const session = this.getCurrentSession()
    
    if (!session) {
      return {
        id: null,
        age: '0h 0m',
        messageCount: 0,
        isExpired: true
      }
    }

    const ageMs = Date.now() - session.createdAt
    const ageHours = Math.floor(ageMs / (60 * 60 * 1000))
    const ageMinutes = Math.floor((ageMs % (60 * 60 * 1000)) / (60 * 1000))
    
    return {
      id: session.id,
      age: `${ageHours}h ${ageMinutes}m`,
      messageCount: session.messageCount,
      isExpired: this.isSessionExpired(session)
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    // Generate a UUID-like string for session ID that indicates a new session
    return Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Check if session is expired
   */
  private isSessionExpired(session: ChatSession): boolean {
    return Date.now() - session.lastUsed > SESSION_TIMEOUT
  }

  /**
   * Save session to storage
   */
  private saveSession(session: ChatSession): void {
    if (this.shouldPersistSession()) {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      } catch (error) {
        console.warn('Failed to save session to localStorage:', error)
      }
    }
  }

  /**
   * Load session from storage
   */
  private loadStoredSession(): ChatSession | null {
    if (!this.shouldPersistSession()) return null

    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as ChatSession
      }
    } catch (error) {
      console.warn('Failed to load session from localStorage:', error)
      this.removeStoredSession()
    }
    
    return null
  }

  /**
   * Remove session from storage
   */
  private removeStoredSession(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to remove session from localStorage:', error)
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager()
export default sessionManager
