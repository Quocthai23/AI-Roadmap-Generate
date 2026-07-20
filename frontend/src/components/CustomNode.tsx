import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data, id, targetPosition, sourcePosition }: { data: any; id: string; targetPosition?: Position; sourcePosition?: Position }) {
  return (
    <div className="relative group px-6 py-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl bg-white/90 backdrop-blur-xl border border-white w-[260px] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1">
      <div className="flex flex-col items-center text-center">
        <div className="text-base font-bold text-slate-800 leading-snug">
          {data.label}
        </div>
        
        {data.hasMore && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              data.onExpand(id, data.label);
            }}
            disabled={data.isLoading}
            className="mt-4 w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-indigo-500/30 hover:scale-110 focus:outline-none disabled:opacity-50 transition-all cursor-pointer z-10"
            title="Khám phá chi tiết"
          >
            {data.isLoading ? (
              <span className="animate-spin text-xl">↻</span>
            ) : (
              <span className="text-3xl font-light mb-1 leading-none">+</span>
            )}
          </button>
        )}
      </div>
      
      {/* Handles */}
      <Handle type="target" position={targetPosition ?? Position.Top} className="w-4 h-4 bg-indigo-500 border-[3px] border-white shadow-sm" />
      <Handle type="source" position={sourcePosition ?? Position.Bottom} className="w-4 h-4 bg-indigo-500 border-[3px] border-white shadow-sm" />
    </div>
  );
}

export default memo(CustomNode);
