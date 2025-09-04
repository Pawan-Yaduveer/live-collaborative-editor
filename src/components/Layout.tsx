'use client';

import React, { useState, useRef, useCallback } from 'react';
import Editor from './Editor';
import ChatSidebar from './ChatSidebar';
import { EditorSelection } from '@/types';

export default function Layout() {
  const [selection, setSelection] = useState<EditorSelection | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(400); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const editorRef = useRef<{ insertText: (text: string, from?: number, to?: number) => void; replaceSelection: (text: string) => void } | null>(null);

  const handleSelectionChange = (newSelection: EditorSelection) => {
    setSelection(newSelection);
  };

  const handleContentChange = (_content: string) => {
    // Content change handled by editor internally
  };

  const handleApplyEdit = (text: string) => {
    if (editorRef.current?.replaceSelection) {
      editorRef.current.replaceSelection(text);
    }
  };

  const handleInsertText = (text: string) => {
    if (editorRef.current?.insertText) {
      editorRef.current.insertText(text);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 300;
    const maxWidth = window.innerWidth * 0.7; // Max 70% of screen width
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add event listeners for mouse move and up
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Live Collaborative Editor
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered editing with real-time collaboration
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>

        {/* Editor Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-white">
            <Editor
              ref={editorRef}
              onSelectionChange={handleSelectionChange}
              onContentChange={handleContentChange}
              initialContent="Welcome to your AI-powered collaborative editor! 

Start writing your document and you'll see:
• A floating toolbar when you select text
• AI chat assistance on the right
• Real-time editing capabilities

Try selecting some text to see the AI editing options!

## Features Available:

### 1. Rich Text Editing
This editor supports all the standard text formatting options including bold, italic, headings, lists, and more. You can use the floating toolbar that appears when you select text to apply AI-powered edits.

### 2. AI Chat Assistant
The chat panel on the right allows you to have conversations with the AI assistant. You can ask questions, request help with writing, or get suggestions for improving your content.

### 3. AI-Powered Editing
When you select text, a floating toolbar appears with options like:
- Shorten: Make text more concise
- Expand: Add more detail and context
- Improve Style: Enhance writing flow and clarity
- Convert to Table: Transform text into structured tables

### 4. Web Search Integration
The AI assistant can search the web for information and help you research topics or find current information to include in your document.

### 5. Real-time Collaboration
This editor is designed for collaborative work, allowing multiple users to work on the same document simultaneously.

## Getting Started:

1. Start typing your content in this editor
2. Select any text to see the floating toolbar
3. Use the chat panel on the right for AI assistance
4. Try the different AI editing options to enhance your writing

The editor will automatically save your work and you can continue editing as long as needed. The scroll functionality allows you to work with long documents comfortably.

Happy writing!"
            />
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={`w-2 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors flex items-center justify-center group ${
          isResizing ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
        title="Drag to resize sidebar"
      >
        <div className="w-1 h-8 bg-gray-400 group-hover:bg-white rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Chat Sidebar */}
      <div style={{ width: `${sidebarWidth}px` }} className="flex-shrink-0">
        <ChatSidebar
          onApplyEdit={handleApplyEdit}
          onInsertText={handleInsertText}
          selectedText={selection?.text || ''}
          hasSelection={!selection?.isEmpty}
          width={sidebarWidth}
        />
      </div>
    </div>
  );
}
