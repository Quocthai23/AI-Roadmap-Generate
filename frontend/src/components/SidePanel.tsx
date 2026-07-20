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
      className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
        <h2 className="text-xl font-bold text-gray-800 truncate" title={title}>{title || 'Chi tiết'}</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-32 bg-gray-200 rounded w-full mt-6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : (
          <div className="prose prose-sm prose-blue max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
