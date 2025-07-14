<template>
  <div 
    class="markdown-content prose max-w-none"
    v-html="renderedContent"
  ></div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import DOMPurify from 'dompurify'

// Import commonly used languages for syntax highlighting
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'

// Import highlight.js theme
import 'highlight.js/styles/github.css'

interface Props {
  content: string
}

const props = defineProps<Props>()

// Register languages with highlight.js
onMounted(() => {
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('python', python)
  hljs.registerLanguage('java', java)
  hljs.registerLanguage('cpp', cpp)
  hljs.registerLanguage('css', css)
  hljs.registerLanguage('html', html)
  hljs.registerLanguage('xml', html)
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('sql', sql)
  hljs.registerLanguage('bash', bash)
  hljs.registerLanguage('shell', bash)
  hljs.registerLanguage('markdown', markdown)
})

// Configure markdown-it with advanced features
const md = new MarkdownIt({
  html: true,          // Enable HTML tags in source
  xhtmlOut: true,      // Use '/' to close single tags (<br />)
  breaks: true,        // Convert '\n' in paragraphs into <br>
  langPrefix: 'hljs language-',  // CSS language prefix for fenced blocks
  linkify: true,       // Auto-convert URL-like text to links
  typographer: true,   // Enable some language-neutral replacement + quotes beautification
  
  // Highlight function for code blocks
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    
    // Auto-detect language if not specified
    try {
      return hljs.highlightAuto(str).value
    } catch (__) {}

    return '' // Use external default escaping
  }
})

// Enable advanced features
md.enable(['table', 'strikethrough'])

// Configure DOMPurify for security
const purifyConfig = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 's', 'del',
    'a', 'img', 'ul', 'ol', 'li', 'blockquote',
    'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr', 'div', 'span', 'sub', 'sup',
    'details', 'summary'
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'id',
    'align', 'style', 'target', 'rel',
    'colspan', 'rowspan'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
}

const renderedContent = computed(() => {
  if (!props.content) return ''
  
  try {
    // Render markdown to HTML
    const htmlContent = md.render(props.content)
    
    // Sanitize the HTML for security
    const sanitizedContent = DOMPurify.sanitize(htmlContent, purifyConfig)
    
    return sanitizedContent
  } catch (error) {
    console.error('Error rendering markdown:', error)
    return `<p style="color: red;">Error rendering markdown content</p>`
  }
})
</script>

<style scoped>
.markdown-content {
  line-height: 1.6;
  color: #1f2937;
}

/* Headers */
.markdown-content :deep(h1) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.markdown-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  margin-top: 1.25rem;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.25rem;
}

.markdown-content :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  color: #111827;
}

.markdown-content :deep(h4) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
  color: #111827;
}

.markdown-content :deep(h5) {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
  color: #111827;
}

.markdown-content :deep(h6) {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
  color: #374151;
}

/* Paragraphs */
.markdown-content :deep(p) {
  margin-bottom: 0.5rem;
  color: #374151;
  line-height: 1.6;
}

/* Lists */
.markdown-content :deep(ul) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
  list-style-type: disc;
}

.markdown-content :deep(ol) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
  list-style-type: decimal;
}

.markdown-content :deep(li) {
  margin-bottom: 0.25rem;
  color: #374151;
}

.markdown-content :deep(li > ul),
.markdown-content :deep(li > ol) {
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
}

/* Links */
.markdown-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.markdown-content :deep(a:hover) {
  color: #1d4ed8;
}

/* Emphasis */
.markdown-content :deep(strong) {
  font-weight: bold;
  color: #111827;
}

.markdown-content :deep(em) {
  font-style: italic;
}

.markdown-content :deep(s),
.markdown-content :deep(del) {
  text-decoration: line-through;
  color: #6b7280;
}

/* Code */
.markdown-content :deep(code) {
  background-color: #f3f4f6;
  color: #1f2937;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
}

.markdown-content :deep(pre) {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  font-size: 0.875rem;
}

/* Blockquotes */
.markdown-content :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  background-color: #f9fafb;
  font-style: italic;
  color: #374151;
}

/* Tables */
.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #d1d5db;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.markdown-content :deep(table th) {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 0.75rem;
  font-weight: 600;
  text-align: left;
  color: #111827;
}

.markdown-content :deep(table td) {
  border: 1px solid #d1d5db;
  padding: 0.75rem;
  color: #374151;
}

.markdown-content :deep(table tr:nth-child(even)) {
  background-color: #f9fafb;
}

.markdown-content :deep(table tr:hover) {
  background-color: #f3f4f6;
}

/* Responsive tables */
@media (max-width: 768px) {
  .markdown-content :deep(table) {
    font-size: 0.75rem;
  }
  
  .markdown-content :deep(table th),
  .markdown-content :deep(table td) {
    padding: 0.5rem 0.25rem;
  }
}

/* Horizontal rules */
.markdown-content :deep(hr) {
  border-top: 1px solid #d1d5db;
  margin: 1.5rem 0;
}

/* Images */
.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Syntax highlighting customization */
.markdown-content :deep(.hljs) {
  background-color: #f9fafb;
  color: #1f2937;
}

.markdown-content :deep(.hljs-comment) {
  color: #6b7280;
  font-style: italic;
}

.markdown-content :deep(.hljs-keyword) {
  color: #7c3aed;
  font-weight: 600;
}

.markdown-content :deep(.hljs-string) {
  color: #059669;
}

.markdown-content :deep(.hljs-number) {
  color: #2563eb;
}

.markdown-content :deep(.hljs-function) {
  color: #1e40af;
}

.markdown-content :deep(.hljs-variable) {
  color: #dc2626;
}

/* Custom scrollbar for code blocks */
.markdown-content :deep(pre)::-webkit-scrollbar {
  height: 8px;
}

.markdown-content :deep(pre)::-webkit-scrollbar-track {
  background-color: #f3f4f6;
}

.markdown-content :deep(pre)::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.markdown-content :deep(pre)::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>
