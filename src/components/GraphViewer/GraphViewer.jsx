import React, { useState, useEffect, useRef } from 'react';
import { Network, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Settings } from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const GraphViewer = ({ onClose }) => {
  const { blocks, getReferences, graphData } = useDocStore();
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('references'); // 'references', 'hierarchy', 'timeline'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
      block: block
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
            color: '#3b82f6'
          });
        }
      }
    });

    return { nodes, edges };
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

    // 绘制连接线
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    localGraphData.edges.forEach(edge => {
      const fromNode = localGraphData.nodes.find(n => n.id === edge.from);
      const toNode = localGraphData.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = edge.color;
        ctx.stroke();

        // 绘制箭头
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(toNode.x - arrowLength * Math.cos(angle - Math.PI / 6), 
                   toNode.y - arrowLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toNode.x, toNode.y);
        ctx.lineTo(toNode.x - arrowLength * Math.cos(angle + Math.PI / 6), 
                   toNode.y - arrowLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
    });

    // 绘制节点
    localGraphData.nodes.forEach(node => {
      // 节点圆圈
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // 选中状态
      if (selectedNode?.id === node.id) {
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // 节点标签
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + node.size / 2 + 15);
    });

    ctx.restore();
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