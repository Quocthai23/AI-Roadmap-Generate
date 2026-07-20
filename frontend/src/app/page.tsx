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
  
  const [currentTopic, setCurrentTopic] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const saveApiKey = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('gemini_api_key', tempApiKey);
    setIsSettingsOpen(false);
  };

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
        const response = await fetch(`http://localhost:3000/roadmap/explain?path=${encodeURIComponent(currentTopic + ' > ' + contextPath)}`, {
          headers: apiKey ? { 'x-gemini-api-key': apiKey } : {}
        });
        if (!response.ok) throw new Error(await response.text());
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
        const response = await fetch(`http://localhost:3000/roadmap/expand?topic=${encodeURIComponent(currentTopic)}&node=${encodeURIComponent(label)}`, {
          headers: apiKey ? { 'x-gemini-api-key': apiKey } : {}
        });
        if (!response.ok) throw new Error(await response.text());
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

  const handleGenerate = async (topicToUse?: string) => {
    const topic = topicToUse || currentTopic;
    if (!topic.trim()) return;
    
    setLoading(true);
    setHasGenerated(true);
    setCurrentTopic(topic);
    
    try {
      const cacheKey = `roadmap_${topic}`;
      let data;
      
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        data = JSON.parse(cached);
      } else {
        const response = await fetch(`http://localhost:3000/roadmap/generate?topic=${encodeURIComponent(topic)}`, {
          headers: apiKey ? { 'x-gemini-api-key': apiKey } : {}
        });
        if (!response.ok) throw new Error(await response.text());
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
    } catch (error: any) {
      console.error("Lỗi khi tạo roadmap:", error);
      alert("Đã có lỗi xảy ra: " + error.message);
      setHasGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = useCallback(() => {
    const el = document.querySelector('.react-flow') as HTMLElement;
    if (el) {
      toPng(el, { backgroundColor: '#f9f9f9' }).then((dataUrl) => {
        const a = document.createElement('a');
        a.setAttribute('download', 'roadmap.png');
        a.setAttribute('href', dataUrl);
        a.click();
      });
    }
  }, []);

  const SettingsModal = () => {
    if (!isSettingsOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/20 z-[60] flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Cài đặt API Key</h2>
          <p className="text-sm text-gray-600 mb-4">
            Ứng dụng sử dụng Google Gemini. Bạn có thể nhập API Key của riêng mình (BYOK) để sử dụng nếu máy chủ bị giới hạn.
            Key chỉ được lưu cục bộ trên trình duyệt của bạn.
          </p>
          <input 
            type="password" 
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="Nhập Gemini API Key của bạn..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
            <button onClick={saveApiKey} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">Lưu Key</button>
          </div>
        </div>
      </div>
    );
  };

  if (!hasGenerated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 font-sans">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tight">Bạn muốn học gì hôm nay?</h1>
        
        <div className="w-full max-w-2xl px-4 relative">
          <input 
            type="text" 
            value={currentTopic}
            onChange={(e) => setCurrentTopic(e.target.value)}
            placeholder="Ví dụ: Lập trình Frontend, Machine Learning..."
            className="w-full pl-6 pr-16 py-4 rounded-xl border border-gray-300 shadow-sm text-lg focus:outline-none focus:border-gray-400 focus:shadow-md transition-shadow"
            onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
          />
          <button 
            onClick={() => handleGenerate()}
            disabled={loading || !currentTopic.trim()}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            {loading ? <span className="animate-spin text-lg block leading-none">↻</span> : <span className="text-xl block leading-none">↑</span>}
          </button>
        </div>

        <div className="flex gap-3 mt-8 flex-wrap justify-center max-w-2xl px-4 text-sm text-gray-600">
          <button onClick={() => handleGenerate("Javascript Advanced")} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">Javascript Advanced</button>
          <button onClick={() => handleGenerate("Lịch sử Việt Nam")} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">Lịch sử Việt Nam</button>
          <button onClick={() => handleGenerate("Data Science")} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">Data Science</button>
          <button onClick={() => handleGenerate("Digital Marketing")} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">Digital Marketing</button>
        </div>
        <SettingsModal />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white font-sans">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white shrink-0 z-10 relative">
        <div className="flex items-center gap-4 flex-1">
          <div className="font-semibold text-lg tracking-tight text-gray-800 mr-4 cursor-pointer" onClick={() => setHasGenerated(false)}>AI Roadmap</div>
          <div className="relative w-full max-w-xl">
            <input 
              type="text" 
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              placeholder="Nhập chủ đề mới..."
              className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-colors shadow-sm"
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
            />
            <button 
              onClick={() => handleGenerate()}
              disabled={loading || !currentTopic.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-500 hover:text-black hover:bg-gray-200 rounded flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              {loading ? <span className="animate-spin text-sm block leading-none">↻</span> : <span className="block leading-none text-lg">↑</span>}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadImage}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <span>📸 Tải Sơ Đồ</span>
          </button>
          <button 
            onClick={() => { setTempApiKey(apiKey); setIsSettingsOpen(true); }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            title="Cài đặt API Key (BYOK)"
          >
            <span className="text-lg leading-none">⚙️</span>
          </button>
        </div>
      </header>

      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          className="bg-[#f9f9f9]"
        >
          <Background color="#e5e7eb" gap={24} size={1} />
          <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden fill-gray-600" />
        </ReactFlow>
        
        <SidePanel 
          isOpen={panelOpen} 
          onClose={() => setPanelOpen(false)} 
          title={panelTitle} 
          content={panelContent} 
          isLoading={panelLoading} 
        />
        <SettingsModal />
      </div>
    </div>
  );
}
