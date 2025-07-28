/**
 * Response Parser for LiSA Chat API
 * Handles parsing of structured API responses with function calls
 */

export interface FunctionCall {
  id: string
  name: string
  arguments: Record<string, any>
  result: Record<string, any>
}

export interface TranslationResult {
  document_id: string
  filename: string
  source_language: string
  target_language: string
  original_content: string
  translated_content: string
  original_word_count: number
  translated_word_count: number
  page_count: number
  message: string
  translation_info: {
    source_language: string
    target_language: string
    source_language_code: string
    target_language_code: string
    document_size: string
    translation_size: string
    chunks_processed: number
    translation_service: string
  }
}

export interface SummaryResult {
  document_id: string
  filename: string
  summary_type: string
  summary: string
  key_points: string[]
  word_count: number
  message: string
}

export interface ParsedApiResponse {
  // Basic response fields
  response: string
  session_id: string | null
  sources: string[]
  
  // Structured data
  hasFunctionCalls: boolean
  functionCalls: FunctionCall[]
  
  // Parsed results by type
  translations: TranslationResult[]
  summaries: SummaryResult[]
  
  // Response type detection
  responseType: 'simple' | 'translation' | 'summary' | 'mixed'
  
  // Backward compatibility
  displayText: string
}

class ResponseParser {
  /**
   * Parse API response into structured format
   */
  parseResponse(rawResponse: any): ParsedApiResponse {
    // Initialize parsed response
    const parsed: ParsedApiResponse = {
      response: rawResponse.response || '',
      session_id: rawResponse.session_id || null,
      sources: rawResponse.sources || [],
      hasFunctionCalls: false,
      functionCalls: [],
      translations: [],
      summaries: [],
      responseType: 'simple',
      displayText: rawResponse.response || ''
    }

    // Check for function calls
    if (rawResponse.function_calls && Array.isArray(rawResponse.function_calls)) {
      parsed.hasFunctionCalls = true
      parsed.functionCalls = rawResponse.function_calls

      // Parse function calls by type
      this.parseFunctionCalls(parsed)
      
      // Determine response type
      parsed.responseType = this.determineResponseType(parsed)
    } else {
      // Try to parse text-based responses for translation and summary data
      this.parseTextResponse(parsed)
    }

    return parsed
  }

  /**
   * Parse text-based responses for translation and summary data
   */
  private parseTextResponse(parsed: ParsedApiResponse): void {
    const text = parsed.response.toLowerCase()
    
    // Check for translation indicators
    if (this.isTranslationResponse(text)) {
      const translationData = this.extractTranslationFromText(parsed.response)
      if (translationData) {
        parsed.translations.push(translationData)
        parsed.hasFunctionCalls = true
        parsed.responseType = 'translation'
      }
    }
    
    // Check for summary indicators
    if (this.isSummaryResponse(text)) {
      const summaryData = this.extractSummaryFromText(parsed.response)
      if (summaryData) {
        parsed.summaries.push(summaryData)
        parsed.hasFunctionCalls = true
        parsed.responseType = parsed.responseType === 'translation' ? 'mixed' : 'summary'
      }
    }
  }

  /**
   * Check if response indicates a translation was performed
   */
  private isTranslationResponse(text: string): boolean {
    const translationKeywords = [
      'translated', 'translation', 'translate',
      'original word count', 'translated word count',
      'source language', 'target language'
    ]
    return translationKeywords.some(keyword => text.includes(keyword))
  }

  /**
   * Check if response indicates a summary was generated
   */
  private isSummaryResponse(text: string): boolean {
    const summaryKeywords = [
      'summary', 'summarized', 'summarize',
      'key points', 'brief summary', 'overview'
    ]
    return summaryKeywords.some(keyword => text.includes(keyword))
  }

  /**
   * Extract translation data from text response
   */
  private extractTranslationFromText(text: string): TranslationResult | null {
    try {
      // Extract filename
      const filenameMatch = text.match(/"([^"]*\.pdf)"/i)
      const filename = filenameMatch ? filenameMatch[1] : 'Unknown document'

      // Extract word counts
      const originalWordsMatch = text.match(/original word count:\s*(\d+)/i)
      const translatedWordsMatch = text.match(/translated word count:\s*(\d+)/i)
      const originalWordCount = originalWordsMatch ? parseInt(originalWordsMatch[1]) : 0
      const translatedWordCount = translatedWordsMatch ? parseInt(translatedWordsMatch[1]) : 0

      // Extract languages
      const sourceLanguageMatch = text.match(/source language:\s*([^\n\r(]+)/i)
      const targetLanguageMatch = text.match(/target language:\s*([^\n\r]+)/i)
      const sourceLanguage = sourceLanguageMatch ? sourceLanguageMatch[1].trim() : 'Unknown'
      const targetLanguage = targetLanguageMatch ? targetLanguageMatch[1].trim() : 'Unknown'

      // Extract page count
      const pageCountMatch = text.match(/page count:\s*(\d+)/i) || text.match(/(\d+)\s*pages?/i)
      const pageCount = pageCountMatch ? parseInt(pageCountMatch[1]) : 1

      // Generate document ID
      const documentId = `text_parsed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        document_id: documentId,
        filename: filename,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        original_content: 'Content available in full translation output',
        translated_content: 'Content available in full translation output',
        original_word_count: originalWordCount,
        translated_word_count: translatedWordCount,
        page_count: pageCount,
        message: `Translation completed: ${filename}`,
        translation_info: {
          source_language: sourceLanguage,
          target_language: targetLanguage,
          source_language_code: this.getLanguageCode(sourceLanguage),
          target_language_code: this.getLanguageCode(targetLanguage),
          document_size: 'N/A',
          translation_size: 'N/A',
          chunks_processed: 1,
          translation_service: 'LiSA Translation Service'
        }
      }
    } catch (error) {
      console.error('Error extracting translation data from text:', error)
      return null
    }
  }

  /**
   * Extract summary data from text response
   */
  private extractSummaryFromText(text: string): SummaryResult | null {
    try {
      // Extract filename
      const filenameMatch = text.match(/"([^"]*\.pdf)"/i)
      const filename = filenameMatch ? filenameMatch[1] : 'Unknown document'

      // Extract word count if available
      const wordCountMatch = text.match(/(\d+)\s*words?/i)
      const wordCount = wordCountMatch ? parseInt(wordCountMatch[1]) : 0

      // Try to extract key points or summary content
      let summary = text
      let keyPoints: string[] = []

      // Look for structured summary sections
      const summaryMatch = text.match(/summary[:\s]+(.*?)(?:\n\n|$)/is)
      if (summaryMatch) {
        summary = summaryMatch[1].trim()
      }

      // Try to extract bullet points or numbered lists as key points
      const bulletPoints = text.match(/[•\-\*]\s*([^\n\r]+)/gi)
      if (bulletPoints) {
        keyPoints = bulletPoints.map(point => point.replace(/^[•\-\*]\s*/, '').trim())
      }

      // Generate document ID
      const documentId = `text_summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        document_id: documentId,
        filename: filename,
        summary_type: 'brief',
        summary: summary,
        key_points: keyPoints,
        word_count: wordCount,
        message: `Summary generated for ${filename}`
      }
    } catch (error) {
      console.error('Error extracting summary data from text:', error)
      return null
    }
  }

  /**
   * Get language code from language name
   */
  private getLanguageCode(language: string): string {
    const languageCodes: Record<string, string> = {
      'english': 'en',
      'french': 'fr',
      'spanish': 'es',
      'german': 'de',
      'italian': 'it',
      'portuguese': 'pt',
      'russian': 'ru',
      'chinese': 'zh',
      'japanese': 'ja',
      'korean': 'ko'
    }
    return languageCodes[language.toLowerCase()] || language.toLowerCase().substr(0, 2)
  }

  /**
   * Parse function calls into specific result types
   */
  private parseFunctionCalls(parsed: ParsedApiResponse): void {
    for (const funcCall of parsed.functionCalls) {
      try {
        switch (funcCall.name) {
          case 'translate_document':
            if (funcCall.result) {
              parsed.translations.push(funcCall.result as TranslationResult)
            }
            break

          case 'summarize_document':
            if (funcCall.result) {
              parsed.summaries.push(funcCall.result as SummaryResult)
            }
            break

          // Add more function types as they become available
          default:
            console.log(`Unknown function call type: ${funcCall.name}`)
            break
        }
      } catch (error) {
        console.error(`Error parsing function call ${funcCall.name}:`, error)
      }
    }
  }

  /**
   * Determine the primary response type
   */
  private determineResponseType(parsed: ParsedApiResponse): 'simple' | 'translation' | 'summary' | 'mixed' {
    const hasTranslations = parsed.translations.length > 0
    const hasSummaries = parsed.summaries.length > 0

    if (hasTranslations && hasSummaries) {
      return 'mixed'
    } else if (hasTranslations) {
      return 'translation'
    } else if (hasSummaries) {
      return 'summary'
    } else {
      return 'simple'
    }
  }

  /**
   * Extract display text for backward compatibility
   */
  getDisplayText(parsed: ParsedApiResponse): string {
    if (!parsed.hasFunctionCalls) {
      return parsed.response
    }

    // If we have function calls, we might want to show both the response text
    // and indicate that there are structured results available
    let displayText = parsed.response

    if (parsed.translations.length > 0) {
      const count = parsed.translations.length
      displayText += `\n\n✅ ${count} translation${count > 1 ? 's' : ''} completed`
    }

    if (parsed.summaries.length > 0) {
      const count = parsed.summaries.length
      displayText += `\n\n📄 ${count} document${count > 1 ? 's' : ''} summarized`
    }

    return displayText
  }

  /**
   * Validate if response has expected structure
   */
  isValidResponse(response: any): boolean {
    // Check for basic response structure
    if (typeof response !== 'object' || response === null) {
      return false
    }

    // Must have at least a response field
    if (typeof response.response !== 'string') {
      return false
    }

    // If function_calls exist, they should be an array
    if (response.function_calls && !Array.isArray(response.function_calls)) {
      return false
    }

    return true
  }

  /**
   * Get human-readable summary of function calls
   */
  getFunctionCallSummary(parsed: ParsedApiResponse): string[] {
    const summaries: string[] = []

    for (const translation of parsed.translations) {
      summaries.push(
        `Translated "${translation.filename}" from ${translation.source_language} to ${translation.target_language}`
      )
    }

    for (const summary of parsed.summaries) {
      summaries.push(
        `Generated ${summary.summary_type} summary for "${summary.filename}"`
      )
    }

    return summaries
  }

  /**
   * Extract key metrics from function calls
   */
  getMetrics(parsed: ParsedApiResponse): Record<string, any> {
    const metrics: Record<string, any> = {}

    if (parsed.translations.length > 0) {
      const totalOriginalWords = parsed.translations.reduce((sum, t) => sum + t.original_word_count, 0)
      const totalTranslatedWords = parsed.translations.reduce((sum, t) => sum + t.translated_word_count, 0)
      
      metrics.translation = {
        count: parsed.translations.length,
        totalOriginalWords,
        totalTranslatedWords,
        languages: parsed.translations.map(t => `${t.source_language} → ${t.target_language}`)
      }
    }

    if (parsed.summaries.length > 0) {
      const totalWords = parsed.summaries.reduce((sum, s) => sum + s.word_count, 0)
      
      metrics.summary = {
        count: parsed.summaries.length,
        totalWords,
        types: [...new Set(parsed.summaries.map(s => s.summary_type))]
      }
    }

    return metrics
  }
}

// Export singleton instance
export const responseParser = new ResponseParser()
export default responseParser
