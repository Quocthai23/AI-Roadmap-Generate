import React from 'react';
import ReactMarkdown from 'react-markdown';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  isLoading: boolean;
}

export default function SidePanel({ isOpen, onClose, title, content, isLoading }: SidePanelProps) {
  return (
    <div 
      className={`fixed top-0 right-0 h-full w-[450px] bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">AI</div>
          <h2 className="text-base font-semibold text-gray-800 truncate max-w-[300px]" title={title}>{title || 'Chi tiết'}</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            <div className="h-24 bg-gray-100 rounded w-full mt-6"></div>
            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
          </div>
        ) : (
          <div className="prose prose-sm prose-gray max-w-none text-gray-700">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
