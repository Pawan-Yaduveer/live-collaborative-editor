export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'edit' | 'search';
}

export interface AIEdit {
  originalText: string;
  editedText: string;
  reason: string;
  position: {
    from: number;
    to: number;
  };
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  tools: string[];
  enabled: boolean;
}

export interface EditorSelection {
  text: string;
  from: number;
  to: number;
  isEmpty: boolean;
}
