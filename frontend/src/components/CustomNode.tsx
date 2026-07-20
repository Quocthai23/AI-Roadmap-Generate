import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data, id, targetPosition, sourcePosition }: { data: any; id: string; targetPosition?: Position; sourcePosition?: Position }) {
  return (
    <div className="relative group px-5 py-4 bg-white border border-gray-200 rounded-xl shadow-sm w-[260px] hover:border-gray-300 hover:shadow-md transition-all">
      <div className="flex flex-col items-start text-left">
        <div className="text-sm font-medium text-gray-800 leading-snug w-full pr-10">
          {data.label}
        </div>
        
        {data.hasMore && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              data.onExpand(id, data.label);
            }}
            disabled={data.isLoading}
            className="absolute top-1/2 -translate-y-1/2 right-3 w-7 h-7 flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:outline-none disabled:opacity-50 transition-all cursor-pointer z-10"
            title="Khám phá chi tiết"
          >
            {data.isLoading ? (
              <span className="animate-spin text-sm">↻</span>
            ) : (
              <span className="text-lg font-light leading-none">+</span>
            )}
          </button>
        )}
      </div>
      
      {/* Handles */}
      <Handle type="target" position={targetPosition ?? Position.Top} className="w-2 h-2 bg-gray-300 border-none rounded-full" />
      <Handle type="source" position={sourcePosition ?? Position.Bottom} className="w-2 h-2 bg-gray-300 border-none rounded-full" />
    </div>
  );
}

export default memo(CustomNode);
