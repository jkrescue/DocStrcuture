import React, { useState, useRef, useEffect } from 'react';
import { Type, Bold, Italic, List, Quote } from 'lucide-react';

const TextBlock = ({ block, onChange, editable = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.content?.text || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // 自动调整高度
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange?.({
      content: { ...block.content, text: content },
      metadata: {
        ...block.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setContent(block.content?.text || '');
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setContent(value);
    
    // 自动调整高度
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  // 检查是否是标题格式
  const isHeading = content.startsWith('#');
  const headingLevel = content.match(/^#+/)?.[0]?.length || 0;
  const headingText = content.replace(/^#+\s*/, '');

  return (
    <div className="text-block group relative border-l-2 border-transparent hover:border-blue-200 pl-4 transition-colors">
      {/* 块类型指示器 */}
      <div className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Type size={16} className="text-gray-400" />
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full p-3 border border-blue-300 rounded-lg resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入文本内容... (支持 # 标题格式)"
            rows={1}
          />
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>回车保存 • Shift+回车换行 • Esc取消</span>
          </div>
        </div>
      ) : (
        <div
          onClick={handleEdit}
          className={`
            p-3 rounded-lg cursor-text transition-all
            ${editable ? 'hover:bg-gray-50 hover:shadow-sm' : ''}
            ${!content ? 'text-gray-400 italic' : ''}
            ${isHeading ? 'font-bold' : ''}
          `}
          style={{
            fontSize: isHeading ? `${Math.max(1.5 - (headingLevel - 1) * 0.2, 1)}rem` : '1rem'
          }}
        >
          {content || '点击编辑文本...'}
        </div>
      )}

      {/* 格式化提示 */}
      {isHeading && !isEditing && (
        <div className="mt-1 text-xs text-blue-600">
          H{headingLevel} 标题
        </div>
      )}

      {/* 字数统计 */}
      {content && !isEditing && (
        <div className="mt-2 text-xs text-gray-400">
          {content.length} 字符
        </div>
      )}

      {/* 块状态指示器 */}
      {block.metadata?.locked && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
          已锁定
        </div>
      )}
    </div>
  );
};

export default TextBlock;