import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Network, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Settings, Search, Filter, Layout, Focus, RefreshCw } from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const GraphViewer = ({ onClose }) => {
  const { blocks, getReferences } = useDocStore();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [viewMode, setViewMode] = useState('references');
  const [layoutType, setLayoutType] = useState('force');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [localGraphData, setLocalGraphData] = useState({ nodes: [], edges: [] });

  // 获取节点标签
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

  // 获取节点大小
  const getNodeSize = (block) => {
    const baseSize = 40;
    const references = getReferences(block.id);
    return Math.max(baseSize, baseSize + references.length * 3);
  };

  // 获取节点颜色
  const getNodeColor = (type) => {
    const colors = {
      text: '#3b82f6',
      field: '#10b981',
      table: '#8b5cf6',
      reference: '#f59e0b'
    };
    return colors[type] || '#6b7280';
  };

  // 获取节点图标
  const getNodeIcon = (type) => {
    const icons = {
      text: '📝',
      field: '🏷️',
      table: '📊',
      reference: '🔗'
    };
    return icons[type] || '📄';
  };

  // 颜色变亮函数
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const B = (num >> 8 & 0x00FF) + amt;
    const G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
  };

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

  // 绘制图谱
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

  // 事件处理
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

  const handleCanvasMouseMove = (event) => {
    if (isDragging) {
      setPanOffset({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      });
    } else {
      // 检查悬停的节点
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left - panOffset.x) / zoomLevel;
      const y = (event.clientY - rect.top - panOffset.y) / zoomLevel;

      const hoveredNode = localGraphData.nodes.find(node => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        return distance <= node.size / 2;
      });

      setHoveredNode(hoveredNode || null);
      
      // 改变鼠标样式
      const canvasEl = canvasRef.current;
      if (canvasEl) {
        canvasEl.style.cursor = hoveredNode ? 'pointer' : (isDragging ? 'grabbing' : 'grab');
      }
    }
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - panOffset.x, y: event.clientY - panOffset.y });
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
    setHoveredNode(null);
  };

  const refreshLayout = () => {
    const newGraphData = generateGraphData();
    setLocalGraphData(newGraphData);
  };

  // 获取统计信息
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

  // 过滤后的节点
  const filteredNodes = localGraphData.nodes.filter(node => 
    !searchTerm || node.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 初始化和更新
  useEffect(() => {
    const newGraphData = generateGraphData();
    setLocalGraphData(newGraphData);
  }, [generateGraphData]);

  useEffect(() => {
    if (animationEnabled) {
      const animate = () => {
        drawGraph();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      drawGraph();
    }
  }, [drawGraph, animationEnabled]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-5/6 flex overflow-hidden">
        {/* 主图谱区域 */}
        <div className="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100">
          {/* 顶部工具栏 */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Network className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">关系图谱</h2>
                </div>
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {filteredNodes.length}/{stats.total} 个节点 • {stats.connections} 个连接
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* 搜索框 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="搜索节点..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-48 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* 布局选择 */}
                <select 
                  value={layoutType} 
                  onChange={(e) => setLayoutType(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="force">力导向</option>
                  <option value="circular">圆形</option>
                  <option value="hierarchical">层次</option>
                  <option value="grid">网格</option>
                </select>

                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* 左侧工具栏 */}
          <div className="absolute top-20 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 space-y-2">
            <button
              onClick={() => handleZoom(0.1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="放大"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="缩小"
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={resetView}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="重置视图"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={refreshLayout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="刷新布局"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="显示设置"
            >
              <Settings size={18} />
            </button>
          </div>

          {/* 视图模式切换 */}
          <div className="absolute top-20 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-1">
            <div className="flex space-x-1">
              {[
                { id: 'references', name: '引用关系', icon: '🔗' },
                { id: 'hierarchy', name: '层级结构', icon: '🌳' },
                { id: 'timeline', name: '时间线', icon: '⏰' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center space-x-1 ${
                    viewMode === mode.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span>{mode.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 画布 */}
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ marginTop: '80px' }}
          />

          {/* 图例 */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Filter size={16} className="mr-2" />
              图例
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>文本块 ({stats.text})</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>字段块 ({stats.field})</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span>表格块 ({stats.table})</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>引用块 ({stats.reference})</span>
              </div>
            </div>
          </div>

          {/* 缩放信息 */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 text-sm text-gray-600">
            缩放: {Math.round(zoomLevel * 100)}%
          </div>
        </div>

        {/* 右侧信息面板 */}
        <div className="w-80 border-l bg-white overflow-y-auto">
          {selectedNode ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">节点详情</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 节点基本信息 */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: selectedNode.color }}
                    >
                      {getNodeIcon(selectedNode.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedNode.label}</h4>
                      <p className="text-sm text-gray-600">{selectedNode.type} 类型</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{selectedNode.connections}</div>
                      <div className="text-gray-600">连接数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{selectedNode.size}</div>
                      <div className="text-gray-600">节点大小</div>
                    </div>
                  </div>
                </div>

                {/* 节点内容预览 */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">内容预览</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    {selectedNode.type === 'text' && (
                      <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                        <p className="text-gray-800">{selectedNode.block.content.text}</p>
                      </div>
                    )}
                    {selectedNode.type === 'field' && (
                      <div className="bg-white p-3 rounded border-l-4 border-green-400">
                        <div className="space-y-1">
                          <div><span className="font-medium">标签:</span> {selectedNode.block.content.label}</div>
                          <div><span className="font-medium">值:</span> {selectedNode.block.content.value || '未填写'}</div>
                        </div>
                      </div>
                    )}
                    {selectedNode.type === 'table' && (
                      <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                        <div className="space-y-1">
                          <div><span className="font-medium">标题:</span> {selectedNode.block.content.title}</div>
                          <div><span className="font-medium">行数:</span> {selectedNode.block.content.data?.length || 0}</div>
                        </div>
                      </div>
                    )}
                    {selectedNode.type === 'reference' && (
                      <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                        <div><span className="font-medium">引用源:</span> {selectedNode.block.content.sourceBlockId}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 关联信息 */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">关联关系</h4>
                  <div className="space-y-2">
                    {localGraphData.edges
                      .filter(e => e.from === selectedNode.id || e.to === selectedNode.id)
                      .map((edge, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="text-sm text-gray-600">
                            {edge.from === selectedNode.id ? '引用 →' : '← 被引用'}
                          </span>
                          <button
                            onClick={() => {
                              const targetNode = localGraphData.nodes.find(n => 
                                n.id === (edge.from === selectedNode.id ? edge.to : edge.from)
                              );
                              setSelectedNode(targetNode);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            {edge.from === selectedNode.id ? edge.to : edge.from}
                          </button>
                        </div>
                      ))
                    }
                    {localGraphData.edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">暂无关联关系</p>
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      // 跳转到对应的块
                      console.log('跳转到块:', selectedNode.id);
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    跳转到块
                  </button>
                  <button 
                    onClick={() => {
                      // 聚焦到节点
                      const canvasEl = canvasRef.current;
                      if (canvasEl) {
                        const rect = canvasEl.getBoundingClientRect();
                        setPanOffset({
                          x: rect.width / 2 - selectedNode.x * zoomLevel,
                          y: rect.height / 2 - selectedNode.y * zoomLevel
                        });
                      }
                    }}
                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    聚焦节点
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">图谱概览</h3>
              
              <div className="space-y-6">
                {/* 统计卡片 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">总节点</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.connections}</div>
                    <div className="text-sm text-gray-600">连接数</div>
                  </div>
                </div>

                {/* 节点类型分布 */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">节点分布</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">文本块</span>
                      </div>
                      <span className="font-medium text-blue-600">{stats.text}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">字段块</span>
                      </div>
                      <span className="font-medium text-green-600">{stats.field}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">表格块</span>
                      </div>
                      <span className="font-medium text-purple-600">{stats.table}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">引用块</span>
                      </div>
                      <span className="font-medium text-yellow-600">{stats.reference}</span>
                    </div>
                  </div>
                </div>

                {/* 操作提示 */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">操作指南</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <span>🖱️</span>
                      <span>点击节点查看详情</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🚀</span>
                      <span>拖拽移动视图</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🔍</span>
                      <span>使用工具栏缩放</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🎨</span>
                      <span>切换不同布局模式</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🔎</span>
                      <span>搜索特定节点</span>
                    </div>
                  </div>
                </div>

                {/* 快速操作 */}
                <div className="space-y-3">
                  <button
                    onClick={refreshLayout}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    刷新布局
                  </button>
                  <button
                    onClick={resetView}
                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    重置视图
                  </button>
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
