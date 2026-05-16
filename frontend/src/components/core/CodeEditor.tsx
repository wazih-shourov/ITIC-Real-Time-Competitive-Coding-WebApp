import React from 'react'
import Editor from '@monaco-editor/react'
import type { EditorProps } from '@monaco-editor/react'

interface CodeEditorProps extends EditorProps {
  isLoading?: boolean
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  height = "400px", 
  language = "python", 
  theme = "vs-dark", 
  value = "", 
  options = {},
  ...props 
}) => {
  return (
    <div className="relative w-full h-full rounded-md overflow-hidden border border-white/10">
      <Editor
        height={height}
        language={language}
        theme={theme}
        value={value}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          ...options
        }}
        {...props}
      />
    </div>
  )
}

export default CodeEditor
