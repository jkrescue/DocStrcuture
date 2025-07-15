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
              title="设置"
            >
              <Settings size={16} />
            </button>
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
                  </div>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ marginBottom: '4px' }}>类型: {selectedNode.type}</div>
                    <div style={{ marginBottom: '4px' }}>ID: {selectedNode.id}</div>
                    <div>连接数: {localGraphData.edges.filter(e => 
                      e.from === selectedNode.id || e.to === selectedNode.id
                    ).length}</div>
                  </div>
                </div>

                {/* 节点内容预览 */}
                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>内容预览</h4>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>
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
                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>关联信息</h4>
                  <div style={{ fontSize: '14px' }}>
                    {localGraphData.edges
                      .filter(e => e.from === selectedNode.id || e.to === selectedNode.id)
                      .map((edge, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: '#4b5563' }}>
                            {edge.from === selectedNode.id ? '引用 →' : '← 被引用'}
                          </span>
                          <span style={{ color: '#2563eb' }}>
                            {edge.from === selectedNode.id ? edge.to : edge.from}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}>
                  跳转到块
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>图谱统计</h3>
              
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
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>连接统计</h4>
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#4b5563' }}>总连接数:</span>
                      <span style={{ fontWeight: '500' }}>{stats.connections}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4b5563' }}>引用关系:</span>
                      <span style={{ fontWeight: '500' }}>{stats.connections}</span>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>操作提示</h4>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>
                    <div style={{ marginBottom: '4px' }}>• 点击节点查看详情</div>
                    <div style={{ marginBottom: '4px' }}>• 拖拽移动视图</div>
                    <div style={{ marginBottom: '4px' }}>• 使用工具栏缩放</div>
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