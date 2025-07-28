declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Material Icon props
declare type MaterialIconProps = {
  name: string;
  size?: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
  color?: string;
  customClass?: string;
}

// Export MaterialIcon size type for other components
export type MaterialIconSize = 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';

// Enhanced Message Types for LiSA Chat
import type { ParsedApiResponse, FunctionCall, TranslationResult, SummaryResult } from '@/services/responseParser'

export interface Message {
  id: number;
  sender: 'user' | 'ai';
  type: 'text' | 'image' | 'code' | 'file' | 'files' | 'error' | 'loading' | 'translation' | 'summary' | 'function-result';
  content: string;
  timestamp: Date;
  
  // Optional fields for different message types
  alt?: string;
  fileName?: string;
  fileSize?: number;
  files?: File[];
  error?: string;
  
  // Enhanced API response data
  parsedResponse?: ParsedApiResponse;
  sessionId?: string;
  sources?: string[];
  
  // Function call results
  functionCalls?: FunctionCall[];
  translations?: TranslationResult[];
  summaries?: SummaryResult[];
  
  // UI state
  isLoading?: boolean;
  timeoutWarning?: boolean;
  isStructuredResponse?: boolean;
}

// Session information
export interface SessionInfo {
  id: string;
  age: string;
  messageCount: number;
  isExpired: boolean;
}

// Component props for structured results
export interface TranslationDisplayProps {
  translation: TranslationResult;
  expanded?: boolean;
}

export interface SummaryDisplayProps {
  summary: SummaryResult;
  expanded?: boolean;
}

export interface FunctionCallDisplayProps {
  functionCall: FunctionCall;
  expanded?: boolean;
}
