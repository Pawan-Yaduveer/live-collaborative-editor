'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { EditorSelection } from '@/types';
import FloatingToolbar from './FloatingToolbar';

interface EditorProps {
  onSelectionChange?: (selection: EditorSelection) => void;
  onContentChange?: (content: string) => void;
  initialContent?: string;
}

export interface EditorRef {
  insertText: (text: string, from?: number, to?: number) => void;
  replaceSelection: (text: string) => void;
}

const Editor = forwardRef<EditorRef, EditorProps>(({ 
  onSelectionChange, 
  onContentChange, 
  initialContent = '' 
}, ref) => {
  const [selection, setSelection] = useState<EditorSelection>({
    text: '',
    from: 0,
    to: 0,
    isEmpty: true
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your document...',
      }),
      TextStyle,
      Color,
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onContentChange?.(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to, empty } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);
      
      const newSelection: EditorSelection = {
        text: selectedText,
        from,
        to,
        isEmpty: empty
      };
      
      console.log('Selection updated:', newSelection);
      setSelection(newSelection);
      onSelectionChange?.(newSelection);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-6 max-w-none',
      },
    },
  });

  const insertText = useCallback((text: string, from?: number, to?: number) => {
    if (!editor) return;
    
    if (from !== undefined && to !== undefined) {
      editor.chain().focus().setTextSelection({ from, to }).insertContent(text).run();
    } else {
      editor.chain().focus().insertContent(text).run();
    }
  }, [editor]);

  const replaceSelection = useCallback((text: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(text).run();
  }, [editor]);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    insertText,
    replaceSelection
  }), [insertText, replaceSelection]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <EditorContent editor={editor} />
      {!selection.isEmpty && (
        <FloatingToolbar 
          selection={selection}
          editor={editor}
        />
      )}
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
