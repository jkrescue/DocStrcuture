import React, { useState } from 'react';
import { Link, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';

const ReferenceBlock = ({ block, onChange, editable = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [syncStatus, setSyncStatus] = useState(block.content?.syncStatus || 'synced');
  
  const sourceBlockId = block.content?.sourceBlockId;
  const sourceContent = block.content?.sourceContent;
  const sourceType = block.content?.sourceType;
  const lastSyncTime = block.content?.lastSyncTime || new Date().toISOString();

  // 模拟源内容变更检测
  const hasSourceChanged = syncStatus === 'outdated';

  const handleSync = () => {
    setSyncStatus('syncing');
    
    // 模拟同步过程
    setTimeout(() => {
      setSyncStatus('synced');
      onChange?.({
        content: {
          ...block.content,
          lastSyncTime: new Date().toISOString(),
          syncStatus: 'synced'
        },
        metadata: {
          ...block.metadata,
          updatedAt: new Date().toISOString()
        }
      });
    }, 1000);
  };

  const handleIgnoreChanges = () => {
    setSyncStatus('ignored');
    onChange?.({
      content: {
        ...block.content,
        syncStatus: 'ignored'
      },
      metadata: {
        ...block.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const handleJumpToSource = () => {
    // 模拟跳转到源块
    console.log('跳转到源块:', sourceBlockId);
    // 实际项目中可以通过路由或滚动定位到源块
  };

  const getSyncStatusConfig = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: Link,
          text: '已同步'
        };
      case 'outdated':
        return {
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: AlertTriangle,
          text: '需要同步'
        };
      case 'syncing':
        return {
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: RefreshCw,
          text: '同步中...'
        };
      case 'ignored':
        return {
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: Link,
          text: '已忽略'
        };
      default:
        return {
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: Link,
          text: '未知状态'
        };
    }
  };

  const statusConfig = getSyncStatusConfig();
  const StatusIcon = statusConfig.icon;

  const renderSourceContent = () => {
    if (!sourceContent) {
      return <div className="text-gray-500 italic">引用内容不可用</div>;
    }

    switch (sourceType) {
      case 'text':
        const text = sourceContent.text || '';
        const isHeading = text.startsWith('#');
        return (
          <div className={`${isHeading ? 'font-bold text-lg' : ''}`}>
            {text || '空文本块'}
          </div>
        );
      
      case 'field':
        return (
          <div className="space-y-1">
            <div className="font-medium">{sourceContent.label || '字段'}</div>
            <div className="text-gray-600">
              {sourceContent.value || '无值'}
            </div>
          </div>
        );
      
      case 'table':
        const tableData = sourceContent.data || [];
        return (
          <div className="space-y-2">
            <div className="font-medium">表格数据</div>
            <div className="text-sm text-gray-600">
              {tableData.length} 行 × {tableData[0]?.length || 0} 列
            </div>
            {tableData.length > 0 && (
              <div className="text-xs bg-gray-100 p-2 rounded">
                预览: {tableData[0]?.join(', ')}...
              </div>
            )}
          </div>
        );
      
      default:
        return <div className="text-gray-500">未知内容类型</div>;
    }
  };

  return (
    <div className="reference-block group relative border-l-2 border-transparent hover:border-indigo-200 pl-4 transition-colors">
      {/* 块类型指示器 */}
      <div className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link size={16} className="text-indigo-500" />
      </div>

      <div className={`${statusConfig.bg} ${statusConfig.border} border-2 p-4 rounded-lg transition-all`}>
        {/* 引用头部 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <StatusIcon 
              size={16} 
              className={`${statusConfig.color} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} 
            />
            <span className="font-medium text-gray-800">引用块</span>
            <span className={`text-xs px-2 py-1 rounded ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.text}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={handleJumpToSource}
              className="p-1 text-indigo-600 hover:bg-indigo-100 rounded"
              title="跳转到源块"
            >
              <ExternalLink size={14} />
            </button>
            
            {hasSourceChanged && editable && (
              <>
                <button
                  onClick={handleSync}
                  disabled={syncStatus === 'syncing'}
                  className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  同步
                </button>
                <button
                  onClick={handleIgnoreChanges}
                  className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  忽略
                </button>
              </>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-500 hover:bg-gray-200 rounded"
              title={isExpanded ? '收起' : '展开'}
            >
              <span className="text-xs">{isExpanded ? '−' : '+'}</span>
            </button>
          </div>
        </div>

        {/* 引用源信息 */}
        <div className="text-xs text-gray-500 mb-2">
          源块 ID: {sourceBlockId} • 类型: {sourceType} • 
          最后同步: {new Date(lastSyncTime).toLocaleString()}
        </div>

        {/* 引用内容预览 */}
        <div 
          className={`
            bg-white p-3 rounded border
            ${!isExpanded ? 'cursor-pointer hover:shadow-sm' : ''}
          `}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          {isExpanded ? (
            renderSourceContent()
          ) : (
            <div className="text-gray-600 line-clamp-2">
              {sourceContent?.text?.substring(0, 100) || 
               sourceContent?.label || 
               '点击展开查看引用内容...'}
              {(sourceContent?.text?.length > 100) && '...'}
            </div>
          )}
        </div>

        {/* 差异提示 */}
        {hasSourceChanged && (
          <div className="mt-2 p-2 bg-orange-100 border border-orange-200 rounded text-sm">
            <div className="flex items-center space-x-1 text-orange-700">
              <AlertTriangle size={12} />
              <span>源内容已更新，建议同步最新版本</span>
            </div>
          </div>
        )}

        {/* 引用统计 */}
        <div className="mt-2 text-xs text-gray-400">
          引用创建于 {new Date(block.metadata?.createdAt || Date.now()).toLocaleString()}
        </div>
      </div>

      {/* 块状态指示器 */}
      {block.metadata?.locked && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
          已锁定
        </div>
      )}
    </div>
  );
};

export default ReferenceBlock;