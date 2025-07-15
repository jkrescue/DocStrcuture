import React, { useState } from 'react';
import { 
  Copy, 
  Trash2, 
  Move, 
  Link, 
  Plus, 
  MessageCircle, 
  MoreHorizontal,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import clsx from 'clsx';

const BlockToolbar = ({ 
  blockId, 
  position = 'left', 
  onCopy, 
  onDelete, 
  onReference, 
  onComment, 
  onMoveUp, 
  onMoveDown, 
  onInsertBlock,
  visible = false,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = (action, actionFn) => {
    if (actionFn) {
      actionFn(blockId);
    }
  };

  const mainActions = [
    {
      icon: Plus,
      label: '插入块',
      action: () => handleAction('insert', onInsertBlock),
      color: 'text-blue-600 hover:bg-blue-50'
    },
    {
      icon: Copy,
      label: '复制',
      action: () => handleAction('copy', onCopy),
      color: 'text-gray-600 hover:bg-gray-50'
    },
    {
      icon: Link,
      label: '创建引用',
      action: () => handleAction('reference', onReference),
      color: 'text-green-600 hover:bg-green-50'
    },
    {
      icon: MessageCircle,
      label: '添加评论',
      action: () => handleAction('comment', onComment),
      color: 'text-orange-600 hover:bg-orange-50'
    }
  ];

  const secondaryActions = [
    {
      icon: ChevronUp,
      label: '上移',
      action: () => handleAction('moveUp', onMoveUp),
      color: 'text-gray-500 hover:bg-gray-50'
    },
    {
      icon: ChevronDown,
      label: '下移',
      action: () => handleAction('moveDown', onMoveDown),
      color: 'text-gray-500 hover:bg-gray-50'
    },
    {
      icon: Move,
      label: '拖拽',
      action: () => {},
      color: 'text-gray-500 hover:bg-gray-50 cursor-grab'
    },
    {
      icon: Trash2,
      label: '删除',
      action: () => handleAction('delete', onDelete),
      color: 'text-red-600 hover:bg-red-50'
    }
  ];

  if (!visible) return null;

  return (
    <div 
      className={clsx(
        'fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1',
        'transition-all duration-200 ease-in-out',
        position === 'left' ? 'ml-2' : 'mr-2',
        className
      )}
      style={{
        minWidth: '40px'
      }}
    >
      {/* 主要操作按钮 */}
      <div className="flex flex-col space-y-1">
        {mainActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={clsx(
              'p-2 rounded-md transition-colors duration-150',
              'flex items-center justify-center',
              'hover:scale-105 transform',
              action.color
            )}
            title={action.label}
          >
            <action.icon size={16} />
          </button>
        ))}
        
        {/* 更多操作切换按钮 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(
            'p-2 rounded-md transition-colors duration-150',
            'flex items-center justify-center',
            'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          )}
          title="更多操作"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* 扩展操作面板 */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex flex-col space-y-1">
            {secondaryActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={clsx(
                  'p-2 rounded-md transition-colors duration-150',
                  'flex items-center justify-center',
                  'hover:scale-105 transform',
                  action.color
                )}
                title={action.label}
              >
                <action.icon size={16} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 工具栏指示器 */}
      <div 
        className={clsx(
          'absolute top-1/2 transform -translate-y-1/2',
          'w-1 h-6 bg-blue-400 rounded-full',
          position === 'left' ? '-left-1' : '-right-1'
        )}
      />
    </div>
  );
};

export default BlockToolbar;