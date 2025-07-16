import React, { useState, useRef, useCallback } from 'react';
import { 
  GripVertical, Plus, Type, Table, Hash, CheckSquare, Quote, 
  Code, Image, Link2, List, Calendar, Users, Tag, Palette,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  MoreHorizontal, Eye, EyeOff, Copy, Trash2, Move, Settings,
  Upload, ChevronDown, Clock
} from 'lucide-react';
import BlockToolbar from './BlockToolbar';
import TextBlock from './TextBlock';
import FieldBlock from './FieldBlock';
import TableBlock from './TableBlock';
import ReferenceBlock from './ReferenceBlock';
import { 
  DateTimeBlock, 
  SelectBlock, 
  NumberBlock, 
  PersonSelectorBlock, 
  FileUploadBlock, 
  ColorPickerBlock 
} from './AdvancedFormBlocks';
import './AdvancedFormBlocks.css';

// 新增内容块组件
const HeadingBlock = ({ block, onChange, editable }) => {
  const handleChange = (e) => {
    onChange({
      content: {
        ...block.content,
        text: e.target.value
      }
    });
  };

  const level = block.content.level || 1;
  const Tag = `h${level}`;

  return (
    <div style={{ margin: '16px 0' }}>
      {editable && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {[1, 2, 3, 4, 5, 6].map(l => (
            <button
              key={l}
              onClick={() => onChange({ content: { ...block.content, level: l } })}
              style={{
                padding: '4px 8px',
                border: level === l ? '2px solid #3b82f6' : '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: level === l ? '#eff6ff' : 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              H{l}
            </button>
          ))}
        </div>
      )}
      <Tag
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={handleChange}
        style={{
          outline: 'none',
          border: editable ? '1px dashed transparent' : 'none',
          padding: '4px',
          fontSize: level === 1 ? '32px' : level === 2 ? '24px' : level === 3 ? '20px' : '16px',
          fontWeight: '700',
          color: '#111827',
          margin: 0
        }}
      >
        {block.content.text || '标题'}
      </Tag>
    </div>
  );
};

const ChecklistBlock = ({ block, onChange, editable }) => {
  const items = block.content.items || [{ id: '1', text: '新任务', checked: false }];

  const addItem = () => {
    const newItems = [...items, { 
      id: Date.now().toString(), 
      text: '新任务', 
      checked: false 
    }];
    onChange({ content: { ...block.content, items: newItems } });
  };

  const updateItem = (id, updates) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onChange({ content: { ...block.content, items: newItems } });
  };

  const deleteItem = (id) => {
    const newItems = items.filter(item => item.id !== id);
    onChange({ content: { ...block.content, items: newItems } });
  };

  return (
    <div style={{ margin: '16px 0' }}>
      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) => updateItem(item.id, { checked: e.target.checked })}
            disabled={!editable}
            style={{ margin: 0 }}
          />
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateItem(item.id, { text: e.target.value })}
            readOnly={!editable}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '4px',
              textDecoration: item.checked ? 'line-through' : 'none',
              opacity: item.checked ? 0.6 : 1,
              backgroundColor: editable ? '#f9fafb' : 'transparent'
            }}
          />
          {editable && (
            <button
              onClick={() => deleteItem(item.id)}
              style={{
                padding: '2px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#ef4444'
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      {editable && (
        <button
          onClick={addItem}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            border: '1px dashed #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: '12px'
          }}
        >
          <Plus size={12} />
          添加项目
        </button>
      )}
    </div>
  );
};

const QuoteBlock = ({ block, onChange, editable }) => {
  const handleChange = (e) => {
    onChange({
      content: {
        ...block.content,
        text: e.target.value
      }
    });
  };

  return (
    <div style={{
      borderLeft: '4px solid #3b82f6',
      paddingLeft: '16px',
      margin: '16px 0',
      backgroundColor: '#f8fafc',
      padding: '16px'
    }}>
      <textarea
        value={block.content.text || ''}
        onChange={handleChange}
        readOnly={!editable}
        placeholder="引用内容..."
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          resize: 'vertical',
          minHeight: '60px',
          backgroundColor: 'transparent',
          fontSize: '16px',
          fontStyle: 'italic',
          color: '#374151'
        }}
      />
      {block.content.author && (
        <div style={{
          marginTop: '8px',
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'right'
        }}>
          — {block.content.author}
        </div>
      )}
    </div>
  );
};

const CodeBlock = ({ block, onChange, editable }) => {
  const handleChange = (e) => {
    onChange({
      content: {
        ...block.content,
        code: e.target.value
      }
    });
  };

  return (
    <div style={{ margin: '16px 0' }}>
      {editable && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '8px',
          fontSize: '12px'
        }}>
          <span style={{ color: '#6b7280' }}>语言:</span>
          <input
            type="text"
            value={block.content.language || ''}
            onChange={(e) => onChange({ 
              content: { ...block.content, language: e.target.value } 
            })}
            placeholder="javascript"
            style={{
              padding: '2px 6px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
        </div>
      )}
      <pre style={{
        backgroundColor: '#1f2937',
        color: '#f9fafb',
        padding: '16px',
        borderRadius: '8px',
        overflow: 'auto',
        margin: 0
      }}>
        <code>
          <textarea
            value={block.content.code || ''}
            onChange={handleChange}
            readOnly={!editable}
            placeholder="// 输入代码..."
            style={{
              width: '100%',
              minHeight: '100px',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              backgroundColor: 'transparent',
              color: 'inherit',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}
          />
        </code>
      </pre>
    </div>
  );
};

const DividerBlock = ({ block, onChange, editable }) => {
  const style = block.content.style || 'solid';
  
  return (
    <div style={{ margin: '24px 0', textAlign: 'center' }}>
      {editable && (
        <div style={{ marginBottom: '12px' }}>
          {['solid', 'dashed', 'dotted'].map(s => (
            <button
              key={s}
              onClick={() => onChange({ content: { ...block.content, style: s } })}
              style={{
                padding: '4px 8px',
                margin: '0 2px',
                border: style === s ? '2px solid #3b82f6' : '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: style === s ? '#eff6ff' : 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <hr style={{
        border: 'none',
        borderTop: `2px ${style} #e5e7eb`,
        width: '100%'
      }} />
    </div>
  );
};

const SimpleBlockEditorEnhanced = ({ blocks = [], onBlocksChange, editable = true }) => {
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(-1);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showFormattingBar, setShowFormattingBar] = useState(false);
  const editorRef = useRef(null);

  // 扩展的块类型映射
  const blockComponents = {
    text: TextBlock,
    heading: HeadingBlock,
    field: FieldBlock,
    table: TableBlock,
    reference: ReferenceBlock,
    checklist: ChecklistBlock,
    quote: QuoteBlock,
    code: CodeBlock,
    divider: DividerBlock,
    // 高级表单控件
    datetime: DateTimeBlock,
    select: SelectBlock,
    number: NumberBlock,
    person: PersonSelectorBlock,
    fileupload: FileUploadBlock,
    colorpicker: ColorPickerBlock,
  };

  // 块类型定义
  const blockTypes = [
    { type: 'text', label: '文本', icon: Type, description: '普通文本段落' },
    { type: 'heading', label: '标题', icon: Hash, description: '章节标题' },
    { type: 'checklist', label: '清单', icon: CheckSquare, description: '待办事项列表' },
    { type: 'quote', label: '引用', icon: Quote, description: '引用文本块' },
    { type: 'code', label: '代码', icon: Code, description: '代码片段' },
    { type: 'divider', label: '分割线', icon: MoreHorizontal, description: '内容分隔符' },
    { type: 'field', label: '字段', icon: Tag, description: '表单字段' },
    { type: 'table', label: '表格', icon: Table, description: '数据表格' },
    // 高级表单控件
    { type: 'datetime', label: '日期时间', icon: Calendar, description: '日期时间选择器' },
    { type: 'select', label: '下拉选择', icon: ChevronDown, description: '单选或多选下拉菜单' },
    { type: 'number', label: '数字输入', icon: Hash, description: '数值输入控件' },
    { type: 'person', label: '人员选择', icon: Users, description: '人员选择器' },
    { type: 'fileupload', label: '文件上传', icon: Upload, description: '文件上传控件' },
    { type: 'colorpicker', label: '颜色选择', icon: Palette, description: '颜色选择器' },
  ];

  // 添加新块
  const addBlock = useCallback((type, insertIndex = blocks.length) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        visible: true
      }
    };

    const newBlocks = [...blocks];
    newBlocks.splice(insertIndex, 0, newBlock);
    onBlocksChange(newBlocks);
    setShowBlockMenu(false);
  }, [blocks, onBlocksChange]);

  const getDefaultContent = (type) => {
    switch (type) {
      case 'text':
        return { text: '开始输入...' };
      case 'heading':
        return { text: '新标题', level: 1 };
      case 'field':
        return { fieldType: 'text', label: '新字段', value: '', required: false };
      case 'table':
        return { title: '新表格', data: [['列1', '列2'], ['', '']] };
      case 'reference':
        return { sourceBlockId: null, sourceContent: null, sourceType: null };
      case 'checklist':
        return { items: [{ id: '1', text: '新任务', checked: false }] };
      case 'quote':
        return { text: '引用内容...', author: '' };
      case 'code':
        return { code: '// 输入代码...', language: 'javascript' };
      case 'divider':
        return { style: 'solid' };
      // 高级表单控件默认内容
      case 'datetime':
        return { label: '日期时间', value: '', required: false, showTime: true };
      case 'select':
        return { label: '下拉选择', value: '', options: ['选项1', '选项2', '选项3'], multiple: false, required: false };
      case 'number':
        return { label: '数字输入', value: 0, min: null, max: null, step: 1, unit: '', required: false };
      case 'person':
        return { label: '人员选择', value: [], multiple: true, required: false };
      case 'fileupload':
        return { label: '文件上传', files: [], maxFiles: 5, acceptedTypes: '.pdf,.doc,.docx,.png,.jpg,.jpeg', required: false };
      case 'colorpicker':
        return { label: '颜色选择', value: '#4ECDC4', required: false };
      default:
        return {};
    }
  };

  // 更新块内容
  const updateBlock = useCallback((blockId, updates) => {
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
  }, [blocks, onBlocksChange]);

  // 删除块
  const deleteBlock = useCallback((blockId) => {
    const newBlocks = blocks.filter(block => block.id !== blockId);
    onBlocksChange(newBlocks);
    setSelectedBlockId(null);
    setHoveredBlockId(null);
  }, [blocks, onBlocksChange]);

  // 复制块
  const duplicateBlock = useCallback((blockId) => {
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
  }, [blocks, onBlocksChange]);

  // 切换块可见性
  const toggleBlockVisibility = useCallback((blockId) => {
    updateBlock(blockId, {
      metadata: {
        visible: !(blocks.find(b => b.id === blockId)?.metadata?.visible ?? true)
      }
    });
  }, [blocks, updateBlock]);

  // 拖拽处理
  const handleDragStart = (e, blockId) => {
    setDraggedBlockId(blockId);
    e.dataTransfer.effectAllowed = 'move';
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

  // 块菜单组件
  const BlockMenu = () => (
    <div style={{
      position: 'absolute',
      top: '50px',
      left: '0',
      right: '0',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
      padding: '8px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '4px',
      maxWidth: '500px'
    }}>
      {blockTypes.map(blockType => (
        <button
          key={blockType.type}
          onClick={() => addBlock(blockType.type)}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '8px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <blockType.icon size={16} style={{ marginTop: '2px', color: '#6b7280' }} />
          <div>
            <div style={{ fontWeight: '500', fontSize: '14px', color: '#111827' }}>
              {blockType.label}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {blockType.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );

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
    const isVisible = block.metadata?.visible !== false;

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
            opacity: isDragged ? 0.5 : isVisible ? 1 : 0.3,
            border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
            borderRadius: '8px',
            padding: '12px',
            transition: 'all 0.2s ease',
            backgroundColor: isHovered ? '#fafbfc' : 'white'
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
          {/* 拖拽手柄和快速操作 */}
          {editable && isHovered && (
            <div
              style={{
                position: 'absolute',
                left: '-36px',
                top: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div
                style={{
                  cursor: 'grab',
                  color: '#9ca3af',
                  padding: '2px',
                  borderRadius: '2px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb'
                }}
              >
                <GripVertical size={12} />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBlockVisibility(block.id);
                }}
                style={{
                  padding: '2px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '2px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  color: isVisible ? '#6b7280' : '#ef4444'
                }}
              >
                {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
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
    <div ref={editorRef} className="block-editor-enhanced" style={{ position: 'relative' }}>
      {/* 增强工具栏 */}
      {editable && hoveredBlockId && (
        <div
          style={{
            position: 'absolute',
            left: toolbarPosition.x,
            top: toolbarPosition.y,
            zIndex: 50
          }}
        >
          <div style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <button
              onClick={() => duplicateBlock(hoveredBlockId)}
              style={{
                padding: '4px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#6b7280'
              }}
              title="复制块"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => deleteBlock(hoveredBlockId)}
              style={{
                padding: '4px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#ef4444'
              }}
              title="删除块"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 添加块按钮 */}
      {editable && (
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <button
            onClick={() => setShowBlockMenu(!showBlockMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280',
              width: '100%',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.color = '#6b7280';
            }}
          >
            <Plus size={16} />
            添加内容块
          </button>
          
          {showBlockMenu && <BlockMenu />}
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
              padding: '60px 20px',
              color: '#9ca3af',
              border: '2px dashed #e5e7eb',
              borderRadius: '12px',
              backgroundColor: '#fafbfc'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#374151' }}>
              开始创建您的文档
            </h3>
            <p style={{ marginBottom: '20px' }}>
              添加文本、标题、表格等内容块来构建您的文档
            </p>
            {editable && (
              <button
                onClick={() => setShowBlockMenu(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                添加第一个内容块
              </button>
            )}
          </div>
        )}
      </div>

      {/* 点击外部关闭菜单 */}
      {showBlockMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99
          }}
          onClick={() => setShowBlockMenu(false)}
        />
      )}
    </div>
  );
};

export default SimpleBlockEditorEnhanced;
