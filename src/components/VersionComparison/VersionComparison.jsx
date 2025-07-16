import React, { useState, useMemo } from 'react';
import { 
  GitMerge, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  RotateCcw,
  FileText,
  Hash,
  Clock,
  Users,
  GitBranch,
  Download,
  Share2,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import DiffViewer from 'react-diff-viewer-continued';
import { diffLines } from 'diff';
import { useDocStore } from '../../stores/docStore';
import './VersionComparison.css';

const VersionComparison = ({ 
  leftVersion, 
  rightVersion, 
  onClose,
  document 
}) => {
  const { versions } = useDocStore();
  
  // 调试信息
  console.log('VersionComparison rendered', { leftVersion, rightVersion });
  
  // 状态管理
  const [viewMode, setViewMode] = useState('split'); // 'split', 'unified', 'blocks'
  const [showDiffOnly, setShowDiffOnly] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);
  const [showChangeSummary, setShowChangeSummary] = useState(true);
  const [highlightSyntax, setHighlightSyntax] = useState(true);
  const [selectedBlockType, setSelectedBlockType] = useState('all'); // 'all', 'text', 'field', 'table', 'reference'
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    metadata: true,
    blocks: true
  });

  // 计算差异数据
  const comparisonData = useMemo(() => {
    if (!leftVersion || !rightVersion) return null;

    // 获取版本内容
    const leftBlocks = leftVersion.content?.blocks || leftVersion.blocks || [];
    const rightBlocks = rightVersion.content?.blocks || rightVersion.blocks || [];

    // 转换为字符串进行比较
    const leftContent = blocksToString(leftBlocks);
    const rightContent = blocksToString(rightBlocks);

    // 计算差异
    const diff = diffLines(leftContent, rightContent);
    
    // 计算统计信息
    const stats = calculateDiffStats(diff);
    
    // 分析块级变化
    const blockChanges = analyzeBlockChanges(leftBlocks, rightBlocks);

    return {
      diff,
      stats,
      blockChanges,
      leftContent,
      rightContent,
      leftBlocks,
      rightBlocks
    };
  }, [leftVersion, rightVersion]);

  // 辅助函数：将块转换为字符串
  const blocksToString = (blocks) => {
    return blocks.map(block => {
      switch (block.type) {
        case 'text':
          return block.content?.text || '';
        case 'field':
          return `[${block.content?.label}]: ${block.content?.value || ''}`;
        case 'table':
          return formatTableContent(block.content);
        case 'reference':
          return `[引用]: ${block.content?.sourceContent?.label || block.content?.sourceContent?.text || ''}`;
        default:
          return JSON.stringify(block.content);
      }
    }).join('\n\n');
  };

  // 格式化表格内容
  const formatTableContent = (tableContent) => {
    if (!tableContent?.data) return '';
    return tableContent.data.map(row => row.join(' | ')).join('\n');
  };

  // 计算差异统计
  const calculateDiffStats = (diff) => {
    let added = 0, removed = 0, unchanged = 0;
    
    diff.forEach(part => {
      const lines = part.value.split('\n').filter(line => line.trim());
      if (part.added) {
        added += lines.length;
      } else if (part.removed) {
        removed += lines.length;
      } else {
        unchanged += lines.length;
      }
    });

    return { added, removed, unchanged, total: added + removed + unchanged };
  };

  // 分析块级变化
  const analyzeBlockChanges = (leftBlocks, rightBlocks) => {
    const changes = {
      added: [],
      removed: [],
      modified: [],
      unchanged: []
    };

    // 创建块ID映射
    const leftBlockMap = new Map(leftBlocks.map(block => [block.id, block]));
    const rightBlockMap = new Map(rightBlocks.map(block => [block.id, block]));

    // 查找新增、删除和修改的块
    rightBlocks.forEach(rightBlock => {
      const leftBlock = leftBlockMap.get(rightBlock.id);
      if (!leftBlock) {
        changes.added.push(rightBlock);
      } else if (JSON.stringify(leftBlock.content) !== JSON.stringify(rightBlock.content)) {
        changes.modified.push({ left: leftBlock, right: rightBlock });
      } else {
        changes.unchanged.push(rightBlock);
      }
    });

    leftBlocks.forEach(leftBlock => {
      if (!rightBlockMap.has(leftBlock.id)) {
        changes.removed.push(leftBlock);
      }
    });

    return changes;
  };

  // 渲染差异摘要
  const renderChangeSummary = () => (
    <div className="comparison-summary">
      <div className="summary-header">
        <h3>
          <GitMerge size={20} />
          版本对比摘要
        </h3>
        <button 
          className="toggle-btn"
          onClick={() => setExpandedSections(prev => ({ ...prev, summary: !prev.summary }))}
        >
          {expandedSections.summary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {expandedSections.summary && (
        <div className="summary-content">
          <div className="version-info">
            <div className="version-card left">
              <div className="version-header">
                <h4>{leftVersion.description || leftVersion.id}</h4>
                <span className="version-date">
                  {leftVersion.timestamp ? new Date(leftVersion.timestamp).toLocaleDateString() : '未知日期'}
                </span>
              </div>
              <div className="version-meta">
                <span><Users size={14} /> {leftVersion.author}</span>
                <span><GitBranch size={14} /> {leftVersion.branch || 'main'}</span>
              </div>
            </div>
            
            <div className="comparison-arrow">
              <ArrowRight size={24} />
            </div>
            
            <div className="version-card right">
              <div className="version-header">
                <h4>{rightVersion.description || rightVersion.id}</h4>
                <span className="version-date">
                  {rightVersion.timestamp ? new Date(rightVersion.timestamp).toLocaleDateString() : '未知日期'}
                </span>
              </div>
              <div className="version-meta">
                <span><Users size={14} /> {rightVersion.author}</span>
                <span><GitBranch size={14} /> {rightVersion.branch || 'main'}</span>
              </div>
            </div>
          </div>

          {comparisonData && (
            <div className="stats-grid">
              <div className="stat-card added">
                <div className="stat-icon">
                  <Plus size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{comparisonData.blockChanges.added.length}</div>
                  <div className="stat-label">新增块</div>
                </div>
              </div>
              
              <div className="stat-card modified">
                <div className="stat-icon">
                  <FileText size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{comparisonData.blockChanges.modified.length}</div>
                  <div className="stat-label">修改块</div>
                </div>
              </div>
              
              <div className="stat-card removed">
                <div className="stat-icon">
                  <Minus size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{comparisonData.blockChanges.removed.length}</div>
                  <div className="stat-label">删除块</div>
                </div>
              </div>
              
              <div className="stat-card unchanged">
                <div className="stat-icon">
                  <CheckCircle size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{comparisonData.blockChanges.unchanged.length}</div>
                  <div className="stat-label">未变更</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 渲染块级对比
  const renderBlockComparison = () => {
    if (!comparisonData) return null;

    const { blockChanges } = comparisonData;
    const filteredChanges = selectedBlockType === 'all' 
      ? blockChanges 
      : filterChangesByType(blockChanges, selectedBlockType);

    return (
      <div className="block-comparison">
        <div className="comparison-header">
          <h3>
            <Hash size={20} />
            块级变更详情
          </h3>
          <div className="comparison-controls">
            <select 
              value={selectedBlockType} 
              onChange={(e) => setSelectedBlockType(e.target.value)}
              className="block-type-filter"
            >
              <option value="all">所有类型</option>
              <option value="text">文本块</option>
              <option value="field">字段块</option>
              <option value="table">表格块</option>
              <option value="reference">引用块</option>
            </select>
          </div>
        </div>

        {/* 新增的块 */}
        {filteredChanges.added.length > 0 && (
          <div className="change-section added-section">
            <h4><Plus size={16} /> 新增的块 ({filteredChanges.added.length})</h4>
            {filteredChanges.added.map(block => (
              <div key={block.id} className="block-diff added">
                <div className="block-header">
                  <span className="block-type">{block.type}</span>
                  <span className="block-id">{block.id}</span>
                </div>
                <div className="block-content">
                  {renderBlockContent(block)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 删除的块 */}
        {filteredChanges.removed.length > 0 && (
          <div className="change-section removed-section">
            <h4><Minus size={16} /> 删除的块 ({filteredChanges.removed.length})</h4>
            {filteredChanges.removed.map(block => (
              <div key={block.id} className="block-diff removed">
                <div className="block-header">
                  <span className="block-type">{block.type}</span>
                  <span className="block-id">{block.id}</span>
                </div>
                <div className="block-content">
                  {renderBlockContent(block)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 修改的块 */}
        {filteredChanges.modified.length > 0 && (
          <div className="change-section modified-section">
            <h4><FileText size={16} /> 修改的块 ({filteredChanges.modified.length})</h4>
            {filteredChanges.modified.map(({ left, right }) => (
              <div key={left.id} className="block-diff modified">
                <div className="block-header">
                  <span className="block-type">{left.type}</span>
                  <span className="block-id">{left.id}</span>
                </div>
                <div className="block-comparison-split">
                  <div className="block-side left">
                    <h5>修改前</h5>
                    <div className="block-content">
                      {renderBlockContent(left)}
                    </div>
                  </div>
                  <div className="block-side right">
                    <h5>修改后</h5>
                    <div className="block-content">
                      {renderBlockContent(right)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 渲染块内容
  const renderBlockContent = (block) => {
    switch (block.type) {
      case 'text':
        return <div className="text-content">{block.content?.text}</div>;
      case 'field':
        return (
          <div className="field-content">
            <label>{block.content?.label}</label>
            <span>{block.content?.value}</span>
          </div>
        );
      case 'table':
        return (
          <div className="table-content">
            <table>
              <tbody>
                {block.content?.data?.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'reference':
        return (
          <div className="reference-content">
            <span>引用: {block.content?.sourceContent?.label || block.content?.sourceContent?.text}</span>
          </div>
        );
      default:
        return <pre>{JSON.stringify(block.content, null, 2)}</pre>;
    }
  };

  // 过滤变更按类型
  const filterChangesByType = (changes, type) => {
    const filter = (items) => items.filter(item => 
      (item.type || item.left?.type || item.right?.type) === type
    );

    return {
      added: filter(changes.added),
      removed: filter(changes.removed),
      modified: filter(changes.modified),
      unchanged: filter(changes.unchanged)
    };
  };

  // 渲染文本差异
  const renderTextDiff = () => {
    if (!comparisonData) return null;

    const diffViewerProps = {
      oldValue: comparisonData.leftContent,
      newValue: comparisonData.rightContent,
      splitView: viewMode === 'split',
      hideLineNumbers: false,
      showDiffOnly: showDiffOnly,
      useDarkTheme: false,
      leftTitle: `${leftVersion.description || leftVersion.id} (${leftVersion.timestamp ? new Date(leftVersion.timestamp).toLocaleDateString() : '未知'})`,
      rightTitle: `${rightVersion.description || rightVersion.id} (${rightVersion.timestamp ? new Date(rightVersion.timestamp).toLocaleDateString() : '未知'})`,
      renderContent: highlightSyntax ? undefined : (str) => <pre>{str}</pre>
    };

    return (
      <div className="text-diff-container">
        <DiffViewer {...diffViewerProps} />
      </div>
    );
  };

  if (!leftVersion || !rightVersion) {
    console.log('Missing version data:', { leftVersion, rightVersion });
    return (
      <div className="comparison-error" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        color: '#6c757d',
        gap: '16px',
        backgroundColor: 'white'
      }}>
        <AlertCircle size={48} />
        <h3>无法进行版本对比</h3>
        <p>请确保选择了两个有效的版本进行对比</p>
        <p>调试信息: leftVersion={leftVersion ? '存在' : '缺失'}, rightVersion={rightVersion ? '存在' : '缺失'}</p>
        <button onClick={onClose} className="btn btn-primary">
          返回版本列表
        </button>
      </div>
    );
  }

  return (
    <div className="version-comparison" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fafbfc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 顶部工具栏 */}
      <div className="comparison-toolbar" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'white',
        borderBottom: '1px solid #e1e5e9',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}>
        <div className="toolbar-left" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button onClick={onClose} className="btn btn-ghost" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            border: '1px solid transparent',
            borderRadius: '6px',
            background: 'transparent',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <ArrowLeft size={16} />
            返回
          </button>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>版本对比</h2>
        </div>
        
        <div className="toolbar-center" style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div className="view-mode-switcher" style={{
            display: 'flex',
            background: '#f8f9fa',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <button 
              className={viewMode === 'split' ? 'active' : ''}
              onClick={() => setViewMode('split')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: viewMode === 'split' ? '#007bff' : 'transparent',
                color: viewMode === 'split' ? 'white' : '#6c757d',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              分屏对比
            </button>
            <button 
              className={viewMode === 'unified' ? 'active' : ''}
              onClick={() => setViewMode('unified')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: viewMode === 'unified' ? '#007bff' : 'transparent',
                color: viewMode === 'unified' ? 'white' : '#6c757d',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              统一视图
            </button>
            <button 
              className={viewMode === 'blocks' ? 'active' : ''}
              onClick={() => setViewMode('blocks')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: viewMode === 'blocks' ? '#007bff' : 'transparent',
                color: viewMode === 'blocks' ? 'white' : '#6c757d',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              块级对比
            </button>
          </div>
        </div>
        
        <div className="toolbar-right" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button 
            className={`btn ${showDiffOnly ? 'active' : ''}`}
            onClick={() => setShowDiffOnly(!showDiffOnly)}
            title="只显示差异"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              background: showDiffOnly ? '#007bff' : 'white',
              color: showDiffOnly ? 'white' : '#495057',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {showDiffOnly ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button className="btn btn-ghost" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            border: '1px solid transparent',
            borderRadius: '6px',
            background: 'transparent',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <Download size={16} />
            导出
          </button>
          <button className="btn btn-ghost" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            border: '1px solid transparent',
            borderRadius: '6px',
            background: 'transparent',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <Share2 size={16} />
            分享
          </button>
          <button className="btn btn-ghost" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            border: '1px solid transparent',
            borderRadius: '6px',
            background: 'transparent',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="comparison-content" style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 简单的测试内容 */}
        <div style={{
          padding: '24px',
          background: 'white',
          borderBottom: '1px solid #e1e5e9'
        }}>
          <h3>版本对比测试</h3>
          <p>左侧版本: {leftVersion?.description || leftVersion?.id}</p>
          <p>右侧版本: {rightVersion?.description || rightVersion?.id}</p>
        </div>
        
        {/* 变更摘要 */}
        {showChangeSummary && renderChangeSummary()}
        
        {/* 对比视图 */}
        <div className="comparison-view" style={{
          flex: 1,
          overflow: 'hidden',
          background: 'white'
        }}>
          {viewMode === 'blocks' ? renderBlockComparison() : renderTextDiff()}
        </div>
      </div>
    </div>
  );
};

export default VersionComparison;
