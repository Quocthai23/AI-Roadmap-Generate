'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { parseHierarchyToFlow } from '../utils/flowParser';
import CustomNode from '../components/CustomNode';
import { getLayoutedElements } from '../utils/layout';
import SidePanel from '../components/SidePanel';
import { toPng } from 'html-to-image';

const nodeTypes = { customNode: CustomNode };

export default function RoadmapBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTitle, setPanelTitle] = useState('');
  const [panelContent, setPanelContent] = useState('');
  const [panelLoading, setPanelLoading] = useState(false);
  
  const [currentTopic, setCurrentTopic] = useState("Javascript Advanced");

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const getNodePath = useCallback((nodeId: string): string => {
    let currentId = nodeId;
    const path: string[] = [];
    
    const currentNode = nodesRef.current.find(n => n.id === currentId);
    if (currentNode) {
      path.push(currentNode.data.label);
    }

    while (true) {
      const parentEdge = edgesRef.current.find(e => e.target === currentId);
      if (!parentEdge) break;
      
      currentId = parentEdge.source;
      const parentNode = nodesRef.current.find(n => n.id === currentId);
      if (parentNode) {
        path.unshift(parentNode.data.label);
      } else {
        break;
      }
    }
    
    return path.join(' > ');
  }, []);

  const onNodeClick = useCallback(async (event: React.MouseEvent, node: Node) => {
    if ((event.target as HTMLElement).tagName.toLowerCase() === 'button' || (event.target as HTMLElement).closest('button')) {
      return;
    }
    
    const contextPath = getNodePath(node.id);
    setPanelTitle(node.data.label);
    setPanelContent('');
    setPanelLoading(true);
    setPanelOpen(true);
    
    const cacheKey = `explain_${currentTopic}_${contextPath}`;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setPanelContent(cached);
      } else {
        const response = await fetch(`http://localhost:3000/roadmap/explain?path=${encodeURIComponent(currentTopic + ' > ' + contextPath)}`);
        const text = await response.text();
        localStorage.setItem(cacheKey, text);
        setPanelContent(text);
      }
    } catch (error) {
      console.error("Lỗi khi giải thích ngữ cảnh:", error);
      setPanelContent("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setPanelLoading(false);
    }
  }, [getNodePath, currentTopic]);

  const handleExpandNode = useCallback(async (nodeId: string, label: string) => {
    setNodes((nds) => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isLoading: true } } : n));
    
    try {
      const cacheKey = `expand_${currentTopic}_${label}`;
      let newChildren;
      
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        newChildren = JSON.parse(cached);
      } else {
        const response = await fetch(`http://localhost:3000/roadmap/expand?topic=${encodeURIComponent(currentTopic)}&node=${encodeURIComponent(label)}`);
        newChildren = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(newChildren));
      }
      
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      
      newChildren.forEach((child: any) => {
        const childId = crypto.randomUUID();
        newNodes.push({
          id: childId,
          data: { label: child.label, hasMore: child.hasMore, onExpand: handleExpandNode },
          position: { x: 0, y: 0 },
          type: 'customNode'
        });
        
        newEdges.push({
          id: `e-${nodeId}-${childId}`,
          source: nodeId,
          target: childId,
          animated: true,
        });
      });
      
      const currentNodes = nodesRef.current.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isLoading: false, hasMore: false } } : n);
      const combinedNodes = [...currentNodes, ...newNodes];
      
      const currentEdges = edgesRef.current;
      const combinedEdges = [...currentEdges, ...newEdges];
      
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(combinedNodes, combinedEdges, 'LR');
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      
    } catch (error) {
      console.error("Lỗi khi mở rộng nhánh:", error);
      setNodes((nds) => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isLoading: false } } : n));
    }
  }, [setNodes, setEdges]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const cacheKey = `roadmap_${currentTopic}`;
      let data;
      
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        data = JSON.parse(cached);
      } else {
        const response = await fetch(`http://localhost:3000/roadmap/generate?topic=${encodeURIComponent(currentTopic)}`);
        data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
      
      const flowData = parseHierarchyToFlow(data);
      
      flowData.nodes = flowData.nodes.map(n => ({
        ...n,
        data: { ...n.data, onExpand: handleExpandNode }
      }));
      
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(flowData.nodes, flowData.edges, 'LR');
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch (error) {
      console.error("Lỗi khi tạo roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: '#f8fafc' }}>
      <div className="absolute top-6 left-6 z-10 flex items-center bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 transition-all">
        <input 
          type="text" 
          value={currentTopic}
          onChange={(e) => setCurrentTopic(e.target.value)}
          placeholder="Bạn muốn học chủ đề gì?..."
          className="bg-transparent px-4 py-2 w-80 text-slate-800 placeholder-slate-400 focus:outline-none text-lg font-medium"
          onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
        />
        <div className="w-[1px] h-8 bg-slate-200 mx-2"></div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !currentTopic.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 font-semibold flex items-center justify-center min-w-[140px]"
        >
          {loading ? (
             <span className="flex items-center gap-2">
                <span className="animate-spin">↻</span> Đang tạo...
             </span>
          ) : 'Tạo Roadmap'}
        </button>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={() => {
            const el = document.querySelector('.react-flow') as HTMLElement;
            if (el) {
              toPng(el, { backgroundColor: '#f8fafc' }).then((dataUrl) => {
                const a = document.createElement('a');
                a.setAttribute('download', 'roadmap.png');
                a.setAttribute('href', dataUrl);
                a.click();
              });
            }
          }}
          className="bg-white/80 backdrop-blur-xl text-indigo-600 px-5 py-2.5 rounded-xl shadow-md border border-white/50 hover:bg-indigo-50 hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold flex items-center gap-2"
        >
          <span>📸 Tải Sơ Đồ</span>
        </button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        className="bg-slate-50"
      >
        <Background color="#cbd5e1" gap={24} size={2} />
        <Controls className="bg-white shadow-lg rounded-xl border-none overflow-hidden" />
      </ReactFlow>
      
      <SidePanel 
        isOpen={panelOpen} 
        onClose={() => setPanelOpen(false)} 
        title={panelTitle} 
        content={panelContent} 
        isLoading={panelLoading} 
      />
    </div>
  );
}
