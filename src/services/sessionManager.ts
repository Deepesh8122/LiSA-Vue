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
   * Get or create the current chat session
   */
  getCurrentSession(): ChatSession {
    if (this.currentSession && !this.isSessionExpired(this.currentSession)) {
      // Update last used time
      this.currentSession.lastUsed = Date.now()
      this.saveSession(this.currentSession)
      return this.currentSession
    }

    // Load from storage or create new
    const stored = this.loadStoredSession()
    if (stored && !this.isSessionExpired(stored)) {
      this.currentSession = stored
      this.currentSession.lastUsed = Date.now()
      this.saveSession(this.currentSession)
      return this.currentSession
    }

    // Create new session
    return this.createNewSession()
  }

  /**
   * Get the current session ID for API calls
   */
  getSessionId(): string {
    return this.getCurrentSession().id
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
    session.messageCount++
    session.lastUsed = Date.now()
    this.saveSession(session)
  }

  /**
   * Clear current session (force new session on next call)
   */
  clearSession(): void {
    this.currentSession = null
    this.removeStoredSession()
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
