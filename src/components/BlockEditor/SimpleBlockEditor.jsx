import React, { useState, useRef } from 'react';
import { GripVertical, Plus } from 'lucide-react';
import BlockToolbar from './BlockToolbar';
import TextBlock from './TextBlock';
import FieldBlock from './FieldBlock';
import TableBlock from './TableBlock';
import ReferenceBlock from './ReferenceBlock';

const SimpleBlockEditor = ({ blocks = [], onBlocksChange, editable = true }) => {
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(-1);
  const editorRef = useRef(null);

  // 块类型映射
  const blockComponents = {
    text: TextBlock,
    field: FieldBlock,
    table: TableBlock,
    reference: ReferenceBlock,
  };

  // 添加新块
  const addBlock = (type, insertIndex = blocks.length) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    const newBlocks = [...blocks];
    newBlocks.splice(insertIndex, 0, newBlock);
    onBlocksChange(newBlocks);
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case 'text':
        return { text: '开始输入...' };
      case 'field':
        return { fieldType: 'text', label: '新字段', value: '', required: false };
      case 'table':
        return { title: '新表格', data: [['列1', '列2'], ['', '']] };
      case 'reference':
        return { sourceBlockId: null, sourceContent: null, sourceType: null };
      default:
        return {};
    }
  };

  // 更新块内容
  const updateBlock = (blockId, updates) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId
        ? {
            ...block,
            ...updates,
            metadata: {
              ...block.metadata,
              updatedAt: new Date().toISOString(),
              ...updates.metadata
            }
          }
        : block
    );
    onBlocksChange(newBlocks);
  };

  // 删除块
  const deleteBlock = (blockId) => {
    const newBlocks = blocks.filter(block => block.id !== blockId);
    onBlocksChange(newBlocks);
    setSelectedBlockId(null);
    setHoveredBlockId(null);
  };

  // 复制块
  const duplicateBlock = (blockId) => {
    const sourceBlock = blocks.find(b => b.id === blockId);
    if (!sourceBlock) return;

    const newBlock = {
      ...sourceBlock,
      id: `block_${Date.now()}`,
      metadata: {
        ...sourceBlock.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    const sourceIndex = blocks.findIndex(b => b.id === blockId);
    const newBlocks = [...blocks];
    newBlocks.splice(sourceIndex + 1, 0, newBlock);
    onBlocksChange(newBlocks);
  };

  // 简单拖拽处理
  const handleDragStart = (e, blockId) => {
    setDraggedBlockId(blockId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedBlockId(null);
    setDropTargetIndex(-1);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetIndex(index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    if (!draggedBlockId) return;

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlockId);
    if (draggedIndex === -1 || draggedIndex === targetIndex) return;

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    
    // 调整目标索引
    const adjustedIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
    newBlocks.splice(adjustedIndex, 0, draggedBlock);
    
    onBlocksChange(newBlocks);
    setDropTargetIndex(-1);
  };

  // 处理块鼠标事件
  const handleBlockMouseEnter = (e, blockId) => {
    if (!editable) return;
    
    setHoveredBlockId(blockId);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const editorRect = editorRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    
    setToolbarPosition({
      x: rect.right - editorRect.left - 200,
      y: rect.top - editorRect.top - 10
    });
  };

  const handleBlockMouseLeave = () => {
    if (!editable) return;
    setHoveredBlockId(null);
  };

  const handleBlockClick = (blockId) => {
    setSelectedBlockId(blockId);
  };

  // 渲染块
  const renderBlock = (block, index) => {
    const BlockComponent = blockComponents[block.type];
    if (!BlockComponent) {
      return (
        <div key={block.id} style={{ padding: '8px', color: '#ef4444' }}>
          未知块类型: {block.type}
        </div>
      );
    }

    const isHovered = hoveredBlockId === block.id;
    const isSelected = selectedBlockId === block.id;
    const isDragged = draggedBlockId === block.id;

    return (
      <div key={block.id}>
        {/* 拖拽目标指示器 */}
        {dropTargetIndex === index && (
          <div
            style={{
              height: '2px',
              background: '#3b82f6',
              borderRadius: '1px',
              margin: '4px 0',
              animation: 'pulse 1s infinite'
            }}
          />
        )}
        
        <div
          className={`block-item ${isSelected ? 'block-selected' : ''}`}
          style={{
            position: 'relative',
            margin: '8px 0',
            opacity: isDragged ? 0.5 : 1,
            border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
            borderRadius: '6px',
            padding: '8px',
            transition: 'all 0.2s ease'
          }}
          draggable={editable}
          onDragStart={(e) => handleDragStart(e, block.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onMouseEnter={(e) => handleBlockMouseEnter(e, block.id)}
          onMouseLeave={handleBlockMouseLeave}
          onClick={() => handleBlockClick(block.id)}
        >
          {/* 拖拽手柄 */}
          {editable && isHovered && (
            <div
              style={{
                position: 'absolute',
                left: '-24px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'grab',
                color: '#9ca3af',
                padding: '4px'
              }}
            >
              <GripVertical size={16} />
            </div>
          )}

          <BlockComponent
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
            editable={editable}
          />
        </div>
      </div>
    );
  };

  return (
    <div ref={editorRef} className="block-editor" style={{ position: 'relative' }}>
      {/* 工具栏 */}
      {editable && hoveredBlockId && (
        <div
          style={{
            position: 'absolute',
            left: toolbarPosition.x,
            top: toolbarPosition.y,
            zIndex: 50
          }}
        >
          <BlockToolbar
            onDuplicate={() => duplicateBlock(hoveredBlockId)}
            onDelete={() => deleteBlock(hoveredBlockId)}
            onCreateReference={() => {
              // TODO: 实现引用创建
              console.log('创建引用', hoveredBlockId);
            }}
          />
        </div>
      )}

      {/* 添加块按钮 */}
      {editable && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => addBlock('text')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <Plus size={14} />
              文本
            </button>
            
            <button
              onClick={() => addBlock('field')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <Plus size={14} />
              字段
            </button>
            
            <button
              onClick={() => addBlock('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <Plus size={14} />
              表格
            </button>
          </div>
        </div>
      )}

      {/* 块列表 */}
      <div>
        {blocks.map((block, index) => renderBlock(block, index))}
        
        {/* 最后的拖拽目标 */}
        {dropTargetIndex === blocks.length && (
          <div
            style={{
              height: '2px',
              background: '#3b82f6',
              borderRadius: '1px',
              margin: '4px 0',
              animation: 'pulse 1s infinite'
            }}
          />
        )}
        
        {/* 空状态 */}
        {blocks.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9ca3af',
              border: '2px dashed #e5e7eb',
              borderRadius: '8px'
            }}
          >
            <p>还没有任何内容块</p>
            {editable && <p>点击上方按钮添加第一个内容块</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleBlockEditor;
