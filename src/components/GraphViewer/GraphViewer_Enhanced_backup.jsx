import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Network, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Settings, 
  Search, Filter, Eye, EyeOff, Play, Pause, SkipForward, SkipBack,
  GitBranch, Users, Clock, Target, Layers, Globe, Share2, Download,
  MousePointer, Move, RotateCw, Compass, Map, Database, Activity,
  TrendingUp, BarChart3, PieChart, ArrowRight, ArrowLeft, Shuffle,
  Focus, Expand, Shrink, Grid, List, Hash, Tag, Star, Bookmark,
  RefreshCw, Zap, Lightbulb, Link, Unlink, Plus, Minus, X, Info,
  Crosshair
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
  const [showParagraphs, setShowParagraphs] = useState(true);
  const [showDocuments, setShowDocuments] = useState(true);
  const [showInternalLinks, setShowInternalLinks] = useState(true);
  const [showCrossReferences, setShowCrossReferences] = useState(true);
  const [hierarchyLevel, setHierarchyLevel] = useState('all'); // all, documents, paragraphs
  
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

  // 拖拽相关状态
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedNode: null,
    dragOffset: { x: 0, y: 0 },
    startPos: { x: 0, y: 0 }
  });

  // 画布交互状态
  const [canvasState, setCanvasState] = useState({
    isPanning: false,
    panStart: { x: 0, y: 0 },
    transform: { x: 0, y: 0, scale: 1 },
    bounds: { minX: -1000, maxX: 1000, minY: -1000, maxY: 1000 }
  });

  // 生成增强的假数据
  const generateEnhancedGraphData = useCallback(() => {
    // 基于真实文档数据创建节点
    const nodes = [
      // 文档节点 - 基于docStore中的真实文档
      {
        id: 'doc_1',
        type: 'document',
        label: '产品需求文档 - 文档管理系统',
        category: 'product',
        x: 400,
        y: 100,
        size: 45,
        color: '#3b82f6',
        importance: 0.9,
        centrality: 0.8,
        connections: 6,
        lastModified: Date.now() - 2 * 60 * 60 * 1000,
        author: '产品经理',
        tags: ['产品', 'PRD', '需求'],
        content: {
          wordCount: 1200,
          imageCount: 0,
          references: 0,
          paragraphs: 3,
          sections: ['产品概述', '核心功能', '文档编辑', '文档管理']
        },
        cluster: 'core_docs',
        position: { x: 400, y: 100 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc1_1', 'block_doc1_2', 'block_doc1_3'],
        relatedDocs: ['doc_2', 'doc_4'],
        similarity: {},
        metrics: {
          readability: 0.85,
          completeness: 0.92,
          relevance: 0.88
        }
      },
      {
        id: 'doc_2',
        type: 'document',
        label: '技术架构设计方案',
        category: 'technical',
        x: 650,
        y: 200,
        size: 42,
        color: '#8b5cf6',
        importance: 0.85,
        centrality: 0.75,
        connections: 4,
        lastModified: Date.now() - 6 * 60 * 60 * 1000,
        author: '技术负责人',
        tags: ['技术', '架构', '设计'],
        content: {
          wordCount: 1500,
          imageCount: 0,
          references: 0,
          paragraphs: 2,
          sections: ['整体架构', '技术栈', '前端技术栈', '后端技术栈']
        },
        cluster: 'technical',
        position: { x: 650, y: 200 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc2_1', 'block_doc2_2'],
        relatedDocs: ['doc_1', 'doc_7', 'doc_8'],
        similarity: {},
        metrics: {
          readability: 0.82,
          completeness: 0.89,
          relevance: 0.91
        }
      },
      {
        id: 'doc_3',
        type: 'document',
        label: '周例会纪要 - 第42周',
        category: 'meeting',
        x: 200,
        y: 300,
        size: 35,
        color: '#10b981',
        importance: 0.7,
        centrality: 0.6,
        connections: 2,
        lastModified: Date.now() - 1 * 24 * 60 * 60 * 1000,
        author: '项目经理',
        tags: ['会议', '例会', '纪要'],
        content: {
          wordCount: 800,
          imageCount: 0,
          references: 0,
          paragraphs: 2,
          sections: ['会议信息', '议程', '项目进度汇报', '技术难点讨论']
        },
        cluster: 'management',
        position: { x: 200, y: 300 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc3_1', 'block_doc3_2'],
        relatedDocs: ['doc_5'],
        similarity: {},
        metrics: {
          readability: 0.88,
          completeness: 0.85,
          relevance: 0.75
        }
      },
      {
        id: 'doc_4',
        type: 'document',
        label: '用户研究报告',
        category: 'research',
        x: 150,
        y: 150,
        size: 38,
        color: '#f59e0b',
        importance: 0.75,
        centrality: 0.65,
        connections: 3,
        lastModified: Date.now() - 8 * 24 * 60 * 60 * 1000,
        author: '用户研究员',
        tags: ['用户研究', '调研', '报告'],
        content: {
          wordCount: 1000,
          imageCount: 0,
          references: 0,
          paragraphs: 2,
          sections: ['研究背景', '研究方法', '关键发现', '用户需求']
        },
        cluster: 'research',
        position: { x: 150, y: 150 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc4_1', 'block_doc4_2'],
        relatedDocs: ['doc_1', 'doc_10'],
        similarity: {},
        metrics: {
          readability: 0.86,
          completeness: 0.88,
          relevance: 0.82
        }
      },
      {
        id: 'doc_5',
        type: 'document',
        label: '开发进度周报',
        category: 'report',
        x: 350,
        y: 350,
        size: 33,
        color: '#06b6d4',
        importance: 0.65,
        centrality: 0.55,
        connections: 2,
        lastModified: Date.now() - 30 * 60 * 1000,
        author: '开发团队',
        tags: ['开发', '周报', '进度'],
        content: {
          wordCount: 600,
          imageCount: 0,
          references: 0,
          paragraphs: 1,
          sections: ['本周完成工作', '遇到的问题', '下周计划']
        },
        cluster: 'management',
        position: { x: 350, y: 350 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc5_1'],
        relatedDocs: ['doc_3'],
        similarity: {},
        metrics: {
          readability: 0.89,
          completeness: 0.86,
          relevance: 0.78
        }
      },
      {
        id: 'doc_6',
        type: 'document',
        label: 'UI设计规范',
        category: 'design',
        x: 500,
        y: 250,
        size: 36,
        color: '#ec4899',
        importance: 0.72,
        centrality: 0.62,
        connections: 2,
        lastModified: Date.now() - 12 * 60 * 60 * 1000,
        author: 'UI设计师',
        tags: ['设计', 'UI', '规范'],
        content: {
          wordCount: 900,
          imageCount: 0,
          references: 1,
          paragraphs: 2,
          sections: ['设计原则', '色彩规范', '主色调', '中性色']
        },
        cluster: 'design',
        position: { x: 500, y: 250 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc6_1', 'block_doc6_2'],
        relatedDocs: ['doc_1'],
        similarity: {},
        metrics: {
          readability: 0.84,
          completeness: 0.90,
          relevance: 0.85
        }
      },
      {
        id: 'doc_7',
        type: 'document',
        label: 'API接口文档',
        category: 'technical',
        x: 750,
        y: 300,
        size: 39,
        color: '#8b5cf6',
        importance: 0.78,
        centrality: 0.68,
        connections: 3,
        lastModified: Date.now() - 4 * 60 * 60 * 1000,
        author: '后端工程师',
        tags: ['API', '接口', '后端'],
        content: {
          wordCount: 1300,
          imageCount: 0,
          references: 0,
          paragraphs: 2,
          sections: ['基础信息', '文档管理接口', 'HTTP状态码说明']
        },
        cluster: 'technical',
        position: { x: 750, y: 300 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc7_1', 'block_doc7_2'],
        relatedDocs: ['doc_2', 'doc_8'],
        similarity: {},
        metrics: {
          readability: 0.81,
          completeness: 0.87,
          relevance: 0.89
        }
      },
      {
        id: 'doc_8',
        type: 'document',
        label: '测试计划文档',
        category: 'testing',
        x: 600,
        y: 400,
        size: 37,
        color: '#22c55e',
        importance: 0.74,
        centrality: 0.64,
        connections: 3,
        lastModified: Date.now() - 8 * 60 * 60 * 1000,
        author: '测试工程师',
        tags: ['测试', '计划', '质量'],
        content: {
          wordCount: 1100,
          imageCount: 0,
          references: 0,
          paragraphs: 2,
          sections: ['测试目标', '测试范围', '测试环境']
        },
        cluster: 'testing',
        position: { x: 600, y: 400 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc8_1', 'block_doc8_2'],
        relatedDocs: ['doc_2', 'doc_7'],
        similarity: {},
        metrics: {
          readability: 0.83,
          completeness: 0.88,
          relevance: 0.86
        }
      },
      {
        id: 'doc_9',
        type: 'document',
        label: '项目启动会议',
        category: 'meeting',
        x: 300,
        y: 50,
        size: 40,
        color: '#f97316',
        importance: 0.8,
        centrality: 0.7,
        connections: 2,
        lastModified: Date.now() - 15 * 24 * 60 * 60 * 1000,
        author: '项目总监',
        tags: ['项目', '启动', '会议'],
        content: {
          wordCount: 1400,
          imageCount: 0,
          references: 0,
          paragraphs: 3,
          sections: ['会议信息', '项目背景', '项目目标', '项目范围']
        },
        cluster: 'management',
        position: { x: 300, y: 50 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc9_1', 'block_doc9_2', 'block_doc9_3'],
        relatedDocs: ['doc_1'],
        similarity: {},
        metrics: {
          readability: 0.87,
          completeness: 0.91,
          relevance: 0.84
        }
      },
      {
        id: 'doc_10',
        type: 'document',
        label: '竞品分析报告',
        category: 'research',
        x: 50,
        y: 250,
        size: 41,
        color: '#f59e0b',
        importance: 0.82,
        centrality: 0.72,
        connections: 3,
        lastModified: Date.now() - 9 * 24 * 60 * 60 * 1000,
        author: '产品分析师',
        tags: ['竞品', '分析', '对比'],
        content: {
          wordCount: 1600,
          imageCount: 0,
          references: 0,
          paragraphs: 2,
          sections: ['分析目的', '竞品选择', '功能对比分析', '差异化功能']
        },
        cluster: 'research',
        position: { x: 50, y: 250 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['block_doc10_1', 'block_doc10_2'],
        relatedDocs: ['doc_1', 'doc_4'],
        similarity: {},
        metrics: {
          readability: 0.85,
          completeness: 0.89,
          relevance: 0.87
        }
      },

      // 段落节点 - 主要文档的重要段落
      {
        id: 'block_doc1_1',
        type: 'paragraph',
        label: '产品概述',
        category: 'overview',
        x: 420,
        y: 160,
        size: 22,
        color: '#60a5fa',
        importance: 0.7,
        centrality: 0.6,
        connections: 2,
        lastModified: Date.now() - 2 * 60 * 60 * 1000,
        author: '产品经理',
        tags: ['概述', '产品'],
        content: {
          wordCount: 280,
          imageCount: 0,
          references: 0,
          section: '产品概述'
        },
        cluster: 'core_docs',
        position: { x: 420, y: 160 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'doc_1',
        order: 1,
        sentiment: 'positive',
        keywords: ['文档管理', '协作功能', '结构化编辑']
      },
      {
        id: 'block_doc2_1',
        type: 'paragraph',
        label: '整体架构',
        category: 'architecture',
        x: 670,
        y: 260,
        size: 24,
        color: '#a78bfa',
        importance: 0.75,
        centrality: 0.65,
        connections: 3,
        lastModified: Date.now() - 6 * 60 * 60 * 1000,
        author: '技术负责人',
        tags: ['架构', '技术'],
        content: {
          wordCount: 350,
          imageCount: 0,
          references: 0,
          section: '整体架构'
        },
        cluster: 'technical',
        position: { x: 670, y: 260 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'doc_2',
        order: 1,
        sentiment: 'neutral',
        keywords: ['前后端分离', 'React', 'Node.js']
      },
      {
        id: 'block_doc10_2',
        type: 'paragraph',
        label: '竞品功能对比',
        category: 'comparison',
        x: 70,
        y: 310,
        size: 26,
        color: '#fbbf24',
        importance: 0.8,
        centrality: 0.7,
        connections: 2,
        lastModified: Date.now() - 9 * 24 * 60 * 60 * 1000,
        author: '产品分析师',
        tags: ['对比', '功能'],
        content: {
          wordCount: 400,
          imageCount: 0,
          references: 0,
          section: '竞品功能对比'
        },
        cluster: 'research',
        position: { x: 70, y: 310 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'doc_10',
        order: 2,
        sentiment: 'analytical',
        keywords: ['实时协作', '模板系统', '版本控制']
      }
    ];
        },
        cluster: 'core_docs',
        position: { x: 320, y: 180 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'project_overview',
        order: 1,
        sentiment: 'neutral',
        keywords: ['项目背景', '市场需求', '技术趋势']
      },
      {
        id: 'overview_p2',
        type: 'paragraph',
        label: '项目目标',
        category: 'objectives',
        x: 480,
        y: 180,
        size: 28,
        color: '#60a5fa',
        importance: 0.8,
        centrality: 0.7,
        connections: 4,
        lastModified: Date.now() - 86400000,
        author: '张三',
        tags: ['目标', '愿景'],
        content: {
          wordCount: 320,
          imageCount: 0,
          references: 1,
          section: '项目目标'
        },
        cluster: 'core_docs',
        position: { x: 480, y: 180 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'project_overview',
        order: 2,
        sentiment: 'positive',
        keywords: ['产品目标', '用户价值', '商业价值']
      },
      {
        id: 'overview_p3',
        type: 'paragraph',
        label: '技术栈选择',
        category: 'technology',
        x: 360,
        y: 220,
        size: 22,
        color: '#60a5fa',
        importance: 0.6,
        centrality: 0.5,
        connections: 2,
        lastModified: Date.now() - 86400000,
        author: '张三',
        tags: ['技术', '选择'],
        content: {
          wordCount: 180,
          imageCount: 0,
          references: 0,
          section: '技术栈'
        },
        cluster: 'core_docs',
        position: { x: 360, y: 220 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'project_overview',
        order: 3,
        sentiment: 'neutral',
        keywords: ['React', 'Node.js', '数据库']
      },
      {
        id: 'overview_p4',
        type: 'paragraph',
        label: '团队组织',
        category: 'organization',
        x: 440,
        y: 220,
        size: 24,
        color: '#60a5fa',
        importance: 0.65,
        centrality: 0.55,
        connections: 3,
        lastModified: Date.now() - 86400000,
        author: '张三',
        tags: ['团队', '组织'],
        content: {
          wordCount: 220,
          imageCount: 1,
          references: 1,
          section: '团队组织'
        },
        cluster: 'core_docs',
        position: { x: 440, y: 220 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'project_overview',
        order: 4,
        sentiment: 'positive',
        keywords: ['开发团队', '角色分工', '协作方式']
      },
      {
        id: 'requirements_analysis',
        type: 'document',
        label: '需求分析',
        category: 'requirements',
        x: 200,
        y: 300,
        size: 40,
        color: '#10b981',
        importance: 0.85,
        centrality: 0.75,
        connections: 10,
        lastModified: Date.now() - 172800000,
        author: '李四',
        tags: ['需求', '分析', '核心'],
        content: {
          wordCount: 2800,
          imageCount: 8,
          references: 12,
          paragraphs: 12,
          sections: ['用户需求', '功能需求', '非功能需求', '约束条件']
        },
        cluster: 'requirements',
        position: { x: 200, y: 300 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['req_p1', 'req_p2', 'req_p3', 'req_p4', 'req_p5'],
        relatedDocs: ['project_overview', 'user_stories', 'technical_design'],
        similarity: {
          'project_overview': 0.78,
          'user_stories': 0.85,
          'technical_design': 0.72
        },
        metrics: {
          readability: 0.82,
          completeness: 0.89,
          relevance: 0.91
        }
      },
      // 需求分析的段落节点
      {
        id: 'req_p1',
        type: 'paragraph',
        label: '用户画像分析',
        category: 'user_analysis',
        x: 120,
        y: 380,
        size: 26,
        color: '#34d399',
        importance: 0.75,
        centrality: 0.65,
        connections: 4,
        lastModified: Date.now() - 172800000,
        author: '李四',
        tags: ['用户', '画像'],
        content: {
          wordCount: 450,
          imageCount: 2,
          references: 3,
          section: '用户需求'
        },
        cluster: 'requirements',
        position: { x: 120, y: 380 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'requirements_analysis',
        order: 1,
        sentiment: 'neutral',
        keywords: ['目标用户', '用户特征', '使用场景']
      },
      {
        id: 'req_p2',
        type: 'paragraph',
        label: '核心功能列表',
        category: 'feature_list',
        x: 280,
        y: 380,
        size: 30,
        color: '#34d399',
        importance: 0.85,
        centrality: 0.8,
        connections: 6,
        lastModified: Date.now() - 172800000,
        author: '李四',
        tags: ['功能', '列表'],
        content: {
          wordCount: 680,
          imageCount: 1,
          references: 4,
          section: '功能需求'
        },
        cluster: 'requirements',
        position: { x: 280, y: 380 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'requirements_analysis',
        order: 2,
        sentiment: 'positive',
        keywords: ['文档编辑', '协作功能', '版本控制']
      },
      {
        id: 'req_p3',
        type: 'paragraph',
        label: '性能要求',
        category: 'performance',
        x: 160,
        y: 420,
        size: 24,
        color: '#34d399',
        importance: 0.7,
        centrality: 0.6,
        connections: 3,
        lastModified: Date.now() - 172800000,
        author: '李四',
        tags: ['性能', '要求'],
        content: {
          wordCount: 380,
          imageCount: 3,
          references: 2,
          section: '非功能需求'
        },
        cluster: 'requirements',
        position: { x: 160, y: 420 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'requirements_analysis',
        order: 3,
        sentiment: 'neutral',
        keywords: ['响应时间', '并发用户', '可用性']
      },
      {
        id: 'req_p4',
        type: 'paragraph',
        label: '安全需求',
        category: 'security',
        x: 240,
        y: 420,
        size: 27,
        color: '#34d399',
        importance: 0.8,
        centrality: 0.7,
        connections: 4,
        lastModified: Date.now() - 172800000,
        author: '李四',
        tags: ['安全', '需求'],
        content: {
          wordCount: 420,
          imageCount: 0,
          references: 2,
          section: '非功能需求'
        },
        cluster: 'requirements',
        position: { x: 240, y: 420 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'requirements_analysis',
        order: 4,
        sentiment: 'critical',
        keywords: ['用户认证', '数据加密', '权限控制']
      },
      {
        id: 'req_p5',
        type: 'paragraph',
        label: '技术约束',
        category: 'constraints',
        x: 200,
        y: 460,
        size: 22,
        color: '#34d399',
        importance: 0.6,
        centrality: 0.5,
        connections: 2,
        lastModified: Date.now() - 172800000,
        author: '李四',
        tags: ['约束', '技术'],
        content: {
          wordCount: 280,
          imageCount: 0,
          references: 1,
          section: '约束条件'
        },
        cluster: 'requirements',
        position: { x: 200, y: 460 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'requirements_analysis',
        order: 5,
        sentiment: 'neutral',
        keywords: ['浏览器兼容', '移动端适配', '第三方集成']
      },
      {
        id: 'technical_design',
        type: 'document',
        label: '技术设计',
        category: 'design',
        x: 600,
        y: 300,
        size: 42,
        color: '#8b5cf6',
        importance: 0.88,
        centrality: 0.78,
        connections: 11,
        lastModified: Date.now() - 259200000,
        author: '王五',
        tags: ['技术', '设计', '架构'],
        content: {
          wordCount: 3200,
          imageCount: 15,
          references: 18,
          paragraphs: 15,
          sections: ['系统架构', '技术选型', '数据设计', '接口设计']
        },
        cluster: 'technical',
        position: { x: 600, y: 300 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['tech_p1', 'tech_p2', 'tech_p3', 'tech_p4', 'tech_p5'],
        relatedDocs: ['project_overview', 'requirements_analysis', 'database_schema', 'api_documentation'],
        similarity: {
          'requirements_analysis': 0.72,
          'database_schema': 0.88,
          'api_documentation': 0.82
        },
        metrics: {
          readability: 0.75,
          completeness: 0.94,
          relevance: 0.86
        }
      },
      // 技术设计的段落节点
      {
        id: 'tech_p1',
        type: 'paragraph',
        label: '前端架构设计',
        category: 'frontend',
        x: 520,
        y: 380,
        size: 28,
        color: '#a78bfa',
        importance: 0.8,
        centrality: 0.7,
        connections: 5,
        lastModified: Date.now() - 259200000,
        author: '王五',
        tags: ['前端', '架构'],
        content: {
          wordCount: 520,
          imageCount: 4,
          references: 3,
          section: '系统架构'
        },
        cluster: 'technical',
        position: { x: 520, y: 380 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'technical_design',
        order: 1,
        sentiment: 'positive',
        keywords: ['React', '组件化', '状态管理']
      },
      {
        id: 'tech_p2',
        type: 'paragraph',
        label: '后端服务架构',
        category: 'backend',
        x: 680,
        y: 380,
        size: 30,
        color: '#a78bfa',
        importance: 0.85,
        centrality: 0.8,
        connections: 6,
        lastModified: Date.now() - 259200000,
        author: '王五',
        tags: ['后端', '服务'],
        content: {
          wordCount: 680,
          imageCount: 5,
          references: 4,
          section: '系统架构'
        },
        cluster: 'technical',
        position: { x: 680, y: 380 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'technical_design',
        order: 2,
        sentiment: 'neutral',
        keywords: ['微服务', 'API网关', '负载均衡']
      },
      {
        id: 'tech_p3',
        type: 'paragraph',
        label: '数据库设计原则',
        category: 'database',
        x: 560,
        y: 420,
        size: 26,
        color: '#a78bfa',
        importance: 0.75,
        centrality: 0.65,
        connections: 4,
        lastModified: Date.now() - 259200000,
        author: '王五',
        tags: ['数据库', '设计'],
        content: {
          wordCount: 420,
          imageCount: 2,
          references: 2,
          section: '数据设计'
        },
        cluster: 'technical',
        position: { x: 560, y: 420 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'technical_design',
        order: 3,
        sentiment: 'neutral',
        keywords: ['关系型数据库', '索引优化', '数据一致性']
      },
      {
        id: 'tech_p4',
        type: 'paragraph',
        label: 'API设计规范',
        category: 'api',
        x: 640,
        y: 420,
        size: 25,
        color: '#a78bfa',
        importance: 0.7,
        centrality: 0.6,
        connections: 3,
        lastModified: Date.now() - 259200000,
        author: '王五',
        tags: ['API', '规范'],
        content: {
          wordCount: 380,
          imageCount: 1,
          references: 3,
          section: '接口设计'
        },
        cluster: 'technical',
        position: { x: 640, y: 420 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'technical_design',
        order: 4,
        sentiment: 'neutral',
        keywords: ['RESTful', '版本控制', '错误处理']
      },
      {
        id: 'tech_p5',
        type: 'paragraph',
        label: '性能优化策略',
        category: 'optimization',
        x: 600,
        y: 460,
        size: 24,
        color: '#a78bfa',
        importance: 0.65,
        centrality: 0.55,
        connections: 2,
        lastModified: Date.now() - 259200000,
        author: '王五',
        tags: ['性能', '优化'],
        content: {
          wordCount: 320,
          imageCount: 3,
          references: 2,
          section: '性能优化'
        },
        cluster: 'technical',
        position: { x: 600, y: 460 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'technical_design',
        order: 5,
        sentiment: 'positive',
        keywords: ['缓存策略', '代码分割', '懒加载']
      },
      {
        id: 'user_stories',
        type: 'document',
        label: '用户故事',
        category: 'requirements',
        x: 50,
        y: 550,
        size: 35,
        color: '#059669',
        importance: 0.75,
        centrality: 0.65,
        connections: 7,
        lastModified: Date.now() - 345600000,
        author: '赵六',
        tags: ['用户', '故事', '需求'],
        content: {
          wordCount: 1800,
          imageCount: 4,
          references: 8,
          paragraphs: 10,
          sections: ['用户场景', '功能描述', '验收标准', '优先级排序']
        },
        cluster: 'requirements',
        position: { x: 50, y: 550 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['story_p1', 'story_p2', 'story_p3'],
        relatedDocs: ['requirements_analysis', 'ui_design'],
        similarity: {
          'requirements_analysis': 0.85,
          'ui_design': 0.68
        },
        metrics: {
          readability: 0.88,
          completeness: 0.83,
          relevance: 0.79
        }
      },
      // 用户故事的段落节点
      {
        id: 'story_p1',
        type: 'paragraph',
        label: '文档编辑场景',
        category: 'user_scenario',
        x: 10,
        y: 630,
        size: 22,
        color: '#10b981',
        importance: 0.7,
        centrality: 0.6,
        connections: 3,
        lastModified: Date.now() - 345600000,
        author: '赵六',
        tags: ['编辑', '场景'],
        content: {
          wordCount: 320,
          imageCount: 1,
          references: 2,
          section: '用户场景'
        },
        cluster: 'requirements',
        position: { x: 10, y: 630 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'user_stories',
        order: 1,
        sentiment: 'positive',
        keywords: ['实时编辑', '多人协作', '版本同步']
      },
      {
        id: 'story_p2',
        type: 'paragraph',
        label: '协作审核流程',
        category: 'collaboration',
        x: 90,
        y: 630,
        size: 24,
        color: '#10b981',
        importance: 0.75,
        centrality: 0.65,
        connections: 4,
        lastModified: Date.now() - 345600000,
        author: '赵六',
        tags: ['协作', '审核'],
        content: {
          wordCount: 380,
          imageCount: 2,
          references: 3,
          section: '功能描述'
        },
        cluster: 'requirements',
        position: { x: 90, y: 630 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'user_stories',
        order: 2,
        sentiment: 'neutral',
        keywords: ['审核流程', '权限管理', '通知机制']
      },
      {
        id: 'story_p3',
        type: 'paragraph',
        label: '移动端适配',
        category: 'mobile',
        x: 50,
        y: 670,
        size: 20,
        color: '#10b981',
        importance: 0.6,
        centrality: 0.5,
        connections: 2,
        lastModified: Date.now() - 345600000,
        author: '赵六',
        tags: ['移动端', '适配'],
        content: {
          wordCount: 280,
          imageCount: 1,
          references: 1,
          section: '验收标准'
        },
        cluster: 'requirements',
        position: { x: 50, y: 670 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'user_stories',
        order: 3,
        sentiment: 'neutral',
        keywords: ['响应式设计', '触摸操作', '离线功能']
      },
      {
        id: 'ui_design',
        type: 'document',
        label: 'UI设计',
        category: 'design',
        x: 250,
        y: 550,
        size: 38,
        color: '#ec4899',
        importance: 0.8,
        centrality: 0.7,
        connections: 8,
        lastModified: Date.now() - 432000000,
        author: '孙七',
        tags: ['UI', '设计', '界面'],
        content: {
          wordCount: 2200,
          imageCount: 25,
          references: 15,
          paragraphs: 8,
          sections: ['设计原则', '色彩方案', '组件规范', '交互设计']
        },
        cluster: 'design',
        position: { x: 250, y: 550 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['ui_p1', 'ui_p2', 'ui_p3', 'ui_p4'],
        relatedDocs: ['user_stories', 'technical_design', 'prototype'],
        similarity: {
          'user_stories': 0.68,
          'prototype': 0.82,
          'technical_design': 0.58
        },
        metrics: {
          readability: 0.9,
          completeness: 0.85,
          relevance: 0.77
        }
      },
      // UI设计的段落节点
      {
        id: 'ui_p1',
        type: 'paragraph',
        label: '设计语言',
        category: 'design_system',
        x: 200,
        y: 630,
        size: 26,
        color: '#f472b6',
        importance: 0.8,
        centrality: 0.7,
        connections: 4,
        lastModified: Date.now() - 432000000,
        author: '孙七',
        tags: ['设计语言', '规范'],
        content: {
          wordCount: 420,
          imageCount: 6,
          references: 3,
          section: '设计原则'
        },
        cluster: 'design',
        position: { x: 200, y: 630 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'ui_design',
        order: 1,
        sentiment: 'positive',
        keywords: ['简洁明了', '一致性', '可访问性']
      },
      {
        id: 'ui_p2',
        type: 'paragraph',
        label: '色彩搭配',
        category: 'color_scheme',
        x: 300,
        y: 630,
        size: 24,
        color: '#f472b6',
        importance: 0.7,
        centrality: 0.6,
        connections: 3,
        lastModified: Date.now() - 432000000,
        author: '孙七',
        tags: ['色彩', '搭配'],
        content: {
          wordCount: 320,
          imageCount: 8,
          references: 2,
          section: '色彩方案'
        },
        cluster: 'design',
        position: { x: 300, y: 630 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'ui_design',
        order: 2,
        sentiment: 'neutral',
        keywords: ['主题色', '辅助色', '对比度']
      },
      {
        id: 'ui_p3',
        type: 'paragraph',
        label: '组件库设计',
        category: 'components',
        x: 220,
        y: 670,
        size: 28,
        color: '#f472b6',
        importance: 0.85,
        centrality: 0.75,
        connections: 5,
        lastModified: Date.now() - 432000000,
        author: '孙七',
        tags: ['组件', '库'],
        content: {
          wordCount: 520,
          imageCount: 12,
          references: 4,
          section: '组件规范'
        },
        cluster: 'design',
        position: { x: 220, y: 670 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'ui_design',
        order: 3,
        sentiment: 'positive',
        keywords: ['按钮组件', '表单组件', '导航组件']
      },
      {
        id: 'ui_p4',
        type: 'paragraph',
        label: '交互原型',
        category: 'interaction',
        x: 280,
        y: 670,
        size: 25,
        color: '#f472b6',
        importance: 0.75,
        centrality: 0.65,
        connections: 4,
        lastModified: Date.now() - 432000000,
        author: '孙七',
        tags: ['交互', '原型'],
        content: {
          wordCount: 380,
          imageCount: 10,
          references: 3,
          section: '交互设计'
        },
        cluster: 'design',
        position: { x: 280, y: 670 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'ui_design',
        order: 4,
        sentiment: 'positive',
        keywords: ['动画效果', '状态反馈', '操作流程']
      },
      {
        id: 'database_schema',
        type: 'document',
        label: '数据库设计',
        category: 'database',
        x: 750,
        y: 550,
        size: 36,
        color: '#f59e0b',
        importance: 0.82,
        centrality: 0.72,
        connections: 6,
        lastModified: Date.now() - 518400000,
        author: '周八',
        tags: ['数据库', '设计', '存储'],
        content: {
          wordCount: 2600,
          imageCount: 12,
          references: 10,
          paragraphs: 9,
          sections: ['表结构', '索引设计', '关系模型', '数据迁移']
        },
        cluster: 'technical',
        position: { x: 750, y: 550 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: null,
        childParagraphs: ['db_p1', 'db_p2', 'db_p3'],
        relatedDocs: ['technical_design', 'api_documentation'],
        similarity: {
          'technical_design': 0.88,
          'api_documentation': 0.75
        },
        metrics: {
          readability: 0.72,
          completeness: 0.92,
          relevance: 0.84
        }
      },
      // 数据库设计的段落节点
      {
        id: 'db_p1',
        type: 'paragraph',
        label: '用户表设计',
        category: 'user_table',
        x: 710,
        y: 630,
        size: 24,
        color: '#fbbf24',
        importance: 0.75,
        centrality: 0.65,
        connections: 4,
        lastModified: Date.now() - 518400000,
        author: '周八',
        tags: ['用户表', '设计'],
        content: {
          wordCount: 380,
          imageCount: 3,
          references: 2,
          section: '表结构'
        },
        cluster: 'technical',
        position: { x: 710, y: 630 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'database_schema',
        order: 1,
        sentiment: 'neutral',
        keywords: ['用户信息', '权限字段', '索引优化']
      },
      {
        id: 'db_p2',
        type: 'paragraph',
        label: '文档表结构',
        category: 'document_table',
        x: 790,
        y: 630,
        size: 26,
        color: '#fbbf24',
        importance: 0.8,
        centrality: 0.7,
        connections: 5,
        lastModified: Date.now() - 518400000,
        author: '周八',
        tags: ['文档表', '结构'],
        content: {
          wordCount: 450,
          imageCount: 4,
          references: 3,
          section: '表结构'
        },
        cluster: 'technical',
        position: { x: 790, y: 630 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'database_schema',
        order: 2,
        sentiment: 'neutral',
        keywords: ['文档内容', '版本控制', '关联关系']
      },
      {
        id: 'db_p3',
        type: 'paragraph',
        label: '关系模型',
        category: 'relationships',
        x: 750,
        y: 670,
        size: 22,
        color: '#fbbf24',
        importance: 0.7,
        centrality: 0.6,
        connections: 3,
        lastModified: Date.now() - 518400000,
        author: '周八',
        tags: ['关系', '模型'],
        content: {
          wordCount: 320,
          imageCount: 2,
          references: 2,
          section: '关系模型'
        },
        cluster: 'technical',
        position: { x: 750, y: 670 },
        velocity: { x: 0, y: 0 },
        fixed: false,
        parentDoc: 'database_schema',
        order: 3,
        sentiment: 'neutral',
        keywords: ['外键约束', '连接查询', '数据一致性']
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

    // 创建边关系 - 基于真实的文档关系数据
    const edges = [
      // rel_1: doc_1 -> doc_2 (implements)
      {
        id: 'edge_rel_1',
        from: 'doc_1', // 产品需求文档
        to: 'doc_2',   // 技术架构设计方案
        type: 'implements',
        weight: 0.9,
        color: '#3b82f6',
        label: '技术架构实现产品需求',
        strength: 0.85,
        bidirectional: false,
        animated: true,
        category: 'implementation',
        description: '技术架构设计实现产品需求'
      },
      // rel_2: doc_1 -> doc_4 (depends_on)
      {
        id: 'edge_rel_2',
        from: 'doc_1', // 产品需求文档
        to: 'doc_4',   // 用户研究报告
        type: 'depends_on',
        weight: 0.85,
        color: '#f59e0b',
        label: '产品需求基于用户研究',
        strength: 0.8,
        bidirectional: false,
        animated: true,
        category: 'dependency',
        description: '产品需求基于用户研究结果'
      },
      // rel_3: doc_10 -> doc_1 (influences)
      {
        id: 'edge_rel_3',
        from: 'doc_10', // 竞品分析报告
        to: 'doc_1',    // 产品需求文档
        type: 'influences',
        weight: 0.8,
        color: '#10b981',
        label: '竞品分析影响产品需求',
        strength: 0.75,
        bidirectional: false,
        animated: false,
        category: 'influence',
        description: '竞品分析影响产品需求设计'
      },
      // rel_4: doc_2 -> doc_7 (defines)
      {
        id: 'edge_rel_4',
        from: 'doc_2', // 技术架构设计方案
        to: 'doc_7',   // API接口文档
        type: 'defines',
        weight: 0.9,
        color: '#8b5cf6',
        label: '技术架构定义API接口',
        strength: 0.85,
        bidirectional: false,
        animated: true,
        category: 'definition',
        description: '技术架构定义API接口规范'
      },
      // rel_5: doc_6 -> doc_1 (implements)
      {
        id: 'edge_rel_5',
        from: 'doc_6', // UI设计规范
        to: 'doc_1',   // 产品需求文档
        type: 'implements',
        weight: 0.75,
        color: '#ec4899',
        label: 'UI设计实现产品需求',
        strength: 0.7,
        bidirectional: false,
        animated: false,
        category: 'implementation',
        description: 'UI设计实现产品需求中的界面要求'
      },
      // rel_6: doc_8 -> doc_2 (validates)
      {
        id: 'edge_rel_6',
        from: 'doc_8', // 测试计划文档
        to: 'doc_2',   // 技术架构设计方案
        type: 'validates',
        weight: 0.7,
        color: '#22c55e',
        label: '测试验证技术架构',
        strength: 0.65,
        bidirectional: false,
        animated: false,
        category: 'validation',
        description: '测试计划验证技术架构的可行性'
      },
      // rel_7: doc_9 -> doc_1 (initiates)
      {
        id: 'edge_rel_7',
        from: 'doc_9', // 项目启动会议
        to: 'doc_1',   // 产品需求文档
        type: 'initiates',
        weight: 0.85,
        color: '#f97316',
        label: '项目启动确定需求',
        strength: 0.8,
        bidirectional: false,
        animated: true,
        category: 'initiation',
        description: '项目启动会议确定产品需求方向'
      },
      // rel_8: doc_3 -> doc_5 (references)
      {
        id: 'edge_rel_8',
        from: 'doc_3', // 周例会纪要
        to: 'doc_5',   // 开发进度周报
        type: 'references',
        weight: 0.6,
        color: '#06b6d4',
        label: '例会与进度关联',
        strength: 0.55,
        bidirectional: true,
        animated: false,
        category: 'reference',
        description: '例会纪要与开发进度相互关联'
      },
      // rel_9: doc_4 -> doc_10 (complements)
      {
        id: 'edge_rel_9',
        from: 'doc_4',  // 用户研究报告
        to: 'doc_10',   // 竞品分析报告
        type: 'complements',
        weight: 0.75,
        color: '#84cc16',
        label: '用户研究与竞品分析互补',
        strength: 0.7,
        bidirectional: true,
        animated: false,
        category: 'complement',
        description: '用户研究与竞品分析相互补充'
      },
      // rel_10: doc_7 -> doc_8 (tested_by)
      {
        id: 'edge_rel_10',
        from: 'doc_7', // API接口文档
        to: 'doc_8',   // 测试计划文档
        type: 'tested_by',
        weight: 0.8,
        color: '#ef4444',
        label: 'API接口需要测试验证',
        strength: 0.75,
        bidirectional: false,
        animated: true,
        category: 'testing',
        description: 'API接口需要通过测试计划验证'
      },
      
      // 段落级别的关系连接
      {
        id: 'edge_block_1',
        from: 'doc_1',
        to: 'block_doc1_1',
        type: 'contains',
        weight: 1.0,
        color: '#94a3b8',
        label: '包含段落',
        strength: 0.9,
        bidirectional: false,
        animated: false,
        category: 'hierarchy'
      },
      {
        id: 'edge_block_2',
        from: 'doc_2',
        to: 'block_doc2_1',
        type: 'contains',
        weight: 1.0,
        color: '#94a3b8',
        label: '包含段落',
        strength: 0.9,
        bidirectional: false,
        animated: false,
        category: 'hierarchy'
      },
      {
        id: 'edge_block_3',
        from: 'doc_10',
        to: 'block_doc10_2',
        type: 'contains',
        weight: 1.0,
        color: '#94a3b8',
        label: '包含段落',
        strength: 0.9,
        bidirectional: false,
        animated: false,
        category: 'hierarchy'
      }
    ];

    // 创建集群信息 - 基于真实文档的分类
    const clusters = [
      {
        id: 'core_docs',
        name: '核心产品文档',
        color: '#3b82f6',
        nodes: ['doc_1', 'block_doc1_1'], // 产品需求文档
        center: { x: 400, y: 130 },
        size: 2
      },
      {
        id: 'technical',
        name: '技术文档',
        color: '#8b5cf6',
        nodes: ['doc_2', 'doc_7', 'doc_8', 'block_doc2_1'], // 技术架构、API接口、测试计划
        center: { x: 650, y: 300 },
        size: 4
      },
      {
        id: 'research',
        name: '研究分析',
        color: '#f59e0b',
        nodes: ['doc_4', 'doc_10', 'block_doc10_2'], // 用户研究、竞品分析
        center: { x: 100, y: 200 },
        size: 3
      },
      {
        id: 'design',
        name: '设计规范',
        color: '#ec4899',
        nodes: ['doc_6'], // UI设计规范
        center: { x: 500, y: 250 },
        size: 1
      },
      {
        id: 'management',
        name: '项目管理',
        color: '#10b981',
        nodes: ['doc_3', 'doc_5', 'doc_9'], // 例会纪要、进度周报、项目启动
        center: { x: 275, y: 200 },
        size: 3
      }
    ];

    // 计算图谱指标 - 基于真实数据
    const metrics = {
      totalNodes: nodes.length, // 13个节点（10文档+3段落）
      totalEdges: edges.length, // 13条边（10文档关系+3段落关系）
      totalClusters: clusters.length, // 5个集群
      density: (edges.length * 2) / (nodes.length * (nodes.length - 1)), // 图密度
      avgDegree: (edges.length * 2) / nodes.length, // 平均度
      centralityScore: nodes.reduce((sum, node) => sum + node.centrality, 0) / nodes.length, // 中心性分数
      connectivityIndex: 0.78, // 连接性指数（基于真实关系数量）
      modularityScore: 0.85,   // 模块化分数（5个明确集群）
      clusteringCoefficient: 0.72, // 聚类系数
      pathLength: 2.1,         // 平均路径长度
      networkDiameter: 3,      // 网络直径
      strongComponents: 5,     // 强连通分量（对应5个集群）
      weakComponents: 1        // 弱连通分量（整个图连通）
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

  // 画布交互处理函数
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (viewBox.width / rect.width) + viewBox.x;
    const y = (e.clientY - rect.top) * (viewBox.height / rect.height) + viewBox.y;

    // 检查是否点击在节点上
    const clickedNode = filteredData.nodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= node.size / 2;
    });

    if (clickedNode) {
      // 开始拖拽节点
      setDragState({
        isDragging: true,
        draggedNode: clickedNode,
        dragOffset: { x: x - clickedNode.x, y: y - clickedNode.y },
        startPos: { x, y }
      });
    } else if (tool === 'pan') {
      // 开始平移画布
      setCanvasState(prev => ({
        ...prev,
        isPanning: true,
        panStart: { x: e.clientX, y: e.clientY }
      }));
    }
  }, [tool, filteredData.nodes, viewBox, canvasRef]);

  const handleMouseMove = useCallback((e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (viewBox.width / rect.width) + viewBox.x;
    const y = (e.clientY - rect.top) * (viewBox.height / rect.height) + viewBox.y;

    if (dragState.isDragging && dragState.draggedNode) {
      // 拖拽节点
      const newX = x - dragState.dragOffset.x;
      const newY = y - dragState.dragOffset.y;

      // 更新节点位置
      const updatedNodes = filteredData.nodes.map(node => {
        if (node.id === dragState.draggedNode.id) {
          return { ...node, x: newX, y: newY, position: { x: newX, y: newY } };
        }
        return node;
      });

      // 使用setState更新节点数据
      setEnhancedGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => {
          if (node.id === dragState.draggedNode.id) {
            return { ...node, x: newX, y: newY, position: { x: newX, y: newY } };
          }
          return node;
        })
      }));

    } else if (canvasState.isPanning) {
      // 平移画布
      const deltaX = (e.clientX - canvasState.panStart.x) * (viewBox.width / rect.width);
      const deltaY = (e.clientY - canvasState.panStart.y) * (viewBox.height / rect.height);

      setViewBox(prev => ({
        ...prev,
        x: prev.x - deltaX,
        y: prev.y - deltaY
      }));

      setCanvasState(prev => ({
        ...prev,
        panStart: { x: e.clientX, y: e.clientY }
      }));
    } else {
      // 检查悬停
      const hoveredNode = filteredData.nodes.find(node => {
        const dx = x - node.x;
        const dy = y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= node.size / 2;
      });

      setHoveredNode(hoveredNode || null);
    }
  }, [dragState, canvasState, filteredData.nodes, viewBox, canvasRef]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedNode: null,
      dragOffset: { x: 0, y: 0 },
      startPos: { x: 0, y: 0 }
    });

    setCanvasState(prev => ({
      ...prev,
      isPanning: false,
      panStart: { x: 0, y: 0 }
    }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
    handleMouseUp();
  }, [handleMouseUp]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (viewBox.width / rect.width) + viewBox.x;
    const mouseY = (e.clientY - rect.top) * (viewBox.height / rect.height) + viewBox.y;

    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.1, Math.min(5, canvasState.transform.scale * zoomFactor));
    
    if (newScale !== canvasState.transform.scale) {
      const scaleChange = newScale / canvasState.transform.scale;
      
      setViewBox(prev => ({
        x: mouseX - (mouseX - prev.x) * scaleChange,
        y: mouseY - (mouseY - prev.y) * scaleChange,
        width: prev.width * scaleChange,
        height: prev.height * scaleChange
      }));

      setCanvasState(prev => ({
        ...prev,
        transform: {
          ...prev.transform,
          scale: newScale
        }
      }));
    }
  }, [viewBox, canvasState.transform.scale, canvasRef]);

  // 画布控制函数
  const zoomIn = useCallback(() => {
    const newScale = Math.min(5, canvasState.transform.scale * 1.2);
    const scaleChange = newScale / canvasState.transform.scale;
    
    setViewBox(prev => ({
      x: prev.x + prev.width * (1 - scaleChange) * 0.5,
      y: prev.y + prev.height * (1 - scaleChange) * 0.5,
      width: prev.width * scaleChange,
      height: prev.height * scaleChange
    }));

    setCanvasState(prev => ({
      ...prev,
      transform: { ...prev.transform, scale: newScale }
    }));
  }, [canvasState.transform.scale]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(0.1, canvasState.transform.scale * 0.8);
    const scaleChange = newScale / canvasState.transform.scale;
    
    setViewBox(prev => ({
      x: prev.x + prev.width * (1 - scaleChange) * 0.5,
      y: prev.y + prev.height * (1 - scaleChange) * 0.5,
      width: prev.width * scaleChange,
      height: prev.height * scaleChange
    }));

    setCanvasState(prev => ({
      ...prev,
      transform: { ...prev.transform, scale: newScale }
    }));
  }, [canvasState.transform.scale]);

  const zoomToFit = useCallback(() => {
    if (filteredData.nodes.length === 0) return;

    const padding = 50;
    const minX = Math.min(...filteredData.nodes.map(n => n.x - n.size)) - padding;
    const maxX = Math.max(...filteredData.nodes.map(n => n.x + n.size)) + padding;
    const minY = Math.min(...filteredData.nodes.map(n => n.y - n.size)) - padding;
    const maxY = Math.max(...filteredData.nodes.map(n => n.y + n.size)) + padding;

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    setViewBox({
      x: minX,
      y: minY,
      width: contentWidth,
      height: contentHeight
    });

    setCanvasState(prev => ({
      ...prev,
      transform: { x: 0, y: 0, scale: 1 }
    }));
  }, [filteredData.nodes]);

  const centerView = useCallback(() => {
    if (filteredData.nodes.length === 0) return;

    const centerX = filteredData.nodes.reduce((sum, n) => sum + n.x, 0) / filteredData.nodes.length;
    const centerY = filteredData.nodes.reduce((sum, n) => sum + n.y, 0) / filteredData.nodes.length;

    setViewBox(prev => ({
      x: centerX - prev.width / 2,
      y: centerY - prev.height / 2,
      width: prev.width,
      height: prev.height
    }));
  }, [filteredData.nodes]);

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
          {/* 画布控制 */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6b7280', marginRight: '8px' }}>画布:</span>
            <button
              onClick={zoomIn}
              style={{
                padding: '6px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="放大"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={zoomOut}
              style={{
                padding: '6px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="缩小"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={zoomToFit}
              style={{
                padding: '6px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="适应画布"
            >
              <Maximize2 size={14} />
            </button>
            <button
              onClick={centerView}
              style={{
                padding: '6px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="居中显示"
            >
              <Crosshair size={14} />
            </button>
            <button
              onClick={() => setTool(tool === 'select' ? 'pan' : 'select')}
              style={{
                padding: '6px',
                backgroundColor: tool === 'pan' ? '#3b82f6' : '#f3f4f6',
                color: tool === 'pan' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={tool === 'pan' ? '切换到选择' : '切换到平移'}
            >
              <Move size={14} />
            </button>
          </div>

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
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
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
