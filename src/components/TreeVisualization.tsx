import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown, Eye, EyeOff, Zap, Clock, Database } from 'lucide-react';
import apiService from '../services/api';

interface TreeNode {
  id: string;
  name: string;
  type: string;
  children: TreeNode[];
  props?: any;
  state?: any;
  renderTime?: number;
  depth: number;
  expanded?: boolean;
  visible?: boolean;
}

interface TreeVisualizationProps {
  sessionId?: string;
  onNodeSelect?: (node: TreeNode) => void;
  onNodeHover?: (node: TreeNode | null) => void;
}

export const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  sessionId,
  onNodeSelect,
  onNodeHover
}) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);
  const [filterText, setFilterText] = useState('');
  const [showPerformance, setShowPerformance] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadTreeData();

    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(loadTreeData, 2000);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [sessionId, autoRefresh]);

  const loadTreeData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTreeData(sessionId || 'default');
      const tree = buildTreeStructure(data);
      setTreeData(tree);
    } catch (error) {
      console.error('Error loading tree data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTreeStructure = (data: any[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // Create all nodes
    data.forEach(item => {
      const node: TreeNode = {
        id: item.id,
        name: item.component_name,
        type: item.component_type || 'Component',
        children: [],
        props: item.props,
        state: item.state,
        renderTime: item.render_time,
        depth: item.depth,
        expanded: false,
        visible: true
      };
      nodeMap.set(item.id, node);
    });

    // Build hierarchy
    data.forEach(item => {
      const node = nodeMap.get(item.id);
      if (node) {
        if (item.parent_id) {
          const parent = nodeMap.get(item.parent_id);
          if (parent) {
            parent.children.push(node);
          }
        } else {
          rootNodes.push(node);
        }
      }
    });

    return rootNodes;
  };

  const toggleNode = (node: TreeNode) => {
    const updateNodeExpansion = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(n => {
        if (n.id === node.id) {
          return { ...n, expanded: !n.expanded };
        }
        if (n.children.length > 0) {
          return { ...n, children: updateNodeExpansion(n.children) };
        }
        return n;
      });
    };

    setTreeData(updateNodeExpansion(treeData));
  };

  const handleNodeClick = (node: TreeNode | undefined) => {
    if (!node) return;
    setSelectedNode(node);
    onNodeSelect?.(node);
  };

  const handleNodeHover = (node: TreeNode | null | undefined) => {
    if (node === undefined) return;
    setHoveredNode(node);
    onNodeHover?.(node);
  };

  const filterNodes = (nodes: TreeNode[], filter: string): TreeNode[] => {
    return nodes
      .map(node => ({ ...node }))
      .filter(node => {
        const matchesFilter = !filter ||
          node.name.toLowerCase().includes(filter.toLowerCase()) ||
          node.type.toLowerCase().includes(filter.toLowerCase());

        if (matchesFilter) {
          node.visible = true;
          return true;
        }

        node.children = filterNodes(node.children, filter);
        node.visible = node.children.length > 0;
        return node.visible;
      });
  };

  const renderNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    if (!node.visible) return null;

    const hasChildren = node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const isHovered = hoveredNode?.id === node.id;
    const indent = level * 20;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 rounded ${
            isSelected ? 'bg-blue-100 border-l-4 border-blue-500' : ''
          } ${isHovered ? 'bg-gray-50' : ''}`}
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() => handleNodeClick(node)}
          onMouseEnter={() => handleNodeHover(node)}
          onMouseLeave={() => handleNodeHover(null)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node);
              }}
              className="mr-1 p-1 hover:bg-gray-200 rounded"
            >
              {node.expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          <div className="flex items-center flex-1">
            <span className="font-medium text-sm">{node.name}</span>
            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {node.type}
            </span>

            {showPerformance && node.renderTime && (
              <div className="ml-2 flex items-center text-xs">
                <Clock className="w-3 h-3 mr-1" />
                <span className={node.renderTime > 16 ? 'text-red-500' : 'text-green-500'}>
                  {node.renderTime.toFixed(2)}ms
                </span>
              </div>
            )}
          </div>
        </div>

        {node.expanded && hasChildren && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredTree = filterNodes(treeData, filterText);

  return (
    <div className="bg-white rounded-lg shadow-lg border">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Component Tree
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPerformance(!showPerformance)}
              className={`p-2 rounded ${showPerformance ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              title="Toggle performance metrics"
            >
              <Zap className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded ${autoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}
              title="Toggle auto-refresh"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={loadTreeData}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Refresh tree data"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Filter */}
        <input
          type="text"
          placeholder="Filter components..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tree Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading component tree...</p>
          </div>
        ) : filteredTree.length === 0 ? (
          <div className="p-8 text-center">
            <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No component data available</p>
            <p className="text-sm text-gray-400 mt-2">
              Make sure your app is running with tree data collection enabled
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredTree.map(node => renderNode(node))}
          </div>
        )}
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="border-t p-4 bg-gray-50">
          <h4 className="font-semibold mb-2">{selectedNode.name} Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Type:</strong> {selectedNode.type}
            </div>
            <div>
              <strong>Depth:</strong> {selectedNode.depth}
            </div>
            {selectedNode.renderTime && (
              <div>
                <strong>Render Time:</strong> {selectedNode.renderTime.toFixed(2)}ms
              </div>
            )}
            <div>
              <strong>Children:</strong> {selectedNode.children.length}
            </div>
          </div>

          {selectedNode.props && Object.keys(selectedNode.props).length > 0 && (
            <div className="mt-4">
              <strong>Props:</strong>
              <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                {JSON.stringify(selectedNode.props, null, 2)}
              </pre>
            </div>
          )}

          {selectedNode.state && Object.keys(selectedNode.state).length > 0 && (
            <div className="mt-4">
              <strong>State:</strong>
              <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                {JSON.stringify(selectedNode.state, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
