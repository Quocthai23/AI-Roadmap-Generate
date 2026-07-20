import { Node, Edge } from 'reactflow';

export function parseHierarchyToFlow(rootData: any) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const rootId = crypto.randomUUID();

  // Node gốc
  nodes.push({
    id: rootId,
    data: { label: rootData.label, hasMore: false },
    position: { x: 0, y: 0 },
    type: 'customNode',
  });

  // Các node cấp 1
  if (rootData.children) {
    rootData.children.forEach((child: any) => {
      const childId = crypto.randomUUID();
      nodes.push({
        id: childId,
        data: { label: child.label, hasMore: child.hasMore },
        position: { x: 0, y: 0 },
        type: 'customNode',
      });

      edges.push({
        id: `e-${rootId}-${childId}`,
        source: rootId,
        target: childId,
        animated: true,
      });
    });
  }

  return { nodes, edges };
}
