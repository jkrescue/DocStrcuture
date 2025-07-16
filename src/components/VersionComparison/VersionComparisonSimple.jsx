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

const VersionComparison = ({ 
  leftVersion, 
  rightVersion, 
  onClose,
  document 
}) => {
  // 调试信息
  console.log('VersionComparison rendered', { leftVersion, rightVersion });
  
  // 状态管理
  const [viewMode, setViewMode] = useState('split'); // 'split', 'unified', 'blocks'
  const [showDiffOnly, setShowDiffOnly] = useState(false);
  const [showChangeSummary, setShowChangeSummary] = useState(true);

  // 检查版本数据
  if (!leftVersion || !rightVersion) {
    console.log('Missing version data:', { leftVersion, rightVersion });
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        color: '#6c757d',
        gap: '16px',
        backgroundColor: 'white',
        padding: '20px'
      }}>
        <AlertCircle size={48} />
        <h3>无法进行版本对比</h3>
        <p>请确保选择了两个有效的版本进行对比</p>
        <p>调试信息: leftVersion={leftVersion ? '存在' : '缺失'}, rightVersion={rightVersion ? '存在' : '缺失'}</p>
        <button 
          onClick={onClose} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          返回版本列表
        </button>
      </div>
    );
  }

  // 计算差异数据
  const comparisonData = useMemo(() => {
    const leftBlocks = leftVersion.blocks || [];
    const rightBlocks = rightVersion.blocks || [];

    // 简单的块级变化分析
    const leftBlockMap = new Map(leftBlocks.map(block => [block.id, block]));
    const rightBlockMap = new Map(rightBlocks.map(block => [block.id, block]));

    const changes = {
      added: [],
      removed: [],
      modified: [],
      unchanged: []
    };

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

    return { blockChanges: changes, leftBlocks, rightBlocks };
  }, [leftVersion, rightVersion]);

  // 渲染块内容
  const renderBlockContent = (block) => {
    switch (block.type) {
      case 'text':
        return (
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            lineHeight: '1.6', 
            color: '#2c3e50',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #e9ecef'
          }}>
            {block.content?.text || ''}
          </div>
        );
      case 'field':
        return (
          <div style={{
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6c757d',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              {block.content?.label}
            </div>
            <div style={{
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              {block.content?.value || ''}
            </div>
          </div>
        );
      case 'table':
        return (
          <div style={{
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #e9ecef'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <tbody>
                {block.content?.data?.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} style={{
                        padding: '8px',
                        border: '1px solid #e1e5e9',
                        fontSize: '14px'
                      }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return (
          <pre style={{
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #e9ecef',
            overflow: 'auto'
          }}>
            {JSON.stringify(block.content, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fafbfc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 顶部工具栏 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'white',
        borderBottom: '1px solid #e1e5e9',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button 
            onClick={onClose} 
            style={{
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
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            返回
          </button>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            版本对比
          </h2>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '14px', color: '#6c757d' }}>
            {leftVersion.description || leftVersion.id} ↔ {rightVersion.description || rightVersion.id}
          </span>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '24px'
      }}>
        {/* 版本信息对比 */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '32px',
          alignItems: 'center'
        }}>
          <div style={{
            flex: 1,
            padding: '20px',
            background: '#fff5f5',
            border: '1px solid #fed7d7',
            borderLeft: '4px solid #e53e3e',
            borderRadius: '8px'
          }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#2d3748',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {leftVersion.description || leftVersion.id}
            </h3>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <div>作者: {leftVersion.author}</div>
              <div>时间: {leftVersion.timestamp ? new Date(leftVersion.timestamp).toLocaleString() : '未知'}</div>
              <div>块数量: {(leftVersion.blocks || []).length}</div>
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            color: '#007bff',
            fontSize: '24px'
          }}>
            <ArrowRight size={32} />
          </div>
          
          <div style={{
            flex: 1,
            padding: '20px',
            background: '#f0fff4',
            border: '1px solid #c6f6d5',
            borderLeft: '4px solid #38a169',
            borderRadius: '8px'
          }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#2d3748',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {rightVersion.description || rightVersion.id}
            </h3>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <div>作者: {rightVersion.author}</div>
              <div>时间: {rightVersion.timestamp ? new Date(rightVersion.timestamp).toLocaleString() : '未知'}</div>
              <div>块数量: {(rightVersion.blocks || []).length}</div>
            </div>
          </div>
        </div>

        {/* 变更统计 */}
        {comparisonData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'white',
              border: '1px solid #e1e5e9',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#28a745',
                color: 'white'
              }}>
                <Plus size={20} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#2c3e50' }}>
                  {comparisonData.blockChanges.added.length}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>新增块</div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'white',
              border: '1px solid #e1e5e9',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#007bff',
                color: 'white'
              }}>
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#2c3e50' }}>
                  {comparisonData.blockChanges.modified.length}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>修改块</div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'white',
              border: '1px solid #e1e5e9',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#dc3545',
                color: 'white'
              }}>
                <Minus size={20} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#2c3e50' }}>
                  {comparisonData.blockChanges.removed.length}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>删除块</div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'white',
              border: '1px solid #e1e5e9',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#6c757d',
                color: 'white'
              }}>
                <CheckCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#2c3e50' }}>
                  {comparisonData.blockChanges.unchanged.length}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>未变更</div>
              </div>
            </div>
          </div>
        )}

        {/* 详细变更列表 */}
        {comparisonData && (
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e1e5e9' }}>
            {/* 新增的块 */}
            {comparisonData.blockChanges.added.length > 0 && (
              <div style={{ padding: '20px', borderBottom: '1px solid #e1e5e9' }}>
                <h4 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#28a745'
                }}>
                  <Plus size={16} />
                  新增的块 ({comparisonData.blockChanges.added.length})
                </h4>
                {comparisonData.blockChanges.added.map(block => (
                  <div key={block.id} style={{
                    marginBottom: '16px',
                    border: '1px solid #c6f6d5',
                    borderLeft: '4px solid #28a745',
                    borderRadius: '4px',
                    background: '#f0fff4'
                  }}>
                    <div style={{
                      padding: '8px 12px',
                      background: '#e6fffa',
                      borderBottom: '1px solid #c6f6d5',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {block.type} - {block.id}
                    </div>
                    <div style={{ padding: '12px' }}>
                      {renderBlockContent(block)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 修改的块 */}
            {comparisonData.blockChanges.modified.length > 0 && (
              <div style={{ padding: '20px', borderBottom: '1px solid #e1e5e9' }}>
                <h4 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#007bff'
                }}>
                  <FileText size={16} />
                  修改的块 ({comparisonData.blockChanges.modified.length})
                </h4>
                {comparisonData.blockChanges.modified.map(({ left, right }) => (
                  <div key={left.id} style={{
                    marginBottom: '16px',
                    border: '1px solid #bee5eb',
                    borderLeft: '4px solid #007bff',
                    borderRadius: '4px',
                    background: '#f8fbff'
                  }}>
                    <div style={{
                      padding: '8px 12px',
                      background: '#e7f3ff',
                      borderBottom: '1px solid #bee5eb',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {left.type} - {left.id}
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1px',
                      background: '#e1e5e9'
                    }}>
                      <div style={{ background: '#fff5f5', padding: '12px' }}>
                        <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#e53e3e' }}>修改前</h5>
                        {renderBlockContent(left)}
                      </div>
                      <div style={{ background: '#f0fff4', padding: '12px' }}>
                        <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#38a169' }}>修改后</h5>
                        {renderBlockContent(right)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 删除的块 */}
            {comparisonData.blockChanges.removed.length > 0 && (
              <div style={{ padding: '20px' }}>
                <h4 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#dc3545'
                }}>
                  <Minus size={16} />
                  删除的块 ({comparisonData.blockChanges.removed.length})
                </h4>
                {comparisonData.blockChanges.removed.map(block => (
                  <div key={block.id} style={{
                    marginBottom: '16px',
                    border: '1px solid #f1b0b7',
                    borderLeft: '4px solid #dc3545',
                    borderRadius: '4px',
                    background: '#fff5f5'
                  }}>
                    <div style={{
                      padding: '8px 12px',
                      background: '#ffeaea',
                      borderBottom: '1px solid #f1b0b7',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {block.type} - {block.id}
                    </div>
                    <div style={{ padding: '12px' }}>
                      {renderBlockContent(block)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionComparison;
