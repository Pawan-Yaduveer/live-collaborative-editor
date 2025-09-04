'use client';

import { Check, X } from 'lucide-react';

interface PreviewModalProps {
  originalText: string;
  aiSuggestion: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PreviewModal({ 
  originalText, 
  aiSuggestion, 
  onConfirm, 
  onCancel 
}: PreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            AI Suggestion Preview
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Compare the original text with the AI suggestion
          </p>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Text */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                Original
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {originalText}
                </p>
              </div>
            </div>
            
            {/* AI Suggestion */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                AI Suggestion
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {aiSuggestion}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={() => {
              console.log('Cancel button clicked in PreviewModal');
              onCancel();
            }}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Confirm button clicked in PreviewModal');
              onConfirm();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium"
          >
            <Check size={18} />
            Confirm & Replace
          </button>
        </div>
      </div>
    </div>
  );
}
