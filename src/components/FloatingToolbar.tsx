'use client';

import { useState } from 'react';
import { EditorSelection } from '@/types';
import { Editor } from '@tiptap/react';
import { 
  Wand2, 
  Eye, 
  Scissors, 
  FileText, 
  Table,
  Palette
} from 'lucide-react';
import PreviewModal from './PreviewModal';

interface FloatingToolbarProps {
  selection: EditorSelection;
  editor: Editor;
}

export default function FloatingToolbar({ selection, editor }: FloatingToolbarProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  console.log('FloatingToolbar rendered with selection:', selection);

  const handleAIEdit = async (action: string) => {
    setIsLoading(true);
    try {
      // Using Groq API for AI editing
      const response = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: selection.text,
          action,
          context: editor.getText()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestion(data.suggestion);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    console.log('Confirm clicked!', { aiSuggestion, selection });
    if (aiSuggestion && editor) {
      try {
        // First, ensure the editor is focused
        editor.commands.focus();
        
        // Set the selection and replace the content
        editor.commands.setTextSelection({ 
          from: selection.from, 
          to: selection.to 
        });
        
        // Replace the selected text with AI suggestion
        editor.commands.deleteSelection();
        editor.commands.insertContent(aiSuggestion);
        
        console.log('Text replaced successfully');
      } catch (error) {
        console.error('Error replacing text:', error);
      }
    }
    setShowPreview(false);
    setAiSuggestion('');
  };

  const handleCancel = () => {
    console.log('Cancel clicked!');
    setShowPreview(false);
    setAiSuggestion('');
  };

  const toolbarActions = [
    { 
      id: 'shorten', 
      label: 'Shorten', 
      icon: Scissors, 
      action: 'shorten' 
    },
    { 
      id: 'expand', 
      label: 'Expand', 
      icon: FileText, 
      action: 'expand' 
    },
    { 
      id: 'table', 
      label: 'Table', 
      icon: Table, 
      action: 'convert_to_table' 
    },
    { 
      id: 'style', 
      label: 'Style', 
      icon: Palette, 
      action: 'improve_style' 
    },
  ];

  return (
    <>
      <div className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 flex items-center gap-2" 
           style={{
             top: '20px',
             left: '50%',
             transform: 'translateX(-50%)',
             maxWidth: '90vw',
             minWidth: '300px'
           }}>
        {toolbarActions.map(({ id, label, icon: Icon, action }) => (
          <button
            key={id}
            onClick={() => handleAIEdit(action)}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
            title={label}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
        
        <div className="w-px h-6 bg-gray-200 mx-1" />
        
        <button
          onClick={() => handleAIEdit('general_edit')}
          disabled={isLoading}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
        >
          <Wand2 size={16} />
          Edit with AI
        </button>
        
        {aiSuggestion && (
          <>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Eye size={16} />
              Preview
            </button>
          </>
        )}
      </div>

      {showPreview && (
        <PreviewModal
          originalText={selection.text}
          aiSuggestion={aiSuggestion}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
