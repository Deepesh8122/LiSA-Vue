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
  private currentSessionId: string | null = null
  private messageCount: number = 0

  /**
   * Set the current session ID
   */
  setSessionId(sessionId: string): void {
    this.currentSessionId = sessionId
    localStorage.setItem('currentSessionId', sessionId)
  }

  /**
   * Get the current session ID for API calls
   */
  getSessionId(): string | null {
    if (!this.currentSessionId) {
      this.currentSessionId = localStorage.getItem('currentSessionId')
    }
    return this.currentSessionId
  }

  /**
   * Increment message count for current session
   */
  incrementMessageCount(): void {
    this.messageCount++
  }

  /**
   * Get the current message count
   */
  getMessageCount(): number {
    return this.messageCount
  }

  /**
   * Clear current session (force new session on next call)
   */
  clearSession(): void {
    this.currentSessionId = null
    this.messageCount = 0
    localStorage.removeItem('currentSessionId')
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
    id: string; 
    age: string; 
    messageCount: number; 
    isExpired: boolean 
  } {
    const session = this.getCurrentSession()
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
    // Generate a UUID-like string for session ID
    return 'session_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9)
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
   * Get or create the current session
   */
  private getCurrentSession(): ChatSession {
    const stored = this.loadStoredSession()
    if (stored && !this.isSessionExpired(stored)) {
      return stored
    }
    
    return {
      id: this.generateSessionId(),
      createdAt: Date.now(),
      lastUsed: Date.now(),
      messageCount: 0
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

// Create and export singleton instance
const sessionManager = new SessionManager();
export { sessionManager };
export default sessionManager;