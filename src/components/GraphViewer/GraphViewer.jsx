import React, { useState, useEffect, useRef } from 'react';
import { Network, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Settings } from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const GraphViewer = ({ onClose }) => {
  const { blocks, getReferences, graphData } = useDocStore();
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [viewMode, setViewMode] = useState('references'); // 'references', 'hierarchy', 'timeline'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [highlightPath, setHighlightPath] = useState([]);
  const [filterType, setFilterType] = useState('all');

  // 生成图谱数据
  const generateGraphData = () => {
    const nodes = blocks.map(block => ({
      id: block.id,
      type: block.type,
      label: getNodeLabel(block),
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      size: getNodeSize(block),
      color: getNodeColor(block.type),
      block: block,
      level: getBlockLevel(block),
      importance: getBlockImportance(block)
    }));

    const edges = [];
    
    // 直接引用关系
    blocks.forEach(block => {
      if (block.type === 'reference') {
        const sourceId = block.content.sourceBlockId;
        if (sourceId) {
          edges.push({
            id: `ref-${sourceId}-${block.id}`,
            from: sourceId,
            to: block.id,
            type: 'reference',
            color: '#3b82f6',
            label: '引用',
            weight: 3
          });
        }
      }
    });

    // 内容相似性关系
    blocks.forEach((block, i) => {
      blocks.slice(i + 1).forEach(otherBlock => {
        const similarity = calculateContentSimilarity(block, otherBlock);
        if (similarity > 0.3) {
          edges.push({
            id: `sim-${block.id}-${otherBlock.id}`,
            from: block.id,
            to: otherBlock.id,
            type: 'similarity',
            color: '#10b981',
            label: `相似度: ${Math.round(similarity * 100)}%`,
            weight: similarity * 2
          });
        }
      });
    });

    // 字段关联关系
    const fieldBlocks = blocks.filter(b => b.type === 'field');
    fieldBlocks.forEach(field => {
      blocks.forEach(block => {
        if (block.id !== field.id && blockContainsField(block, field)) {
          edges.push({
            id: `field-${field.id}-${block.id}`,
            from: field.id,
            to: block.id,
            type: 'field_usage',
            color: '#8b5cf6',
            label: '字段使用',
            weight: 2
          });
        }
      });
    });

    // 时间序列关系
    const sortedBlocks = [...blocks].sort((a, b) => 
      new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
    );
    sortedBlocks.forEach((block, i) => {
      if (i > 0 && new Date(block.timestamp || 0) - new Date(sortedBlocks[i-1].timestamp || 0) < 3600000) {
        edges.push({
          id: `time-${sortedBlocks[i-1].id}-${block.id}`,
          from: sortedBlocks[i-1].id,
          to: block.id,
          type: 'temporal',
          color: '#f59e0b',
          label: '时间关联',
          weight: 1
        });
      }
    });

    return { nodes, edges };
  };

  // 计算块层级
  const getBlockLevel = (block) => {
    if (block.type === 'reference') return 3;
    if (block.type === 'field') return 1;
    if (block.type === 'table') return 2;
    return 0;
  };

  // 计算块重要性
  const getBlockImportance = (block) => {
    const references = getReferences(block.id);
    const baseScore = block.type === 'text' ? 1 : 
                     block.type === 'field' ? 2 : 
                     block.type === 'table' ? 3 : 1;
    return baseScore + references.length * 0.5;
  };

  // 计算内容相似性
  const calculateContentSimilarity = (block1, block2) => {
    const text1 = getBlockText(block1).toLowerCase();
    const text2 = getBlockText(block2).toLowerCase();
    
    if (!text1 || !text2) return 0;
    
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    const commonWords = words1.filter(word => 
      word.length > 2 && words2.includes(word)
    );
    
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  // 获取块的文本内容
  const getBlockText = (block) => {
    switch (block.type) {
      case 'text': return block.content.text || '';
      case 'field': return `${block.content.label} ${block.content.value || ''}`;
      case 'table': return block.content.title || '';
      case 'reference': return block.content.description || '';
      default: return '';
    }
  };

  // 检查块是否包含字段
  const blockContainsField = (block, fieldBlock) => {
    const blockText = getBlockText(block).toLowerCase();
    const fieldLabel = fieldBlock.content.label?.toLowerCase() || '';
    return blockText.includes(fieldLabel);
  };

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

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // 设置画布尺寸
    canvas.width = rect.width;
    canvas.height = rect.height;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 应用变换
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);

    // 过滤节点和边
    const filteredData = filterGraphData();

    // 绘制连接线
    filteredData.edges.forEach(edge => {
      const fromNode = filteredData.nodes.find(n => n.id === edge.from);
      const toNode = filteredData.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        const isHighlighted = highlightPath.includes(edge.id) || 
                            selectedEdge?.id === edge.id;
        const isConnectedToSelected = selectedNode && 
          (selectedNode.id === edge.from || selectedNode.id === edge.to);

        // 设置线条样式
        ctx.strokeStyle = isHighlighted ? '#ef4444' : 
                         isConnectedToSelected ? edge.color : 
                         `${edge.color}80`;
        ctx.lineWidth = isHighlighted ? 3 : 
                       isConnectedToSelected ? 2 : 
                       edge.weight || 1;

        // 绘制连接线
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        
        // 使用贝塞尔曲线让线条更美观
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        const controlOffset = 30;
        
        if (edge.type === 'reference') {
          ctx.lineTo(toNode.x, toNode.y);
        } else {
          ctx.quadraticCurveTo(
            midX + controlOffset * (Math.random() - 0.5),
            midY + controlOffset * (Math.random() - 0.5),
            toNode.x, toNode.y
          );
        }
        ctx.stroke();

        // 绘制箭头
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const arrowLength = 12;
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

        // 绘制边标签
        if (isHighlighted || isConnectedToSelected) {
          ctx.fillStyle = '#1f2937';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(edge.label || edge.type, midX, midY - 5);
        }
      }
    });

    // 绘制节点
    filteredData.nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const isConnectedToSelected = selectedNode && filteredData.edges.some(e => 
        (e.from === selectedNode.id && e.to === node.id) ||
        (e.to === selectedNode.id && e.from === node.id)
      );

      // 绘制节点光环（选中或悬停时）
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size / 2 + 8, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#3b82f620' : '#6b728020';
        ctx.fill();
      }

      // 绘制连接线高亮
      if (isConnectedToSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size / 2 + 4, 0, 2 * Math.PI);
        ctx.fillStyle = `${node.color}40`;
        ctx.fill();
      }

      // 节点主体
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);
      
      // 渐变填充
      const gradient = ctx.createRadialGradient(
        node.x - node.size / 4, node.y - node.size / 4, 0,
        node.x, node.y, node.size / 2
      );
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(1, node.color + '80');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 节点边框
      if (isSelected) {
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (isHovered) {
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 重要性指示器
      if (node.importance > 3) {
        ctx.beginPath();
        ctx.arc(node.x + node.size / 3, node.y - node.size / 3, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      }

      // 节点标签
      ctx.fillStyle = '#1f2937';
      ctx.font = `${Math.max(10, 12 * zoomLevel)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + node.size / 2 + 15);

      // 节点类型图标
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const icon = getNodeIcon(node.type);
      ctx.fillText(icon, node.x, node.y + 4);
    });

    ctx.restore();
  };

  // 过滤图谱数据
  const filterGraphData = () => {
    let nodes = localGraphData.nodes;
    let edges = localGraphData.edges;

    // 按类型过滤
    if (filterType !== 'all') {
      nodes = nodes.filter(node => node.type === filterType);
      const nodeIds = new Set(nodes.map(n => n.id));
      edges = edges.filter(edge => nodeIds.has(edge.from) && nodeIds.has(edge.to));
    }

    // 按视图模式调整布局
    if (viewMode === 'hierarchy') {
      nodes = nodes.map(node => ({
        ...node,
        y: 100 + node.level * 150,
        x: 100 + (nodes.filter(n => n.level === node.level).indexOf(node)) * 120
      }));
    } else if (viewMode === 'timeline') {
      const sortedNodes = [...nodes].sort((a, b) => 
        new Date(a.block.timestamp || 0) - new Date(b.block.timestamp || 0)
      );
      nodes = sortedNodes.map((node, i) => ({
        ...node,
        x: 100 + i * 150,
        y: 200
      }));
    }

    return { nodes, edges };
  };

  // 获取节点图标
  const getNodeIcon = (type) => {
    const icons = {
      text: 'T',
      field: 'F',
      table: '⊞',
      reference: '→'
    };
    return icons[type] || '?';
  };

  useEffect(() => {
    drawGraph();
  }, [localGraphData, zoomLevel, panOffset, selectedNode]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoomLevel;
    const y = (event.clientY - rect.top - panOffset.y) / zoomLevel;

    const filteredData = filterGraphData();

    // 检查是否点击了节点
    const clickedNode = filteredData.nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= node.size / 2;
    });

    // 检查是否点击了边
    const clickedEdge = filteredData.edges.find(edge => {
      const fromNode = filteredData.nodes.find(n => n.id === edge.from);
      const toNode = filteredData.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return false;

      const distToLine = distanceToLineSegment(x, y, fromNode.x, fromNode.y, toNode.x, toNode.y);
      return distToLine < 10;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      setSelectedEdge(null);
      // 高亮关联路径
      highlightConnectedPath(clickedNode.id);
    } else if (clickedEdge) {
      setSelectedEdge(clickedEdge);
      setSelectedNode(null);
      setHighlightPath([clickedEdge.id]);
    } else {
      setSelectedNode(null);
      setSelectedEdge(null);
      setHighlightPath([]);
    }
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoomLevel;
    const y = (event.clientY - rect.top - panOffset.y) / zoomLevel;

    if (draggedNode) {
      // 拖拽节点
      setLocalGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => 
          node.id === draggedNode.id 
            ? { ...node, x, y }
            : node
        )
      }));
    } else if (isDragging) {
      // 拖拽画布
      setPanOffset({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      });
    } else {
      // 悬停检测
      const filteredData = filterGraphData();
      const hoveredNode = filteredData.nodes.find(node => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        return distance <= node.size / 2;
      });
      setHoveredNode(hoveredNode || null);
      
      // 更新光标样式
      canvas.style.cursor = hoveredNode ? 'pointer' : isDragging ? 'grabbing' : 'grab';
    }
  };

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoomLevel;
    const y = (event.clientY - rect.top - panOffset.y) / zoomLevel;

    const filteredData = filterGraphData();
    const clickedNode = filteredData.nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= node.size / 2;
    });

    if (clickedNode) {
      setDraggedNode(clickedNode);
    } else {
      setIsDragging(true);
      setDragStart({ x: event.clientX - panOffset.x, y: event.clientY - panOffset.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  // 高亮连接路径
  const highlightConnectedPath = (nodeId) => {
    const paths = findAllPaths(nodeId);
    setHighlightPath(paths);
  };

  // 查找所有路径
  const findAllPaths = (startNodeId, visited = new Set(), depth = 0) => {
    if (depth > 3) return []; // 限制深度避免无限循环
    
    visited.add(startNodeId);
    const paths = [];
    
    localGraphData.edges.forEach(edge => {
      let targetId = null;
      let edgeInPath = false;
      
      if (edge.from === startNodeId && !visited.has(edge.to)) {
        targetId = edge.to;
        edgeInPath = true;
      } else if (edge.to === startNodeId && !visited.has(edge.from)) {
        targetId = edge.from;
        edgeInPath = true;
      }
      
      if (edgeInPath) {
        paths.push(edge.id);
        const subPaths = findAllPaths(targetId, new Set(visited), depth + 1);
        paths.push(...subPaths);
      }
    });
    
    return paths;
  };

  // 计算点到线段的距离
  const distanceToLineSegment = (px, py, x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
    const projection_x = x1 + t * dx;
    const projection_y = y1 + t * dy;
    
    return Math.sqrt((px - projection_x) ** 2 + (py - projection_y) ** 2);
  };

  const handleZoom = (delta) => {
    const newZoom = Math.max(0.1, Math.min(3, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNode(null);
    setSelectedEdge(null);
    setHighlightPath([]);
    setHoveredNode(null);
    // 重新生成图谱数据，重置节点位置
    setLocalGraphData(generateGraphData());
  };

  const analyzeGraph = () => {
    const analysis = {
      totalNodes: localGraphData.nodes.length,
      totalEdges: localGraphData.edges.length,
      nodeTypes: {},
      edgeTypes: {},
      centralNodes: [],
      isolatedNodes: [],
      clusters: []
    };

    // 分析节点类型分布
    localGraphData.nodes.forEach(node => {
      analysis.nodeTypes[node.type] = (analysis.nodeTypes[node.type] || 0) + 1;
    });

    // 分析边类型分布
    localGraphData.edges.forEach(edge => {
      analysis.edgeTypes[edge.type] = (analysis.edgeTypes[edge.type] || 0) + 1;
    });

    // 找出中心节点（连接数最多的节点）
    const nodeConnections = {};
    localGraphData.edges.forEach(edge => {
      nodeConnections[edge.from] = (nodeConnections[edge.from] || 0) + 1;
      nodeConnections[edge.to] = (nodeConnections[edge.to] || 0) + 1;
    });

    analysis.centralNodes = Object.entries(nodeConnections)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([nodeId, connections]) => {
        const node = localGraphData.nodes.find(n => n.id === nodeId);
        return { node: node?.label || nodeId, connections };
      });

    // 找出孤立节点
    const connectedNodes = new Set();
    localGraphData.edges.forEach(edge => {
      connectedNodes.add(edge.from);
      connectedNodes.add(edge.to);
    });
    
    analysis.isolatedNodes = localGraphData.nodes
      .filter(node => !connectedNodes.has(node.id))
      .map(node => node.label);

    console.log('图谱分析结果:', analysis);
    alert(`图谱分析完成！
总节点: ${analysis.totalNodes}
总连接: ${analysis.totalEdges}
中心节点: ${analysis.centralNodes.map(n => `${n.node}(${n.connections})`).join(', ')}
孤立节点: ${analysis.isolatedNodes.length}个`);
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

  // 获取节点关系
  const getNodeRelationships = (nodeId) => {
    const relationships = [];
    
    localGraphData.edges.forEach(edge => {
      if (edge.from === nodeId) {
        const targetNode = localGraphData.nodes.find(n => n.id === edge.to);
        relationships.push({
          targetId: edge.to,
          targetLabel: targetNode?.label || edge.to,
          type: edge.type,
          description: edge.label || '关联',
          direction: 'outgoing'
        });
      } else if (edge.to === nodeId) {
        const targetNode = localGraphData.nodes.find(n => n.id === edge.from);
        relationships.push({
          targetId: edge.from,
          targetLabel: targetNode?.label || edge.from,
          type: edge.type,
          description: edge.label || '关联',
          direction: 'incoming'
        });
      }
    });

    return relationships;
  };

  // 获取直接影响范围
  const getDirectInfluence = (nodeId) => {
    return localGraphData.edges.filter(edge => 
      edge.from === nodeId || edge.to === nodeId
    ).length;
  };

  // 获取间接影响范围
  const getIndirectInfluence = (nodeId, visited = new Set(), depth = 0) => {
    if (depth > 2) return 0;
    
    visited.add(nodeId);
    let count = 0;
    
    localGraphData.edges.forEach(edge => {
      let nextNodeId = null;
      if (edge.from === nodeId && !visited.has(edge.to)) {
        nextNodeId = edge.to;
      } else if (edge.to === nodeId && !visited.has(edge.from)) {
        nextNodeId = edge.from;
      }
      
      if (nextNodeId) {
        count += 1 + getIndirectInfluence(nextNodeId, new Set(visited), depth + 1);
      }
    });
    
    return count;
  };

  // 获取影响深度
  const getInfluenceDepth = (nodeId, visited = new Set(), depth = 0) => {
    if (visited.has(nodeId) || depth > 5) return depth;
    
    visited.add(nodeId);
    let maxDepth = depth;
    
    localGraphData.edges.forEach(edge => {
      let nextNodeId = null;
      if (edge.from === nodeId) {
        nextNodeId = edge.to;
      } else if (edge.to === nodeId) {
        nextNodeId = edge.from;
      }
      
      if (nextNodeId) {
        const childDepth = getInfluenceDepth(nextNodeId, new Set(visited), depth + 1);
        maxDepth = Math.max(maxDepth, childDepth);
      }
    });
    
    return maxDepth;
  };

  // 跳转到节点
  const navigateToNode = (nodeId) => {
    const node = localGraphData.nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      // 将视图中心设置到该节点
      setPanOffset({
        x: canvas.current?.width / 2 - node.x * zoomLevel,
        y: canvas.current?.height / 2 - node.y * zoomLevel
      });
      highlightConnectedPath(nodeId);
    }
  };

  // 聚焦节点
  const focusOnNode = (nodeId) => {
    // 临时只显示相关节点和连接
    const relatedNodes = new Set([nodeId]);
    const relatedEdges = [];
    
    localGraphData.edges.forEach(edge => {
      if (edge.from === nodeId || edge.to === nodeId) {
        relatedNodes.add(edge.from);
        relatedNodes.add(edge.to);
        relatedEdges.push(edge);
      }
    });
    
    // 高亮相关路径
    setHighlightPath(relatedEdges.map(e => e.id));
    
    // 可以考虑添加临时过滤功能
    console.log('聚焦节点:', nodeId, '相关节点数:', relatedNodes.size);
  };

  const stats = getNodeStats();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <div style={{ flex: 1, display: 'flex' }}>
        {/* 主图谱区域 */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#111827', 
                backgroundColor: '#ffffff', 
                padding: '4px 12px', 
                borderRadius: '4px', 
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                margin: 0
              }}>
                引用关系图谱
              </h2>
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '4px 12px', 
                borderRadius: '4px', 
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
                fontSize: '14px', 
                color: '#4b5563' 
              }}>
                {stats.total} 个节点 • {stats.connections} 个连接
              </div>
            </div>
            
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#ffffff',
                color: '#6b7280',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onMouseOver={(e) => e.target.style.color = '#374151'}
              onMouseOut={(e) => e.target.style.color = '#6b7280'}
            >
              ✕
            </button>
          </div>

          {/* 工具栏 */}
          <div style={{ 
            position: 'absolute', 
            top: '64px', 
            left: '16px', 
            zIndex: 10, 
            backgroundColor: '#ffffff', 
            borderRadius: '4px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <button
              onClick={() => handleZoom(0.1)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              title="放大"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              title="缩小"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={resetView}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              title="重置视图"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              title="清除选择"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={analyzeGraph}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              title="图谱分析"
            >
              <Network size={16} />
            </button>
          </div>

          {/* 过滤器 */}
          <div style={{
            position: 'absolute',
            top: '200px',
            left: '16px',
            zIndex: 10,
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '12px',
            minWidth: '120px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>类型过滤</h4>
            {['all', 'text', 'field', 'table', 'reference'].map(type => (
              <label key={type} style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="filter"
                  value={type}
                  checked={filterType === type}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{ marginRight: '6px' }}
                />
                {type === 'all' ? '全部' : 
                 type === 'text' ? '文本' :
                 type === 'field' ? '字段' :
                 type === 'table' ? '表格' : '引用'}
              </label>
            ))}
          </div>

          {/* 视图模式切换 */}
          <div style={{ 
            position: 'absolute', 
            top: '64px', 
            right: '16px', 
            zIndex: 10, 
            backgroundColor: '#ffffff', 
            borderRadius: '4px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            padding: '4px' 
          }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'references', name: '引用关系' },
                { id: 'hierarchy', name: '层级结构' },
                { id: 'timeline', name: '时间线' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  style={{
                    padding: '4px 12px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === mode.id ? '#dbeafe' : 'transparent',
                    color: viewMode === mode.id ? '#1d4ed8' : '#4b5563',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (viewMode !== mode.id) e.target.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseOut={(e) => {
                    if (viewMode !== mode.id) e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>

          {/* 画布 */}
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', cursor: 'move' }}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* 图例 */}
          <div style={{ 
            position: 'absolute', 
            bottom: '16px', 
            left: '16px', 
            backgroundColor: '#ffffff', 
            borderRadius: '4px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            padding: '12px' 
          }}>
            <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>图例</h4>
            <div style={{ fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                <span>文本块</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <span>字段块</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#8b5cf6' }}></div>
                <span>表格块</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                <span>引用块</span>
              </div>
            </div>
          </div>

          {/* 缩放信息 */}
          <div style={{ 
            position: 'absolute', 
            bottom: '16px', 
            right: '16px', 
            backgroundColor: '#ffffff', 
            borderRadius: '4px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            padding: '4px 12px', 
            fontSize: '14px', 
            color: '#4b5563' 
          }}>
            缩放: {Math.round(zoomLevel * 100)}%
          </div>
        </div>

        {/* 右侧信息面板 */}
        <div style={{ width: '320px', borderLeft: '1px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '24px' }}>
          {selectedNode ? (
            <div>
              <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>节点详情</h3>
              
              <div>
                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div 
                      style={{ 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '50%',
                        backgroundColor: selectedNode.color
                      }}
                    ></div>
                    <span style={{ fontWeight: '500' }}>{selectedNode.label}</span>
                    {selectedNode.importance > 3 && (
                      <span style={{ 
                        backgroundColor: '#ef4444', 
                        color: '#ffffff', 
                        fontSize: '10px', 
                        padding: '2px 6px', 
                        borderRadius: '10px' 
                      }}>重要</span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ marginBottom: '4px' }}>类型: {selectedNode.type}</div>
                    <div style={{ marginBottom: '4px' }}>ID: {selectedNode.id}</div>
                    <div style={{ marginBottom: '4px' }}>层级: {selectedNode.level}</div>
                    <div style={{ marginBottom: '4px' }}>重要性: {selectedNode.importance.toFixed(1)}</div>
                    <div>连接数: {localGraphData.edges.filter(e => 
                      e.from === selectedNode.id || e.to === selectedNode.id
                    ).length}</div>
                  </div>
                </div>

                {/* 节点内容预览 */}
                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>内容预览</h4>
                  <div style={{ fontSize: '14px', color: '#4b5563', maxHeight: '100px', overflowY: 'auto' }}>
                    {selectedNode.type === 'text' && (
                      <div>
                        <div style={{ marginBottom: '4px', fontWeight: '500' }}>文本内容:</div>
                        <div>{selectedNode.block.content.text}</div>
                      </div>
                    )}
                    {selectedNode.type === 'field' && (
                      <div>
                        <div>标签: {selectedNode.block.content.label}</div>
                        <div>值: {selectedNode.block.content.value || '未填写'}</div>
                        <div>类型: {selectedNode.block.content.fieldType}</div>
                      </div>
                    )}
                    {selectedNode.type === 'table' && (
                      <div>
                        <div>标题: {selectedNode.block.content.title}</div>
                        <div>行数: {selectedNode.block.content.data?.length || 0}</div>
                        <div>列数: {selectedNode.block.content.columns?.length || 0}</div>
                      </div>
                    )}
                    {selectedNode.type === 'reference' && (
                      <div>
                        <div>引用源: {selectedNode.block.content.sourceBlockId}</div>
                        <div>描述: {selectedNode.block.content.description}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 关联路径追溯 */}
                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>关联追溯</h4>
                  <div style={{ fontSize: '14px' }}>
                    {getNodeRelationships(selectedNode.id).map((rel, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        marginBottom: '8px',
                        padding: '8px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px'
                      }}>
                        <div>
                          <div style={{ fontWeight: '500', color: '#374151' }}>
                            {rel.direction === 'outgoing' ? '→' : '←'} {rel.targetLabel}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>
                            {rel.type} • {rel.description}
                          </div>
                        </div>
                        <button
                          onClick={() => navigateToNode(rel.targetId)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          跳转
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 影响分析 */}
                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>影响分析</h4>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ marginBottom: '4px' }}>
                      直接影响: {getDirectInfluence(selectedNode.id)} 个节点
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      间接影响: {getIndirectInfluence(selectedNode.id)} 个节点
                    </div>
                    <div>
                      影响深度: {getInfluenceDepth(selectedNode.id)} 层
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onClick={() => navigateToNode(selectedNode.id)}>
                    跳转到块
                  </button>
                  <button style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
                  onClick={() => focusOnNode(selectedNode.id)}>
                    聚焦显示
                  </button>
                </div>
              </div>
            </div>
          ) : selectedEdge ? (
            <div>
              <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>连接详情</h3>
              
              <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '500' }}>关系类型:</span> {selectedEdge.type}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '500' }}>权重:</span> {selectedEdge.weight}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '500' }}>描述:</span> {selectedEdge.label}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>源节点</div>
                    <div style={{ fontWeight: '500' }}>
                      {localGraphData.nodes.find(n => n.id === selectedEdge.from)?.label}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>目标节点</div>
                    <div style={{ fontWeight: '500' }}>
                      {localGraphData.nodes.find(n => n.id === selectedEdge.to)?.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>图谱概览</h3>
              
              <div>
                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>节点统计</h4>
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#4b5563' }}>总节点数:</span>
                      <span style={{ fontWeight: '500' }}>{stats.total}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#4b5563' }}>文本块:</span>
                      <span style={{ fontWeight: '500', color: '#2563eb' }}>{stats.text}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#4b5563' }}>字段块:</span>
                      <span style={{ fontWeight: '500', color: '#059669' }}>{stats.field}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#4b5563' }}>表格块:</span>
                      <span style={{ fontWeight: '500', color: '#7c3aed' }}>{stats.table}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4b5563' }}>引用块:</span>
                      <span style={{ fontWeight: '500', color: '#d97706' }}>{stats.reference}</span>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>关系统计</h4>
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#4b5563' }}>总连接数:</span>
                      <span style={{ fontWeight: '500' }}>{stats.connections}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#4b5563' }}>引用关系:</span>
                      <span style={{ fontWeight: '500' }}>
                        {localGraphData.edges.filter(e => e.type === 'reference').length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#4b5563' }}>相似关系:</span>
                      <span style={{ fontWeight: '500' }}>
                        {localGraphData.edges.filter(e => e.type === 'similarity').length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4b5563' }}>时间关系:</span>
                      <span style={{ fontWeight: '500' }}>
                        {localGraphData.edges.filter(e => e.type === 'temporal').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>操作指南</h4>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ marginBottom: '4px' }}>• 点击节点查看详情和追溯关系</div>
                    <div style={{ marginBottom: '4px' }}>• 点击连接线查看关系详情</div>
                    <div style={{ marginBottom: '4px' }}>• 拖拽节点重新布局</div>
                    <div style={{ marginBottom: '4px' }}>• 拖拽空白区域移动视图</div>
                    <div style={{ marginBottom: '4px' }}>• 使用工具栏控制视图</div>
                    <div>• 使用过滤器按类型筛选</div>
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