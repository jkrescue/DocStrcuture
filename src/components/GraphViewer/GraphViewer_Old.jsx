import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Network, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Settings, Search, Filter, Layout, Focus, RefreshCw } from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const GraphViewer = ({ onClose }) => {
  const { blocks, getReferences, graphData } = useDocStore();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [viewMode, setViewMode] = useState('references'); // 'references', 'hierarchy', 'timeline'
  const [layoutType, setLayoutType] = useState('force'); // 'force', 'circular', 'hierarchical', 'grid'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // 力导向布局算法
  const applyForceLayout = (nodes, edges) => {
    const iterations = 50;
    const repulsion = 10000;
    const attraction = 0.1;
    const damping = 0.9;
    
    for (let iter = 0; iter < iterations; iter++) {
      // 计算排斥力
      for (let i = 0; i < nodes.length; i++) {
        let fx = 0, fy = 0;
        for (let j = 0; j < nodes.length; j++) {
          if (i !== j) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = repulsion / (distance * distance);
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
          }
        }
        nodes[i].fx = fx;
        nodes[i].fy = fy;
      }
      
      // 计算吸引力
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (fromNode && toNode) {
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = attraction * distance;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          fromNode.fx += fx;
          fromNode.fy += fy;
          toNode.fx -= fx;
          toNode.fy -= fy;
        }
      });
      
      // 应用力和阻尼
      nodes.forEach(node => {
        node.vx = (node.vx || 0) * damping + node.fx * 0.1;
        node.vy = (node.vy || 0) * damping + node.fy * 0.1;
        node.x += node.vx;
        node.y += node.vy;
        
        // 边界检查
        node.x = Math.max(50, Math.min(800, node.x));
        node.y = Math.max(50, Math.min(600, node.y));
      });
    }
    
    return nodes;
  };

  // 圆形布局
  const applyCircularLayout = (nodes) => {
    const centerX = 400;
    const centerY = 300;
    const radius = Math.min(300, Math.max(100, nodes.length * 15));
    
    nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
    });
    
    return nodes;
  };

  // 层次布局
  const applyHierarchicalLayout = (nodes, edges) => {
    const levels = new Map();
    const visited = new Set();
    
    // 找到根节点（没有入边的节点）
    const inDegree = new Map();
    nodes.forEach(node => inDegree.set(node.id, 0));
    edges.forEach(edge => {
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    });
    
    const roots = nodes.filter(node => inDegree.get(node.id) === 0);
    
    // BFS 分层
    const queue = roots.map(node => ({ node, level: 0 }));
    roots.forEach(node => {
      visited.add(node.id);
      levels.set(node.id, 0);
    });
    
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      edges.filter(edge => edge.from === node.id).forEach(edge => {
        const targetNode = nodes.find(n => n.id === edge.to);
        if (targetNode && !visited.has(targetNode.id)) {
          visited.add(targetNode.id);
          levels.set(targetNode.id, level + 1);
          queue.push({ node: targetNode, level: level + 1 });
        }
      });
    }
    
    // 按层级排列
    const levelGroups = new Map();
    levels.forEach((level, nodeId) => {
      if (!levelGroups.has(level)) levelGroups.set(level, []);
      levelGroups.get(level).push(nodes.find(n => n.id === nodeId));
    });
    
    levelGroups.forEach((nodesInLevel, level) => {
      const y = 100 + level * 120;
      const startX = 400 - (nodesInLevel.length - 1) * 80 / 2;
      nodesInLevel.forEach((node, index) => {
        node.x = startX + index * 80;
        node.y = y;
      });
    });
    
    return nodes;
  };

  // 网格布局
  const applyGridLayout = (nodes) => {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const rows = Math.ceil(nodes.length / cols);
    const cellWidth = 700 / cols;
    const cellHeight = 500 / rows;
    
    nodes.forEach((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      node.x = 100 + col * cellWidth + cellWidth / 2;
      node.y = 100 + row * cellHeight + cellHeight / 2;
    });
    
    return nodes;
  };

  // 生成图谱数据
  const generateGraphData = useCallback(() => {
    let nodes = blocks.map(block => ({
      id: block.id,
      type: block.type,
      label: getNodeLabel(block),
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      size: getNodeSize(block),
      color: getNodeColor(block.type),
      block: block,
      connections: 0
    }));

    const edges = [];
    blocks.forEach(block => {
      if (block.type === 'reference') {
        const sourceId = block.content.sourceBlockId;
        if (sourceId) {
          edges.push({
            from: sourceId,
            to: block.id,
            type: 'reference',
            color: '#3b82f6',
            weight: 1
          });
        }
      }
    });

    // 计算连接数
    nodes.forEach(node => {
      node.connections = edges.filter(e => e.from === node.id || e.to === node.id).length;
    });

    // 应用布局
    switch (layoutType) {
      case 'circular':
        nodes = applyCircularLayout([...nodes]);
        break;
      case 'hierarchical':
        nodes = applyHierarchicalLayout([...nodes], edges);
        break;
      case 'grid':
        nodes = applyGridLayout([...nodes]);
        break;
      case 'force':
      default:
        nodes = applyForceLayout([...nodes], edges);
        break;
    }

    return { nodes, edges };
  }, [blocks, layoutType]);

  const getNodeLabel = (block) => {
    switch (block.type) {
      case 'text':
        const text = block.content.text || '';
        return text.length > 20 ? text.substring(0, 20) + '...' : text;
      case 'field':
        return block.content.label || '字段块';
      case 'table':
        return block.content.title || '表格块';
      case 'reference':
        return '引用块';
      default:
        return '未知块';
    }
  };

  const getNodeSize = (block) => {
    const baseSize = 30;
    const references = getReferences(block.id);
    return baseSize + references.length * 5;
  };

  const getNodeColor = (type) => {
    const colors = {
      text: '#3b82f6',
      field: '#10b981',
      table: '#8b5cf6',
      reference: '#f59e0b'
    };
    return colors[type] || '#6b7280';
  };

  const [localGraphData, setLocalGraphData] = useState(() => generateGraphData());

  useEffect(() => {
    setLocalGraphData(generateGraphData());
  }, [blocks]);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // 设置画布尺寸（支持高DPI）
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    // 清空画布
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // 应用变换
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);

    // 绘制网格背景（可选）
    if (showSettings) {
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 0.5;
      const gridSize = 50;
      for (let x = 0; x <= rect.width / zoomLevel; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x - panOffset.x / zoomLevel, 0);
        ctx.lineTo(x - panOffset.x / zoomLevel, rect.height / zoomLevel);
        ctx.stroke();
      }
      for (let y = 0; y <= rect.height / zoomLevel; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y - panOffset.y / zoomLevel);
        ctx.lineTo(rect.width / zoomLevel, y - panOffset.y / zoomLevel);
        ctx.stroke();
      }
    }

    // 绘制连接线（增强视觉效果）
    localGraphData.edges.forEach(edge => {
      const fromNode = localGraphData.nodes.find(n => n.id === edge.from);
      const toNode = localGraphData.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        // 检查是否高亮显示
        const isHighlighted = selectedNode && 
          (selectedNode.id === edge.from || selectedNode.id === edge.to);
        
        // 设置线条样式
        ctx.lineWidth = isHighlighted ? 3 : 1.5;
        ctx.strokeStyle = isHighlighted ? '#2563eb' : '#d1d5db';
        
        // 绘制弧形连接线（更美观）
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const curvature = distance * 0.2; // 弧度
        
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        const perpX = -dy / distance * curvature;
        const perpY = dx / distance * curvature;
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.quadraticCurveTo(midX + perpX, midY + perpY, toNode.x, toNode.y);
        ctx.stroke();

        // 绘制箭头
        const angle = Math.atan2(dy, dx);
        const arrowLength = isHighlighted ? 12 : 8;
        const arrowAngle = Math.PI / 6;
        
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(toNode.x, toNode.y);
        ctx.lineTo(
          toNode.x - arrowLength * Math.cos(angle - arrowAngle),
          toNode.y - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.lineTo(
          toNode.x - arrowLength * Math.cos(angle + arrowAngle),
          toNode.y - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.closePath();
        ctx.fill();
      }
    });

    // 绘制节点（增强设计）
    localGraphData.nodes.forEach(node => {
      // 过滤搜索结果
      if (searchTerm && !node.label.toLowerCase().includes(searchTerm.toLowerCase())) {
        ctx.globalAlpha = 0.3;
      } else {
        ctx.globalAlpha = 1;
      }
      
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const radius = node.size / 2;
      
      // 绘制外圈光晕（选中或悬停时）
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 8, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? 'rgba(37, 99, 235, 0.2)' : 'rgba(156, 163, 175, 0.2)';
        ctx.fill();
      }
      
      // 绘制节点主体
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      // 渐变填充
      const gradient = ctx.createRadialGradient(
        node.x - radius/3, node.y - radius/3, 0,
        node.x, node.y, radius
      );
      gradient.addColorStop(0, lightenColor(node.color, 20));
      gradient.addColorStop(1, node.color);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 边框
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = isSelected ? '#1f2937' : 'rgba(255, 255, 255, 0.8)';
      ctx.stroke();
      
      // 连接数指示器
      if (node.connections > 0) {
        ctx.beginPath();
        ctx.arc(node.x + radius - 8, node.y - radius + 8, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.connections.toString(), node.x + radius - 8, node.y - radius + 12);
      }

      // 节点图标
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      const icon = getNodeIcon(node.type);
      ctx.fillText(icon, node.x, node.y + 6);

      // 节点标签（改进显示）
      ctx.fillStyle = '#1f2937';
      ctx.font = isSelected ? 'bold 12px Arial' : '11px Arial';
      ctx.textAlign = 'center';
      
      // 多行文本支持
      const maxWidth = 80;
      const words = node.label.split(' ');
      let line = '';
      let y = node.y + radius + 20;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, node.x, y);
          line = words[n] + ' ';
          y += 14;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, node.x, y);
    });

    ctx.restore();
    ctx.globalAlpha = 1;
  }, [localGraphData, zoomLevel, panOffset, selectedNode, hoveredNode, searchTerm, showSettings]);

  // 辅助函数
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const B = (num >> 8 & 0x00FF) + amt;
    const G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
  };

  const getNodeIcon = (type) => {
    const icons = {
      text: '📝',
      field: '🏷️',
      table: '📊',
      reference: '🔗'
    };
    return icons[type] || '📄';
  };

  useEffect(() => {
    drawGraph();
  }, [localGraphData, zoomLevel, panOffset, selectedNode]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoomLevel;
    const y = (event.clientY - rect.top - panOffset.y) / zoomLevel;

    // 检查是否点击了节点
    const clickedNode = localGraphData.nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= node.size / 2;
    });

    setSelectedNode(clickedNode || null);
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - panOffset.x, y: event.clientY - panOffset.y });
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      setPanOffset({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta) => {
    const newZoom = Math.max(0.1, Math.min(3, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const getNodeStats = () => {
    const stats = {
      total: blocks.length,
      text: blocks.filter(b => b.type === 'text').length,
      field: blocks.filter(b => b.type === 'field').length,
      table: blocks.filter(b => b.type === 'table').length,
      reference: blocks.filter(b => b.type === 'reference').length,
      connections: localGraphData.edges.length
    };
    return stats;
  };

  const stats = getNodeStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex">
        {/* 主图谱区域 */}
        <div className="flex-1 relative">
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-gray-900 bg-white px-3 py-1 rounded shadow">
                引用关系图谱
              </h2>
              <div className="bg-white px-3 py-1 rounded shadow text-sm text-gray-600">
                {stats.total} 个节点 • {stats.connections} 个连接
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-white text-gray-500 hover:text-gray-700 p-2 rounded shadow"
            >
              ✕
            </button>
          </div>

          {/* 工具栏 */}
          <div className="absolute top-16 left-4 z-10 bg-white rounded shadow p-2 space-y-2">
            <button
              onClick={() => handleZoom(0.1)}
              className="p-2 hover:bg-gray-100 rounded"
              title="放大"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-2 hover:bg-gray-100 rounded"
              title="缩小"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={resetView}
              className="p-2 hover:bg-gray-100 rounded"
              title="重置视图"
            >
              <RotateCcw size={16} />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded"
              title="设置"
            >
              <Settings size={16} />
            </button>
          </div>

          {/* 视图模式切换 */}
          <div className="absolute top-16 right-4 z-10 bg-white rounded shadow p-1">
            <div className="flex space-x-1">
              {[
                { id: 'references', name: '引用关系' },
                { id: 'hierarchy', name: '层级结构' },
                { id: 'timeline', name: '时间线' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    viewMode === mode.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>

          {/* 画布 */}
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* 图例 */}
          <div className="absolute bottom-4 left-4 bg-white rounded shadow p-3">
            <h4 className="font-medium text-gray-800 mb-2">图例</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>文本块</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>字段块</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>表格块</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>引用块</span>
              </div>
            </div>
          </div>

          {/* 缩放信息 */}
          <div className="absolute bottom-4 right-4 bg-white rounded shadow px-3 py-1 text-sm text-gray-600">
            缩放: {Math.round(zoomLevel * 100)}%
          </div>
        </div>

        {/* 右侧信息面板 */}
        <div className="w-80 border-l bg-gray-50 p-6">
          {selectedNode ? (
            <div>
              <h3 className="font-bold text-gray-900 mb-4">节点详情</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    ></div>
                    <span className="font-medium">{selectedNode.label}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>类型: {selectedNode.type}</div>
                    <div>ID: {selectedNode.id}</div>
                    <div>连接数: {localGraphData.edges.filter(e => 
                      e.from === selectedNode.id || e.to === selectedNode.id
                    ).length}</div>
                  </div>
                </div>

                {/* 节点内容预览 */}
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">内容预览</h4>
                  <div className="text-sm text-gray-600">
                    {selectedNode.type === 'text' && selectedNode.block.content.text}
                    {selectedNode.type === 'field' && (
                      <div>
                        <div>标签: {selectedNode.block.content.label}</div>
                        <div>值: {selectedNode.block.content.value || '未填写'}</div>
                      </div>
                    )}
                    {selectedNode.type === 'table' && (
                      <div>
                        <div>标题: {selectedNode.block.content.title}</div>
                        <div>行数: {selectedNode.block.content.data?.length || 0}</div>
                      </div>
                    )}
                    {selectedNode.type === 'reference' && (
                      <div>引用源: {selectedNode.block.content.sourceBlockId}</div>
                    )}
                  </div>
                </div>

                {/* 关联信息 */}
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">关联信息</h4>
                  <div className="space-y-2 text-sm">
                    {localGraphData.edges
                      .filter(e => e.from === selectedNode.id || e.to === selectedNode.id)
                      .map((edge, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600">
                            {edge.from === selectedNode.id ? '引用 →' : '← 被引用'}
                          </span>
                          <span className="text-blue-600">
                            {edge.from === selectedNode.id ? edge.to : edge.from}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <button className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  跳转到块
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-gray-900 mb-4">图谱统计</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">节点统计</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">总节点数:</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">文本块:</span>
                      <span className="font-medium text-blue-600">{stats.text}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">字段块:</span>
                      <span className="font-medium text-green-600">{stats.field}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">表格块:</span>
                      <span className="font-medium text-purple-600">{stats.table}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">引用块:</span>
                      <span className="font-medium text-yellow-600">{stats.reference}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">连接统计</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">总连接数:</span>
                      <span className="font-medium">{stats.connections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">引用关系:</span>
                      <span className="font-medium">{stats.connections}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">操作提示</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• 点击节点查看详情</div>
                    <div>• 拖拽移动视图</div>
                    <div>• 使用工具栏缩放</div>
                    <div>• 切换不同视图模式</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphViewer;