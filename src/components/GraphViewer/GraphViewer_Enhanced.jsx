import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Network, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Settings, 
  Search, Filter, Eye, EyeOff, Play, Pause, SkipForward, SkipBack,
  GitBranch, Users, Clock, Target, Layers, Globe, Share2, Download,
  MousePointer, Move, RotateCw, Compass, Map, Database, Activity,
  TrendingUp, BarChart3, PieChart, ArrowRight, ArrowLeft, Shuffle,
  Focus, Expand, Shrink, Grid, List, Hash, Tag, Star, Bookmark,
  RefreshCw, Zap, Lightbulb, Link, Unlink, Plus, Minus, X, Info
} from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const GraphViewerEnhanced = ({ onClose }) => {
  const { blocks, getReferences, graphData } = useDocStore();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // 基础状态
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedPath, setSelectedPath] = useState([]);
  
  // 视图控制
  const [viewMode, setViewMode] = useState('force'); // force, hierarchy, circular, timeline, cluster
  const [layoutMode, setLayoutMode] = useState('spring'); // spring, grid, radial, tree
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 800, height: 600 });
  
  // 交互状态
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState(null);
  const [tool, setTool] = useState('select'); // select, pan, zoom, measure
  
  // 筛选和搜索
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [edgeFilter, setEdgeFilter] = useState('all');
  const [showLabels, setShowLabels] = useState(true);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [hideIsolated, setHideIsolated] = useState(false);
  
  // 分析功能
  const [highlightPath, setHighlightPath] = useState([]);
  const [showClusters, setShowClusters] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);
  
  // 动画和时间线
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  
  // 增强的图谱数据
  const [enhancedGraphData, setEnhancedGraphData] = useState({
    nodes: [],
    edges: [],
    clusters: [],
    metrics: {}
  });

  // 生成增强的假数据
  const generateEnhancedGraphData = useCallback(() => {
    // 创建更丰富的节点数据
    const nodes = [
      {
        id: 'project_overview',
        type: 'document',
        label: '项目概述',
        category: 'core',
        x: 400,
        y: 100,
        size: 45,
        color: '#3b82f6',
        importance: 0.9,
        centrality: 0.8,
        connections: 8,
        lastModified: Date.now() - 86400000,
        author: '张三',
        tags: ['核心', '文档', '概述'],
        content: {
          wordCount: 1200,
          imageCount: 3,
          references: 5
        },
        cluster: 'core_docs',
        position: { x: 400, y: 100 },
        velocity: { x: 0, y: 0 },
        fixed: false
      },
      {
        id: 'requirements_analysis',
        type: 'document',
        label: '需求分析',
        category: 'requirements',
        x: 200,
        y: 200,
        size: 40,
        color: '#10b981',
        importance: 0.85,
        centrality: 0.75,
        connections: 6,
        lastModified: Date.now() - 172800000,
        author: '李四',
        tags: ['需求', '分析', '核心'],
        content: {
          wordCount: 2800,
          imageCount: 8,
          references: 12
        },
        cluster: 'requirements',
        position: { x: 200, y: 200 },
        velocity: { x: 0, y: 0 },
        fixed: false
      },
      {
        id: 'technical_design',
        type: 'document',
        label: '技术设计',
        category: 'design',
        x: 600,
        y: 200,
        size: 42,
        color: '#8b5cf6',
        importance: 0.88,
        centrality: 0.78,
        connections: 9,
        lastModified: Date.now() - 259200000,
        author: '王五',
        tags: ['技术', '设计', '架构'],
        content: {
          wordCount: 3200,
          imageCount: 15,
          references: 18
        },
        cluster: 'technical',
        position: { x: 600, y: 200 },
        velocity: { x: 0, y: 0 },
        fixed: false
      },
      {
        id: 'user_interface',
        type: 'document',
        label: 'UI设计',
        category: 'design',
        x: 500,
        y: 350,
        size: 35,
        color: '#f59e0b',
        importance: 0.7,
        centrality: 0.6,
        connections: 4,
        lastModified: Date.now() - 345600000,
        author: '赵六',
        tags: ['UI', '设计', '用户体验'],
        content: {
          wordCount: 1800,
          imageCount: 25,
          references: 8
        },
        cluster: 'design',
        position: { x: 500, y: 350 },
        velocity: { x: 0, y: 0 },
        fixed: false
      },
      {
        id: 'api_documentation',
        type: 'reference',
        label: 'API文档',
        category: 'technical',
        x: 700,
        y: 350,
        size: 30,
        color: '#ef4444',
        importance: 0.6,
        centrality: 0.5,
        connections: 3,
        lastModified: Date.now() - 432000000,
        author: '孙七',
        tags: ['API', '文档', '接口'],
        content: {
          wordCount: 950,
          imageCount: 2,
          references: 4
        },
        cluster: 'technical',
        position: { x: 700, y: 350 },
        velocity: { x: 0, y: 0 },
        fixed: false
      },
      {
        id: 'database_schema',
        type: 'table',
        label: '数据库设计',
        category: 'data',
        x: 300,
        y: 400,
        size: 38,
        color: '#06b6d4',
        importance: 0.8,
        centrality: 0.7,
        connections: 7,
        lastModified: Date.now() - 518400000,
        author: '周八',
        tags: ['数据库', '表结构', '数据'],
        content: {
          wordCount: 650,
          imageCount: 12,
          references: 6
        },
        cluster: 'data',
        position: { x: 300, y: 400 },
        velocity: { x: 0, y: 0 },
        fixed: false
      },
      {
        id: 'user_stories',
        type: 'field',
        label: '用户故事',
        category: 'requirements',
        x: 100,
        y: 300,
        size: 32,
        color: '#84cc16',
        importance: 0.65,
        centrality: 0.55,
        connections: 5,
        lastModified: Date.now() - 604800000,
        author: '李四',
        tags: ['用户故事', '需求', '场景'],
        content: {
          wordCount: 1400,
          imageCount: 1,
          references: 9
        },
        cluster: 'requirements',
        position: { x: 100, y: 300 },
        velocity: { x: 0, y: 0 },
        fixed: false
      },
      {
        id: 'test_cases',
        type: 'document',
        label: '测试用例',
        category: 'testing',
        x: 750,
        y: 150,
        size: 28,
        color: '#f97316',
        importance: 0.5,
        centrality: 0.4,
        connections: 3,
        lastModified: Date.now() - 691200000,
        author: '钱九',
        tags: ['测试', '用例', '质量'],
        content: {
          wordCount: 2200,
          imageCount: 5,
          references: 7
        },
        cluster: 'testing',
        position: { x: 750, y: 150 },
        velocity: { x: 0, y: 0 },
        fixed: false
      },
      {
        id: 'performance_metrics',
        type: 'field',
        label: '性能指标',
        category: 'monitoring',
        x: 550,
        y: 480,
        size: 25,
        color: '#ec4899',
        importance: 0.45,
        centrality: 0.35,
        connections: 2,
        lastModified: Date.now() - 777600000,
        author: '吴十',
        tags: ['性能', '监控', '指标'],
        content: {
          wordCount: 800,
          imageCount: 8,
          references: 3
        },
        cluster: 'monitoring',
        position: { x: 550, y: 480 },
        velocity: { x: 0, y: 0 },
        fixed: false
      },
      {
        id: 'deployment_guide',
        type: 'document',
        label: '部署指南',
        category: 'deployment',
        x: 150,
        y: 500,
        size: 33,
        color: '#64748b',
        importance: 0.6,
        centrality: 0.45,
        connections: 4,
        lastModified: Date.now() - 864000000,
        author: '郑十一',
        tags: ['部署', '运维', '指南'],
        content: {
          wordCount: 1600,
          imageCount: 10,
          references: 5
        },
        cluster: 'deployment',
        position: { x: 150, y: 500 },
        velocity: { x: 0, y: 0 },
        fixed: false
      }
    ];

    // 创建边关系
    const edges = [
      {
        id: 'edge_1',
        from: 'project_overview',
        to: 'requirements_analysis',
        type: 'derives',
        weight: 0.9,
        color: '#3b82f6',
        label: '衍生关系',
        strength: 0.8,
        bidirectional: false,
        animated: true
      },
      {
        id: 'edge_2',
        from: 'project_overview',
        to: 'technical_design',
        type: 'influences',
        weight: 0.85,
        color: '#10b981',
        label: '影响关系',
        strength: 0.7,
        bidirectional: false,
        animated: true
      },
      {
        id: 'edge_3',
        from: 'requirements_analysis',
        to: 'user_stories',
        type: 'defines',
        weight: 0.95,
        color: '#8b5cf6',
        label: '定义关系',
        strength: 0.9,
        bidirectional: false,
        animated: false
      },
      {
        id: 'edge_4',
        from: 'requirements_analysis',
        to: 'technical_design',
        type: 'informs',
        weight: 0.8,
        color: '#f59e0b',
        label: '信息传递',
        strength: 0.75,
        bidirectional: true,
        animated: false
      },
      {
        id: 'edge_5',
        from: 'technical_design',
        to: 'database_schema',
        type: 'implements',
        weight: 0.9,
        color: '#ef4444',
        label: '实现关系',
        strength: 0.85,
        bidirectional: false,
        animated: true
      },
      {
        id: 'edge_6',
        from: 'technical_design',
        to: 'api_documentation',
        type: 'documents',
        weight: 0.7,
        color: '#06b6d4',
        label: '文档化',
        strength: 0.6,
        bidirectional: false,
        animated: false
      },
      {
        id: 'edge_7',
        from: 'technical_design',
        to: 'user_interface',
        type: 'guides',
        weight: 0.75,
        color: '#84cc16',
        label: '指导关系',
        strength: 0.65,
        bidirectional: false,
        animated: false
      },
      {
        id: 'edge_8',
        from: 'user_interface',
        to: 'user_stories',
        type: 'validates',
        weight: 0.6,
        color: '#f97316',
        label: '验证关系',
        strength: 0.5,
        bidirectional: true,
        animated: false
      },
      {
        id: 'edge_9',
        from: 'technical_design',
        to: 'test_cases',
        type: 'tests',
        weight: 0.65,
        color: '#ec4899',
        label: '测试关系',
        strength: 0.55,
        bidirectional: false,
        animated: false
      },
      {
        id: 'edge_10',
        from: 'database_schema',
        to: 'performance_metrics',
        type: 'monitors',
        weight: 0.5,
        color: '#64748b',
        label: '监控关系',
        strength: 0.45,
        bidirectional: false,
        animated: false
      },
      {
        id: 'edge_11',
        from: 'api_documentation',
        to: 'deployment_guide',
        type: 'supports',
        weight: 0.55,
        color: '#374151',
        label: '支持关系',
        strength: 0.5,
        bidirectional: false,
        animated: false
      },
      {
        id: 'edge_12',
        from: 'user_stories',
        to: 'test_cases',
        type: 'verifies',
        weight: 0.7,
        color: '#1f2937',
        label: '验证关系',
        strength: 0.6,
        bidirectional: false,
        animated: true
      }
    ];

    // 创建集群信息
    const clusters = [
      {
        id: 'core_docs',
        name: '核心文档',
        color: '#3b82f6',
        nodes: ['project_overview'],
        center: { x: 400, y: 100 },
        size: 1
      },
      {
        id: 'requirements',
        name: '需求分析',
        color: '#10b981',
        nodes: ['requirements_analysis', 'user_stories'],
        center: { x: 150, y: 250 },
        size: 2
      },
      {
        id: 'technical',
        name: '技术文档',
        color: '#8b5cf6',
        nodes: ['technical_design', 'api_documentation'],
        center: { x: 650, y: 275 },
        size: 2
      },
      {
        id: 'design',
        name: '设计文档',
        color: '#f59e0b',
        nodes: ['user_interface'],
        center: { x: 500, y: 350 },
        size: 1
      },
      {
        id: 'data',
        name: '数据相关',
        color: '#06b6d4',
        nodes: ['database_schema'],
        center: { x: 300, y: 400 },
        size: 1
      },
      {
        id: 'testing',
        name: '测试文档',
        color: '#f97316',
        nodes: ['test_cases'],
        center: { x: 750, y: 150 },
        size: 1
      },
      {
        id: 'monitoring',
        name: '监控指标',
        color: '#ec4899',
        nodes: ['performance_metrics'],
        center: { x: 550, y: 480 },
        size: 1
      },
      {
        id: 'deployment',
        name: '部署文档',
        color: '#64748b',
        nodes: ['deployment_guide'],
        center: { x: 150, y: 500 },
        size: 1
      }
    ];

    // 计算图谱指标
    const metrics = {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      totalClusters: clusters.length,
      density: (edges.length * 2) / (nodes.length * (nodes.length - 1)),
      avgDegree: (edges.length * 2) / nodes.length,
      centralityScore: nodes.reduce((sum, node) => sum + node.centrality, 0) / nodes.length,
      connectivityIndex: 0.85,
      modularityScore: 0.72,
      clusteringCoefficient: 0.68,
      pathLength: 2.4,
      networkDiameter: 4,
      strongComponents: 3,
      weakComponents: 1
    };

    return { nodes, edges, clusters, metrics };
  }, [blocks]);

  useEffect(() => {
    setEnhancedGraphData(generateEnhancedGraphData());
  }, [generateEnhancedGraphData]);

  // 筛选数据
  const filteredData = React.useMemo(() => {
    let nodes = enhancedGraphData.nodes;
    let edges = enhancedGraphData.edges;

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      nodes = nodes.filter(node => 
        node.label.toLowerCase().includes(query) ||
        node.tags.some(tag => tag.toLowerCase().includes(query)) ||
        node.author.toLowerCase().includes(query)
      );
      const nodeIds = new Set(nodes.map(n => n.id));
      edges = edges.filter(edge => nodeIds.has(edge.from) && nodeIds.has(edge.to));
    }

    // 类型筛选
    if (filterType !== 'all') {
      nodes = nodes.filter(node => node.type === filterType);
      const nodeIds = new Set(nodes.map(n => n.id));
      edges = edges.filter(edge => nodeIds.has(edge.from) && nodeIds.has(edge.to));
    }

    // 边类型筛选
    if (edgeFilter !== 'all') {
      edges = edges.filter(edge => edge.type === edgeFilter);
    }

    // 隐藏孤立节点
    if (hideIsolated) {
      const connectedNodeIds = new Set();
      edges.forEach(edge => {
        connectedNodeIds.add(edge.from);
        connectedNodeIds.add(edge.to);
      });
      nodes = nodes.filter(node => connectedNodeIds.has(node.id));
    }

    return { nodes, edges };
  }, [enhancedGraphData, searchQuery, filterType, edgeFilter, hideIsolated]);

  // 查找两节点间的路径
  const findPath = (startId, endId) => {
    const visited = new Set();
    const queue = [[startId]];
    
    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];
      
      if (current === endId) {
        return path;
      }
      
      if (visited.has(current)) continue;
      visited.add(current);
      
      const neighbors = filteredData.edges
        .filter(edge => edge.from === current || edge.to === current)
        .map(edge => edge.from === current ? edge.to : edge.from);
      
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          queue.push([...path, neighbor]);
        }
      });
    }
    
    return [];
  };

  // 计算节点的度中心性
  const getNodeDegree = (nodeId) => {
    return filteredData.edges.filter(edge => 
      edge.from === nodeId || edge.to === nodeId
    ).length;
  };

  // 获取邻居节点
  const getNeighbors = (nodeId) => {
    const neighbors = new Set();
    filteredData.edges.forEach(edge => {
      if (edge.from === nodeId) neighbors.add(edge.to);
      if (edge.to === nodeId) neighbors.add(edge.from);
    });
    return Array.from(neighbors);
  };

  // 节点点击处理
  const handleNodeClick = (node) => {
    if (selectedNode && selectedNode.id === node.id) {
      // 双击展开邻居
      const neighbors = getNeighbors(node.id);
      setSelectedNodes(new Set([node.id, ...neighbors]));
      setHighlightPath([]);
    } else {
      setSelectedNode(node);
      setSelectedNodes(new Set([node.id]));
      
      // 如果之前有选中的节点，计算路径
      if (selectedNode && selectedNode.id !== node.id) {
        const path = findPath(selectedNode.id, node.id);
        setHighlightPath(path);
      }
    }
  };

  // 布局算法
  const applyLayout = (layoutType) => {
    const nodes = [...filteredData.nodes];
    const centerX = 400;
    const centerY = 300;
    
    switch (layoutType) {
      case 'circular':
        nodes.forEach((node, i) => {
          const angle = (i / nodes.length) * 2 * Math.PI;
          const radius = 200;
          node.x = centerX + radius * Math.cos(angle);
          node.y = centerY + radius * Math.sin(angle);
        });
        break;
        
      case 'grid':
        const cols = Math.ceil(Math.sqrt(nodes.length));
        nodes.forEach((node, i) => {
          node.x = (i % cols) * 100 + 50;
          node.y = Math.floor(i / cols) * 100 + 50;
        });
        break;
        
      case 'hierarchy':
        // 按重要性分层
        const levels = {};
        nodes.forEach(node => {
          const level = Math.floor(node.importance * 5);
          if (!levels[level]) levels[level] = [];
          levels[level].push(node);
        });
        
        Object.keys(levels).forEach((level, levelIndex) => {
          levels[level].forEach((node, nodeIndex) => {
            node.x = (nodeIndex - levels[level].length / 2) * 120 + centerX;
            node.y = levelIndex * 120 + 50;
          });
        });
        break;
        
      case 'cluster':
        enhancedGraphData.clusters.forEach(cluster => {
          const clusterNodes = nodes.filter(node => cluster.nodes.includes(node.id));
          clusterNodes.forEach((node, i) => {
            const angle = (i / clusterNodes.length) * 2 * Math.PI;
            const radius = 60;
            node.x = cluster.center.x + radius * Math.cos(angle);
            node.y = cluster.center.y + radius * Math.sin(angle);
          });
        });
        break;
    }
    
    setEnhancedGraphData(prev => ({ ...prev, nodes }));
  };

  // 渲染节点
  const renderNode = (node) => {
    const isSelected = selectedNodes.has(node.id);
    const isHovered = hoveredNode?.id === node.id;
    const isHighlighted = highlightPath.includes(node.id);
    
    const nodeSize = node.size * (isSelected ? 1.3 : isHovered ? 1.2 : 1);
    const strokeWidth = isSelected ? 3 : isHighlighted ? 2 : 1;
    const opacity = (selectedNodes.size > 0 && !isSelected && !isHighlighted) ? 0.3 : 1;

    return (
      <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
        {/* 节点圆圈 */}
        <circle
          r={nodeSize}
          fill={node.color}
          stroke={isSelected ? '#ffffff' : isHighlighted ? '#fbbf24' : '#ffffff'}
          strokeWidth={strokeWidth}
          opacity={opacity}
          style={{
            cursor: 'pointer',
            filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'
          }}
          onClick={() => handleNodeClick(node)}
          onMouseEnter={() => setHoveredNode(node)}
          onMouseLeave={() => setHoveredNode(null)}
        />
        
        {/* 重要性指示器 */}
        {node.importance > 0.8 && (
          <circle
            r={5}
            fill="#fbbf24"
            cx={nodeSize - 10}
            cy={-nodeSize + 10}
          />
        )}
        
        {/* 节点标签 */}
        {(showLabels || isSelected || isHovered) && (
          <text
            y={nodeSize + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
            fontWeight={isSelected ? 'bold' : 'normal'}
            opacity={opacity}
          >
            {node.label}
          </text>
        )}
        
        {/* 连接数指示 */}
        {isSelected && (
          <text
            y={-nodeSize - 10}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {node.connections} 连接
          </text>
        )}
      </g>
    );
  };

  // 渲染边
  const renderEdge = (edge) => {
    const fromNode = filteredData.nodes.find(n => n.id === edge.from);
    const toNode = filteredData.nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;
    
    const isHighlighted = highlightPath.includes(edge.from) && highlightPath.includes(edge.to);
    const isSelected = selectedEdge?.id === edge.id;
    const opacity = (selectedNodes.size > 0 && !selectedNodes.has(edge.from) && !selectedNodes.has(edge.to)) ? 0.2 : 0.8;
    
    const strokeWidth = isSelected ? 3 : isHighlighted ? 2 : edge.weight * 2;
    const strokeColor = isHighlighted ? '#fbbf24' : edge.color;

    // 计算箭头位置
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;
    
    const arrowLength = 10;
    const arrowX = toNode.x - unitX * (toNode.size + arrowLength);
    const arrowY = toNode.y - unitY * (toNode.size + arrowLength);

    return (
      <g key={edge.id}>
        {/* 边线 */}
        <line
          x1={fromNode.x + unitX * fromNode.size}
          y1={fromNode.y + unitY * fromNode.size}
          x2={arrowX}
          y2={arrowY}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={opacity}
          style={{
            cursor: 'pointer',
            strokeDasharray: edge.animated ? '5,5' : 'none',
            animation: edge.animated ? 'dash 1s linear infinite' : 'none'
          }}
          onClick={() => setSelectedEdge(edge)}
        />
        
        {/* 箭头 */}
        {!edge.bidirectional && (
          <polygon
            points={`${arrowX},${arrowY} ${arrowX - arrowLength * unitX + 5 * unitY},${arrowY - arrowLength * unitY - 5 * unitX} ${arrowX - arrowLength * unitX - 5 * unitY},${arrowY - arrowLength * unitY + 5 * unitX}`}
            fill={strokeColor}
            opacity={opacity}
          />
        )}
        
        {/* 边标签 */}
        {(showEdgeLabels || isSelected) && (
          <text
            x={(fromNode.x + toNode.x) / 2}
            y={(fromNode.y + toNode.y) / 2}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
            opacity={opacity}
          >
            {edge.label}
          </text>
        )}
      </g>
    );
  };

  // 渲染集群
  const renderClusters = () => {
    if (!showClusters) return null;
    
    return enhancedGraphData.clusters.map(cluster => {
      const clusterNodes = filteredData.nodes.filter(node => cluster.nodes.includes(node.id));
      if (clusterNodes.length === 0) return null;
      
      // 计算包围盒
      const minX = Math.min(...clusterNodes.map(n => n.x)) - 40;
      const maxX = Math.max(...clusterNodes.map(n => n.x)) + 40;
      const minY = Math.min(...clusterNodes.map(n => n.y)) - 40;
      const maxY = Math.max(...clusterNodes.map(n => n.y)) + 40;
      
      return (
        <g key={cluster.id}>
          <rect
            x={minX}
            y={minY}
            width={maxX - minX}
            height={maxY - minY}
            fill={cluster.color}
            opacity={0.1}
            stroke={cluster.color}
            strokeWidth={2}
            strokeDasharray="5,5"
            rx={10}
          />
          <text
            x={minX + 10}
            y={minY + 20}
            fontSize="12"
            fill={cluster.color}
            fontWeight="bold"
          >
            {cluster.name}
          </text>
        </g>
      );
    });
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#ffffff' 
    }}>
      {/* 顶部工具栏 */}
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#111827', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Network size={24} />
              关系图谱
            </h2>
            
            {/* 视图模式切换 */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'force', icon: Globe, label: '力导向' },
                { id: 'hierarchy', icon: GitBranch, label: '层次' },
                { id: 'circular', icon: Target, label: '环形' },
                { id: 'cluster', icon: Users, label: '集群' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setViewMode(mode.id);
                    applyLayout(mode.id);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: viewMode === mode.id ? '#3b82f6' : '#f3f4f6',
                    color: viewMode === mode.id ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <mode.icon size={14} />
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              color: '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '8px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 控制面板 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* 搜索框 */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
            <Search 
              size={14} 
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}
            />
            <input
              type="text"
              placeholder="搜索节点..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '32px',
                paddingRight: '8px',
                paddingTop: '6px',
                paddingBottom: '6px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* 筛选器 */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '6px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '12px',
              backgroundColor: 'white'
            }}
          >
            <option value="all">所有类型</option>
            <option value="document">文档</option>
            <option value="table">表格</option>
            <option value="field">字段</option>
            <option value="reference">引用</option>
          </select>

          <select
            value={edgeFilter}
            onChange={(e) => setEdgeFilter(e.target.value)}
            style={{
              padding: '6px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '12px',
              backgroundColor: 'white'
            }}
          >
            <option value="all">所有关系</option>
            <option value="derives">衍生</option>
            <option value="influences">影响</option>
            <option value="implements">实现</option>
            <option value="documents">文档化</option>
          </select>

          {/* 显示选项 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowLabels(!showLabels)}
              style={{
                padding: '6px 8px',
                backgroundColor: showLabels ? '#3b82f6' : '#f3f4f6',
                color: showLabels ? 'white' : '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              标签
            </button>
            
            <button
              onClick={() => setShowClusters(!showClusters)}
              style={{
                padding: '6px 8px',
                backgroundColor: showClusters ? '#3b82f6' : '#f3f4f6',
                color: showClusters ? 'white' : '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              集群
            </button>
            
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              style={{
                padding: '6px 8px',
                backgroundColor: showMetrics ? '#3b82f6' : '#f3f4f6',
                color: showMetrics ? 'white' : '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              指标
            </button>
          </div>

          {/* 缩放控制 */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 3))}
              style={{
                padding: '6px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.1))}
              style={{
                padding: '6px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              style={{
                padding: '6px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 主图谱区域 */}
        <div style={{ flex: 1, position: 'relative', backgroundColor: '#fafbfc' }}>
          <svg
            ref={canvasRef}
            width="100%"
            height="100%"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            style={{ cursor: tool === 'pan' ? 'grab' : 'default' }}
          >
            {/* 定义样式 */}
            <defs>
              <style>
                {`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -10;
                    }
                  }
                `}
              </style>
            </defs>
            
            {/* 网格背景 */}
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* 渲染集群 */}
            {renderClusters()}
            
            {/* 渲染边 */}
            {filteredData.edges.map(edge => renderEdge(edge))}
            
            {/* 渲染节点 */}
            {filteredData.nodes.map(node => renderNode(node))}
            
            {/* 选择框 */}
            {selectionRect && (
              <rect
                x={selectionRect.x}
                y={selectionRect.y}
                width={selectionRect.width}
                height={selectionRect.height}
                fill="rgba(59, 130, 246, 0.1)"
                stroke="#3b82f6"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            )}
          </svg>

          {/* 浮动信息面板 */}
          {hoveredNode && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              minWidth: '200px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                {hoveredNode.label}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                类型: {hoveredNode.type}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                作者: {hoveredNode.author}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                连接数: {hoveredNode.connections}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                重要性: {Math.round(hoveredNode.importance * 100)}%
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {hoveredNode.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      borderRadius: '10px'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧面板 */}
        <div style={{ 
          width: '320px', 
          borderLeft: '1px solid #e5e7eb', 
          backgroundColor: '#fafbfc',
          padding: '20px',
          overflowY: 'auto'
        }}>
          {/* 图谱统计 */}
          {showMetrics && (
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <BarChart3 size={16} />
                图谱指标
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>节点数</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    {enhancedGraphData.metrics.totalNodes}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>边数</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    {enhancedGraphData.metrics.totalEdges}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>密度</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    {(enhancedGraphData.metrics.density * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>平均度</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    {enhancedGraphData.metrics.avgDegree.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 选中节点详情 */}
          {selectedNode && (
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '12px'
              }}>
                节点详情
              </h3>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  {selectedNode.label}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {selectedNode.type} • {selectedNode.author}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>连接数</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedNode.connections}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>重要性</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{Math.round(selectedNode.importance * 100)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>字数</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedNode.content.wordCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>引用数</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedNode.content.references}</div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>标签</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedNode.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        borderRadius: '12px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    const neighbors = getNeighbors(selectedNode.id);
                    setSelectedNodes(new Set([selectedNode.id, ...neighbors]));
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  显示邻居
                </button>
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    setSelectedNodes(new Set());
                    setHighlightPath([]);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  清除
                </button>
              </div>
            </div>
          )}

          {/* 路径分析 */}
          {highlightPath.length > 0 && (
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ArrowRight size={16} />
                路径分析
              </h3>
              
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                路径长度: {highlightPath.length - 1} 步
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {highlightPath.map((nodeId, index) => {
                  const node = filteredData.nodes.find(n => n.id === nodeId);
                  return (
                    <div key={nodeId} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: node?.color || '#6b7280'
                      }}></div>
                      <span style={{ fontSize: '12px', color: '#374151' }}>
                        {node?.label || nodeId}
                      </span>
                      {index < highlightPath.length - 1 && (
                        <ArrowRight size={12} style={{ color: '#9ca3af' }} />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <button
                onClick={() => setHighlightPath([])}
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                清除路径
              </button>
            </div>
          )}

          {/* 图例 */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '12px'
            }}>
              图例
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                节点类型
              </div>
              {[
                { type: 'document', color: '#3b82f6', label: '文档' },
                { type: 'table', color: '#8b5cf6', label: '表格' },
                { type: 'field', color: '#10b981', label: '字段' },
                { type: 'reference', color: '#f59e0b', label: '引用' }
              ].map(item => (
                <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: item.color
                  }}></div>
                  <span style={{ fontSize: '11px', color: '#374151' }}>{item.label}</span>
                </div>
              ))}
            </div>
            
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                关系类型
              </div>
              {[
                { type: 'derives', color: '#3b82f6', label: '衍生' },
                { type: 'influences', color: '#10b981', label: '影响' },
                { type: 'implements', color: '#ef4444', label: '实现' },
                { type: 'documents', color: '#06b6d4', label: '文档化' }
              ].map(item => (
                <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{
                    width: '20px',
                    height: '2px',
                    backgroundColor: item.color
                  }}></div>
                  <span style={{ fontSize: '11px', color: '#374151' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphViewerEnhanced;
