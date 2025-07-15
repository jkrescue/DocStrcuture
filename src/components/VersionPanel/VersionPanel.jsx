import React, { useState } from 'react';
import { Clock, GitBranch, User, Download, RotateCcw, Eye, Plus, Minus, Archive } from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const VersionPanel = ({ onClose }) => {
  const { versions, blocks, saveVersion, loadVersion } = useDocStore();
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState([]);
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSaveVersion = () => {
    saveVersion(newVersionDescription || '手动保存');
    setNewVersionDescription('');
    setShowCreateForm(false);
  };

  const handleLoadVersion = (versionId) => {
    loadVersion(versionId);
    onClose?.();
  };

  const toggleCompareVersion = (version) => {
    if (compareVersions.includes(version.id)) {
      setCompareVersions(prev => prev.filter(id => id !== version.id));
    } else if (compareVersions.length < 2) {
      setCompareVersions(prev => [...prev, version.id]);
    }
  };

  const getDiffSummary = (version) => {
    // 模拟差异计算
    const changes = {
      added: Math.floor(Math.random() * 5),
      modified: Math.floor(Math.random() * 8),
      deleted: Math.floor(Math.random() * 3)
    };
    return changes;
  };

  const getVersionStatus = (version) => {
    const now = new Date();
    const versionDate = new Date(version.timestamp);
    const diffHours = (now - versionDate) / (1000 * 60 * 60);
    
    if (diffHours < 24) return { status: 'recent', color: 'green' };
    if (diffHours < 168) return { status: 'week', color: 'blue' };
    return { status: 'old', color: 'gray' };
  };

  const renderVersionTimeline = () => {
    return (
      <div>
        {[...versions].reverse().map((version, index) => {
          const diff = getDiffSummary(version);
          const status = getVersionStatus(version);
          const isSelected = selectedVersion?.id === version.id;
          const isCompareSelected = compareVersions.includes(version.id);

          return (
            <div
              key={version.id}
              style={{
                position: 'relative',
                padding: '16px',
                border: isSelected 
                  ? '1px solid #3b82f6' 
                  : isCompareSelected 
                    ? '1px solid #7c3aed'
                    : '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '16px',
                backgroundColor: isSelected 
                  ? '#eff6ff' 
                  : isCompareSelected 
                    ? '#faf5ff'
                    : '#ffffff',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedVersion(version)}
              onMouseOver={(e) => {
                if (!isSelected && !isCompareSelected) {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected && !isCompareSelected) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* 时间线连接线 */}
              {index < versions.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '24px',
                  top: '64px',
                  width: '2px',
                  height: '32px',
                  backgroundColor: '#e5e7eb'
                }}></div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                {/* 时间线节点 */}
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  marginTop: '8px',
                  flexShrink: 0,
                  backgroundColor: status.color === 'green' ? '#10b981' :
                    status.color === 'blue' ? '#3b82f6' : '#6b7280'
                }}></div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontWeight: '500', color: '#111827', margin: '0 0 4px 0' }}>
                        {version.description || '自动保存'}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                        <Clock size={14} />
                        <span>{new Date(version.timestamp).toLocaleString()}</span>
                        <User size={14} />
                        <span>当前用户</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {compareMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompareVersion(version);
                          }}
                          style={{
                            padding: '4px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: isCompareSelected ? '#f3e8ff' : '#f3f4f6',
                            color: isCompareSelected ? '#7c3aed' : '#6b7280'
                          }}
                          disabled={!isCompareSelected && compareVersions.length >= 2}
                          onMouseOver={(e) => {
                            if (!isCompareSelected) e.target.style.backgroundColor = '#e5e7eb';
                          }}
                          onMouseOut={(e) => {
                            if (!isCompareSelected) e.target.style.backgroundColor = '#f3f4f6';
                          }}
                        >
                          <GitBranch size={14} />
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVersion(version);
                        }}
                        style={{
                          padding: '4px',
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        title="查看详情"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadVersion(version.id);
                        }}
                        style={{
                          padding: '4px',
                          backgroundColor: '#dbeafe',
                          color: '#2563eb',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#bfdbfe'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#dbeafe'}
                        title="恢复到此版本"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 变更统计 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', marginBottom: '8px' }}>
                    {diff.added > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}>
                        <Plus size={12} />
                        <span>{diff.added} 新增</span>
                      </span>
                    )}
                    {diff.modified > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb' }}>
                        <span style={{ width: '12px', height: '12px', backgroundColor: '#2563eb', borderRadius: '50%' }}></span>
                        <span>{diff.modified} 修改</span>
                      </span>
                    )}
                    {diff.deleted > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#dc2626' }}>
                        <Minus size={12} />
                        <span>{diff.deleted} 删除</span>
                      </span>
                    )}
                  </div>

                  {/* 版本标签 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {index === 0 && (
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '12px',
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        borderRadius: '12px'
                      }}>
                        当前版本
                      </span>
                    )}
                    {version.auto && (
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '12px',
                        backgroundColor: '#f3f4f6',
                        color: '#4b5563',
                        borderRadius: '12px'
                      }}>
                        自动保存
                      </span>
                    )}
                    {version.description?.includes('重要') && (
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '12px',
                        backgroundColor: '#fed7aa',
                        color: '#c2410c',
                        borderRadius: '12px'
                      }}>
                        重要节点
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderVersionDetail = () => {
    if (!selectedVersion) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
          <div style={{ textAlign: 'center' }}>
            <Clock size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>选择左侧版本查看详情</p>
          </div>
        </div>
      );
    }

    const diff = getDiffSummary(selectedVersion);

    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>{selectedVersion.description}</h3>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            <div style={{ marginBottom: '4px' }}>保存时间: {new Date(selectedVersion.timestamp).toLocaleString()}</div>
            <div style={{ marginBottom: '4px' }}>版本ID: {selectedVersion.id}</div>
            <div>创建者: 当前用户</div>
          </div>
        </div>

        {/* 变更统计 */}
        <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>变更统计</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
            <div style={{ padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>{diff.added}</div>
              <div style={{ fontSize: '14px', color: '#047857' }}>新增块</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{diff.modified}</div>
              <div style={{ fontSize: '14px', color: '#1d4ed8' }}>修改块</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{diff.deleted}</div>
              <div style={{ fontSize: '14px', color: '#b91c1c' }}>删除块</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => handleLoadVersion(selectedVersion.id)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '12px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            恢复到此版本
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <button style={{
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}>
              <Download size={16} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '14px' }}>导出版本</div>
            </button>
            <button style={{
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}>
              <Archive size={16} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '14px' }}>归档版本</div>
            </button>
          </div>
        </div>

        {/* 文件快照预览 */}
        <div>
          <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>内容快照</h4>
          <div style={{ maxHeight: '256px', overflowY: 'auto' }}>
            {selectedVersion.blocksSnapshot?.slice(0, 5).map((block, index) => (
              <div key={index} style={{ 
                padding: '8px', 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '4px', 
                fontSize: '14px',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    fontSize: '12px', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '12px' 
                  }}>{block.type}</span>
                  <span style={{ color: '#6b7280' }}>#{block.id}</span>
                </div>
                <div style={{ color: '#374151' }}>
                  {block.type === 'text' && block.content.text}
                  {block.type === 'field' && `${block.content.label}: ${block.content.value}`}
                  {block.type === 'table' && block.content.title}
                  {block.type === 'reference' && '引用内容'}
                </div>
              </div>
            ))}
            {selectedVersion.blocksSnapshot?.length > 5 && (
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', padding: '8px' }}>
                还有 {selectedVersion.blocksSnapshot.length - 5} 个块...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <div style={{ flex: 1, display: 'flex' }}>
        {/* 左侧版本列表 */}
        <div style={{ width: '66.67%', borderRight: '1px solid #e5e7eb' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>版本历史</h2>
              <button
                onClick={onClose}
                style={{
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px',
                  lineHeight: 1
                }}
                onMouseOver={(e) => e.target.style.color = '#374151'}
                onMouseOut={(e) => e.target.style.color = '#6b7280'}
              >
                ✕
              </button>
            </div>

            {/* 工具栏 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  <Plus size={16} />
                  保存当前版本
                </button>
                
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: compareMode ? '#f3e8ff' : '#f3f4f6',
                    color: compareMode ? '#7c3aed' : '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (!compareMode) e.target.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseOut={(e) => {
                    if (!compareMode) e.target.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  <GitBranch size={16} />
                  对比模式
                </button>
              </div>

              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                共 {versions.length} 个版本
              </div>
            </div>

            {/* 创建版本表单 */}
            {showCreateForm && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <input
                  type="text"
                  placeholder="输入版本描述（可选）"
                  value={newVersionDescription}
                  onChange={(e) => setNewVersionDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleSaveVersion}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#d1d5db',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#9ca3af'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#d1d5db'}
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* 对比模式提示 */}
            {compareMode && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#7c3aed' }}>
                  对比模式已启用，选择最多2个版本进行比较
                  {compareVersions.length > 0 && (
                    <span style={{ marginLeft: '8px' }}>
                      （已选择 {compareVersions.length}/2）
                    </span>
                  )}
                </div>
                {compareVersions.length === 2 && (
                  <button style={{
                    marginTop: '8px',
                    padding: '4px 12px',
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#6d28d9'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#7c3aed'}>
                    开始比较
                  </button>
                )}
              </div>
            )}
          </div>

          <div style={{ padding: '24px', overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
            {renderVersionTimeline()}
          </div>
        </div>

        {/* 右侧版本详情 */}
        <div style={{ width: '33.33%', padding: '24px', backgroundColor: '#f9fafb' }}>
          {renderVersionDetail()}
        </div>
      </div>
    </div>
  );
};

export default VersionPanel;