import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, 
  Brain, 
  Plus, 
  ArrowRight, 
  Trash2, 
  Search,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  Bookmark,
  Tag,
  Users,
  TrendingUp,
  Link,
  GitBranch,
  Zap,
  X,
  CheckCircle,
  Play,
  Shield,
  Settings
} from 'lucide-react';
import useDocStore from '../../stores/docStore';
import './RelationshipManagerEnhanced.css';

const RelationshipManagerEnhanced = ({ isOpen, onClose, documentId }) => {
  const { 
    documents, 
    documentRelationships, 
    addDocumentRelationship, 
    removeDocumentRelationship,
    blockRelationships,
    addBlockRelationship,
    removeBlockRelationship,
    getBlockRelationships
  } = useDocStore();

  // 基础状态
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSource, setSelectedSource] = useState(documentId);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [relationType, setRelationType] = useState('relates');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 块关系相关状态
  const [selectedSourceBlock, setSelectedSourceBlock] = useState(null);
  const [selectedTargetBlock, setSelectedTargetBlock] = useState(null);
  const [selectedTargetDocument, setSelectedTargetDocument] = useState(null);
  const [blockSearchQuery, setBlockSearchQuery] = useState('');
  
  // 增强交互状态
  const [relationshipFilter, setRelationshipFilter] = useState('all');
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRelationships, setSelectedRelationships] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // list, grid, graph

  // 关系类型定义（增强版）
  const relationshipTypes = [
    { 
      id: 'relates', 
      label: '相关', 
      color: '#3b82f6', 
      icon: Link,
      description: '一般性关联关系'
    },
    { 
      id: 'derives', 
      label: '派生', 
      color: '#10b981', 
      icon: GitBranch,
      description: '从另一个文档派生而来'
    },
    { 
      id: 'references', 
      label: '引用', 
      color: '#8b5cf6', 
      icon: Bookmark,
      description: '引用或参考其他文档'
    },
    { 
      id: 'conflicts', 
      label: '冲突', 
      color: '#ef4444', 
      icon: X,
      description: '与其他文档存在冲突'
    },
    { 
      id: 'implements', 
      label: '实现', 
      color: '#f59e0b', 
      icon: Zap,
      description: '实现了其他文档的内容'
    },
    { 
      id: 'replaces', 
      label: '替代', 
      color: '#6b7280', 
      icon: RefreshCw,
      description: '替代其他文档'
    },
    { 
      id: 'depends_on', 
      label: '依赖', 
      color: '#06b6d4', 
      icon: ArrowRight,
      description: '依赖其他文档的内容'
    },
    { 
      id: 'influences', 
      label: '影响', 
      color: '#84cc16', 
      icon: TrendingUp,
      description: '影响其他文档的方向'
    },
    { 
      id: 'defines', 
      label: '定义', 
      color: '#a855f7', 
      icon: Settings,
      description: '定义了其他文档的规范'
    },
    { 
      id: 'validates', 
      label: '验证', 
      color: '#22c55e', 
      icon: CheckCircle,
      description: '验证其他文档的可行性'
    },
    { 
      id: 'initiates', 
      label: '启动', 
      color: '#f97316', 
      icon: Play,
      description: '启动或开始其他文档的工作'
    },
    { 
      id: 'complements', 
      label: '补充', 
      color: '#14b8a6', 
      icon: Plus,
      description: '补充其他文档的内容'
    },
    { 
      id: 'tested_by', 
      label: '被测试', 
      color: '#ec4899', 
      icon: Shield,
      description: '被其他文档测试验证'
    }
  ];

  // 当前文档和关系
  const currentDocument = documents.find(doc => doc.id === documentId);
  const currentRelationships = documentRelationships.filter(rel => 
    rel.sourceDocId === documentId || rel.targetDocId === documentId
  );
  
  // 辅助函数：在所有文档中查找块
  const findBlockInAllDocuments = (blockId) => {
    for (const doc of documents) {
      const block = doc.blocks?.find(b => b.id === blockId);
      if (block) {
        return { ...block, documentId: doc.id, documentTitle: doc.title };
      }
    }
    return null;
  };
  
  // 当前文档的块和块关系
  const currentDocumentBlocks = currentDocument?.blocks || [];
  const currentBlockRelationships = blockRelationships.filter(rel => {
    // 获取源块和目标块的文档ID
    const sourceBlock = findBlockInAllDocuments(rel.sourceBlockId);
    const targetBlock = findBlockInAllDocuments(rel.targetBlockId);
    
    return (sourceBlock?.documentId === documentId || targetBlock?.documentId === documentId);
  });
  
  // 获取其他文档的块
  const getBlocksFromOtherDocuments = () => {
    return documents
      .filter(doc => doc.id !== documentId)
      .flatMap(doc => 
        (doc.blocks || []).map(block => ({
          ...block,
          documentId: doc.id,
          documentTitle: doc.title
        }))
      )
      .filter(block => 
        blockSearchQuery === '' || 
        block.content?.text?.toLowerCase().includes(blockSearchQuery.toLowerCase()) ||
        block.content?.label?.toLowerCase().includes(blockSearchQuery.toLowerCase())
      );
  };

  // 智能建议（模拟）
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (documentId && documents.length > 1) {
      const otherDocs = documents.filter(doc => doc.id !== documentId);
      const mockSuggestions = otherDocs.slice(0, 3).map(doc => ({
        targetDocId: doc.id,
        suggestedType: 'relates',
        reason: '内容主题相似',
        confidence: 0.75 + Math.random() * 0.2
      }));
      setSuggestions(mockSuggestions);
    }
  }, [documentId, documents]);

  // 过滤和搜索
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => 
      doc.id !== documentId && 
      (searchQuery === '' || doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [documents, documentId, searchQuery]);

  const filteredRelationships = useMemo(() => {
    let filtered = currentRelationships;
    
    if (relationshipFilter !== 'all') {
      filtered = filtered.filter(rel => rel.type === relationshipFilter);
    }
    
    return filtered;
  }, [currentRelationships, relationshipFilter]);

  // 关系统计
  const relationshipStats = useMemo(() => {
    const docStats = relationshipTypes.reduce((acc, type) => {
      acc[type.id] = currentRelationships.filter(rel => rel.type === type.id).length;
      return acc;
    }, {});
    
    const blockStats = relationshipTypes.reduce((acc, type) => {
      acc[type.id] = currentBlockRelationships.filter(rel => rel.type === type.id).length;
      return acc;
    }, {});
    
    return {
      documents: {
        total: currentRelationships.length,
        types: docStats,
        incoming: currentRelationships.filter(rel => rel.targetDocId === documentId).length,
        outgoing: currentRelationships.filter(rel => rel.sourceDocId === documentId).length
      },
      blocks: {
        total: currentBlockRelationships.length,
        types: blockStats,
        incoming: currentBlockRelationships.filter(rel => {
          const targetBlock = findBlockInAllDocuments(rel.targetBlockId);
          return targetBlock?.documentId === documentId;
        }).length,
        outgoing: currentBlockRelationships.filter(rel => {
          const sourceBlock = findBlockInAllDocuments(rel.sourceBlockId);
          return sourceBlock?.documentId === documentId;
        }).length
      }
    };
  }, [currentRelationships, currentBlockRelationships, documentId]);

  // 创建关系
  const handleCreateRelationship = () => {
    if (selectedSource && selectedTarget && relationType) {
      addDocumentRelationship(selectedSource, selectedTarget, relationType, description);
      
      // 重置表单
      if (!isQuickMode) {
        setSelectedSource(documentId);
        setSelectedTarget(null);
        setDescription('');
      } else {
        // 快速模式下只重置目标
        setSelectedTarget(null);
      }
    }
  };

  // 创建块关系
  const handleCreateBlockRelationship = () => {
    if (selectedSourceBlock && selectedTargetBlock && relationType) {
      addBlockRelationship(selectedSourceBlock, selectedTargetBlock, relationType, description);
      
      // 重置表单
      setSelectedSourceBlock(null);
      setSelectedTargetBlock(null);
      setSelectedTargetDocument(null);
      setDescription('');
    }
  };

  // 获取块的显示文本
  const getBlockDisplayText = (block) => {
    if (!block) return '';
    
    if (block.type === 'text' && block.content?.text) {
      const text = block.content.text.replace(/[#*\n]/g, ' ').trim();
      return text.length > 80 ? text.substring(0, 80) + '...' : text;
    } else if (block.type === 'field' && block.content?.label) {
      return `${block.content.label}: ${block.content.value || ''}`;
    } else if (block.type === 'table' && block.content?.title) {
      return `表格: ${block.content.title}`;
    } else if (block.type === 'reference' && block.content?.title) {
      return `引用: ${block.content.title}`;
    }
    
    return `${block.type} 块`;
  };

  // 批量删除关系
  const handleBatchDelete = () => {
    selectedRelationships.forEach(id => {
      removeDocumentRelationship(id);
    });
    setSelectedRelationships([]);
  };

  // 应用建议
  const applySuggestion = (suggestion) => {
    addDocumentRelationship(
      documentId, 
      suggestion.targetDocId, 
      suggestion.suggestedType, 
      suggestion.reason
    );
    setSuggestions(prev => prev.filter(s => s.targetDocId !== suggestion.targetDocId));
  };

  // 分析关系
  const handleAnalyzeRelationships = async () => {
    setIsAnalyzing(true);
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 生成新的建议
    const newSuggestions = filteredDocuments.slice(0, 2).map(doc => ({
      targetDocId: doc.id,
      suggestedType: ['derives', 'references'][Math.floor(Math.random() * 2)],
      reason: '内容结构分析发现潜在关联',
      confidence: 0.8 + Math.random() * 0.15
    }));
    
    setSuggestions(prev => [...prev, ...newSuggestions]);
    setIsAnalyzing(false);
  };

  if (!isOpen) return null;

  // 渲染概览面板
  const renderOverview = () => (
    <div className="overview-panel">
      {/* 统计卡片 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Network size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{relationshipStats.documents.total}</div>
            <div className="stat-label">文档关系</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <GitBranch size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{relationshipStats.blocks.total}</div>
            <div className="stat-label">段落关系</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{relationshipStats.documents.incoming + relationshipStats.blocks.incoming}</div>
            <div className="stat-label">传入关系</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <ArrowRight size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{relationshipStats.documents.outgoing + relationshipStats.blocks.outgoing}</div>
            <div className="stat-label">传出关系</div>
          </div>
        </div>
      </div>

      {/* 关系类型分布 */}
      <div className="relationship-distribution">
        <h4>关系类型分布</h4>
        <div className="type-stats">
          {relationshipTypes.map(type => {
            const docCount = relationshipStats.documents.types[type.id] || 0;
            const blockCount = relationshipStats.blocks.types[type.id] || 0;
            const totalCount = docCount + blockCount;
            const totalRelationships = relationshipStats.documents.total + relationshipStats.blocks.total;
            const percentage = totalRelationships > 0 ? (totalCount / totalRelationships) * 100 : 0;
            
            return (
              <div key={type.id} className="type-stat-item">
                <div className="type-info">
                  <type.icon size={16} color={type.color} />
                  <span className="type-name">{type.label}</span>
                  <span className="type-count">
                    ({totalCount}) 
                    <span className="type-breakdown">文档:{docCount} 段落:{blockCount}</span>
                  </span>
                </div>
                <div className="type-bar">
                  <div 
                    className="type-bar-fill" 
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: type.color 
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 快速操作 */}
      <div className="quick-actions">
        <h4>快速操作</h4>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => setActiveTab('documents')}
          >
            <Plus size={16} />
            创建文档关系
          </button>
          
          <button 
            className="action-btn primary"
            onClick={() => setActiveTab('blocks')}
          >
            <GitBranch size={16} />
            创建段落关系
          </button>
          
          <button 
            className="action-btn secondary"
            onClick={handleAnalyzeRelationships}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <RefreshCw size={16} className="spinning" /> : <Brain size={16} />}
            分析关系
          </button>
          
          <button 
            className="action-btn secondary"
            onClick={() => setActiveTab('suggestions')}
          >
            <Zap size={16} />
            查看推荐
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染文档关系面板
  const renderDocumentRelationships = () => (
    <div className="create-panel">
      <div className="panel-header">
        <h3>
          <Network size={20} />
          文档关系管理
        </h3>
        
        <div className="mode-toggle">
          <button 
            className={`mode-btn ${!isQuickMode ? 'active' : ''}`}
            onClick={() => setIsQuickMode(false)}
          >
            标准模式
          </button>
          <button 
            className={`mode-btn ${isQuickMode ? 'active' : ''}`}
            onClick={() => setIsQuickMode(true)}
          >
            快速模式
          </button>
        </div>
      </div>

      <div className="create-form">
        <div className="form-grid">
          <div className="form-group">
            <label>源文档</label>
            <select
              value={selectedSource || ''}
              onChange={(e) => setSelectedSource(e.target.value)}
              disabled={isQuickMode}
            >
              <option value="">选择源文档</option>
              <option value={documentId}>{currentDocument?.title} (当前)</option>
              {filteredDocuments.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>目标文档</label>
            <div className="target-select-wrapper">
              <select
                value={selectedTarget || ''}
                onChange={(e) => setSelectedTarget(e.target.value)}
              >
                <option value="">选择目标文档</option>
                {filteredDocuments.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </select>
              <button 
                className="search-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Search size={16} />
              </button>
            </div>
            
            {showFilters && (
              <div className="search-filters">
                <input
                  type="text"
                  placeholder="搜索文档..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>关系类型</label>
            <div className="relationship-types">
              {relationshipTypes.map(type => (
                <button
                  key={type.id}
                  className={`type-btn ${relationType === type.id ? 'active' : ''}`}
                  onClick={() => setRelationType(type.id)}
                  style={{ borderColor: type.color }}
                >
                  <type.icon size={16} color={relationType === type.id ? 'white' : type.color} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            {relationType && (
              <div className="type-description">
                {relationshipTypes.find(t => t.id === relationType)?.description}
              </div>
            )}
          </div>
        </div>

        <div className="form-group full-width">
          <label>关系描述 (可选)</label>
          <textarea
            placeholder="描述这个关系的具体内容..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            className="create-btn"
            onClick={handleCreateRelationship}
            disabled={!selectedSource || !selectedTarget}
          >
            <Plus size={16} />
            创建关系
          </button>
          
          {isQuickMode && (
            <div className="quick-mode-hint">
              <Zap size={14} />
              快速模式：源文档锁定为当前文档
            </div>
          )}
        </div>
      </div>

      {/* 现有文档关系列表 */}
      <div style={{ marginTop: '32px' }}>
        <h4 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '16px',
          color: '#111827'
        }}>
          已建立的文档关系 ({currentRelationships.length})
        </h4>

        {currentRelationships.length === 0 ? (
          <div className="empty-state">
            <Network size={48} />
            <h4>暂无文档关系</h4>
            <p>开始创建文档之间的关联关系</p>
          </div>
        ) : (
          <div className="relationships-list">
            {currentRelationships.map(relationship => {
              const sourceDoc = documents.find(d => d.id === relationship.sourceDocId);
              const targetDoc = documents.find(d => d.id === relationship.targetDocId);
              const type = relationshipTypes.find(t => t.id === relationship.type);
              
              return (
                <div key={relationship.id} className="relationship-item">
                  <div className="relationship-content">
                    <div className="relationship-flow">
                      <div className="doc-node">
                        <span className="doc-title">{sourceDoc?.title}</span>
                        {relationship.sourceDocId === documentId && (
                          <span className="current-badge">当前</span>
                        )}
                      </div>
                      
                      <div className="relationship-arrow">
                        <type.icon size={16} color={type.color} />
                        <ArrowRight size={14} />
                      </div>
                      
                      <div className="doc-node">
                        <span className="doc-title">{targetDoc?.title}</span>
                        {relationship.targetDocId === documentId && (
                          <span className="current-badge">当前</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="relationship-meta">
                      <span className="type-badge" style={{ backgroundColor: type.color }}>
                        {type.label}
                      </span>
                      
                      {relationship.description && (
                        <span className="description">{relationship.description}</span>
                      )}
                      
                      <span className="timestamp">
                        {relationship.createdAt ? new Date(relationship.createdAt).toLocaleDateString() : '未知日期'}
                      </span>
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => removeDocumentRelationship(relationship.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // 渲染块关系面板
  const renderBlockRelationships = () => (
    <div className="create-panel">
      <div className="panel-header">
        <h3>
          <GitBranch size={20} />
          段落关系管理
        </h3>
        
        <div className="help-text">
          在当前文档的段落与其他文档段落之间建立关系
        </div>
      </div>

      <div className="create-form">
        <div className="form-grid">
          <div className="form-group">
            <label>源段落（当前文档）</label>
            <select
              value={selectedSourceBlock || ''}
              onChange={(e) => setSelectedSourceBlock(e.target.value)}
            >
              <option value="">选择源段落</option>
              {currentDocumentBlocks.map(block => (
                <option key={block.id} value={block.id}>
                  {getBlockDisplayText(block)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>目标文档</label>
            <select
              value={selectedTargetDocument || ''}
              onChange={(e) => {
                setSelectedTargetDocument(e.target.value);
                setSelectedTargetBlock(null); // 重置目标块选择
              }}
            >
              <option value="">选择目标文档</option>
              {filteredDocuments.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>目标段落</label>
            <select
              value={selectedTargetBlock || ''}
              onChange={(e) => setSelectedTargetBlock(e.target.value)}
              disabled={!selectedTargetDocument}
            >
              <option value="">选择目标段落</option>
              {selectedTargetDocument && 
                documents.find(doc => doc.id === selectedTargetDocument)?.blocks?.map(block => (
                  <option key={block.id} value={block.id}>
                    {getBlockDisplayText(block)}
                  </option>
                ))
              }
            </select>
          </div>

          <div className="form-group">
            <label>关系类型</label>
            <div className="relationship-types">
              {relationshipTypes.map(type => (
                <button
                  key={type.id}
                  className={`type-btn ${relationType === type.id ? 'active' : ''}`}
                  onClick={() => setRelationType(type.id)}
                  style={{ borderColor: type.color }}
                >
                  <type.icon size={16} color={relationType === type.id ? 'white' : type.color} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            {relationType && (
              <div className="type-description">
                {relationshipTypes.find(t => t.id === relationType)?.description}
              </div>
            )}
          </div>
        </div>

        {/* 搜索过滤 */}
        <div className="form-group full-width">
          <label>搜索段落内容</label>
          <input
            type="text"
            placeholder="搜索段落内容..."
            value={blockSearchQuery}
            onChange={(e) => setBlockSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="form-group full-width">
          <label>关系描述 (可选)</label>
          <textarea
            placeholder="描述段落之间的关系..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            className="create-btn"
            onClick={handleCreateBlockRelationship}
            disabled={!selectedSourceBlock || !selectedTargetBlock}
          >
            <Plus size={16} />
            创建段落关系
          </button>
        </div>
      </div>

      {/* 段落预览区域 */}
      {(selectedSourceBlock || selectedTargetBlock) && (
        <div className="block-preview-section">
          <h4>段落预览</h4>
          <div className="block-previews">
            {selectedSourceBlock && (
              <div className="block-preview">
                <h5>源段落</h5>
                <div className="block-content">
                  {getBlockDisplayText(currentDocumentBlocks.find(b => b.id === selectedSourceBlock))}
                </div>
                <div className="block-meta">
                  来自: {currentDocument?.title}
                </div>
              </div>
            )}
            
            {selectedTargetBlock && selectedTargetDocument && (
              <div className="block-preview">
                <h5>目标段落</h5>
                <div className="block-content">
                  {getBlockDisplayText(
                    documents.find(doc => doc.id === selectedTargetDocument)?.blocks?.find(b => b.id === selectedTargetBlock)
                  )}
                </div>
                <div className="block-meta">
                  来自: {documents.find(doc => doc.id === selectedTargetDocument)?.title}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 现有块关系列表 */}
      <div style={{ marginTop: '32px' }}>
        <h4 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '16px',
          color: '#111827'
        }}>
          已建立的段落关系 ({currentBlockRelationships.length})
        </h4>

        {currentBlockRelationships.length === 0 ? (
          <div className="empty-state">
            <GitBranch size={48} />
            <h4>暂无段落关系</h4>
            <p>开始创建段落之间的关联关系</p>
          </div>
        ) : (
          <div className="relationships-list">
            {currentBlockRelationships.map(relationship => {
              const sourceBlock = findBlockInAllDocuments(relationship.sourceBlockId);
              const targetBlock = findBlockInAllDocuments(relationship.targetBlockId);
              const type = relationshipTypes.find(t => t.id === relationship.type);
              
              return (
                <div key={relationship.id} className="relationship-item block-relationship">
                  <div className="relationship-content">
                    <div className="relationship-flow">
                      <div className="block-node">
                        <div className="block-text">{getBlockDisplayText(sourceBlock)}</div>
                        <div className="block-doc">{sourceBlock?.documentTitle}</div>
                        {sourceBlock?.documentId === documentId && (
                          <span className="current-badge">当前</span>
                        )}
                      </div>
                      
                      <div className="relationship-arrow">
                        <type.icon size={16} color={type.color} />
                        <ArrowRight size={14} />
                      </div>
                      
                      <div className="block-node">
                        <div className="block-text">{getBlockDisplayText(targetBlock)}</div>
                        <div className="block-doc">{targetBlock?.documentTitle}</div>
                        {targetBlock?.documentId === documentId && (
                          <span className="current-badge">当前</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="relationship-meta">
                      <span className="type-badge" style={{ backgroundColor: type.color }}>
                        {type.label}
                      </span>
                      
                      {relationship.description && (
                        <span className="description">{relationship.description}</span>
                      )}
                      
                      <span className="timestamp">
                        {relationship.createdAt ? new Date(relationship.createdAt).toLocaleDateString() : '未知日期'}
                      </span>
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => removeBlockRelationship(relationship.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // 渲染智能推荐
  const renderSuggestions = () => (
    <div className="suggestions-panel">
      <div className="panel-header">
        <h3>
          <Brain size={20} />
          智能推荐 ({suggestions.length})
        </h3>
        
        <button 
          className="refresh-btn"
          onClick={handleAnalyzeRelationships}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? <RefreshCw size={16} className="spinning" /> : <RefreshCw size={16} />}
          {isAnalyzing ? '分析中...' : '重新分析'}
        </button>
      </div>

      <div className="suggestions-list">
        {suggestions.length === 0 ? (
          <div className="empty-state">
            <Brain size={48} />
            <h4>暂无推荐</h4>
            <p>系统正在分析文档内容以发现潜在关系</p>
            <button 
              className="analyze-btn"
              onClick={handleAnalyzeRelationships}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <RefreshCw size={16} className="spinning" /> : <Brain size={16} />}
              开始分析
            </button>
          </div>
        ) : (
          suggestions.map(suggestion => {
            const targetDoc = documents.find(d => d.id === suggestion.targetDocId);
            const type = relationshipTypes.find(t => t.id === suggestion.suggestedType);
            
            return (
              <div key={suggestion.targetDocId} className="suggestion-item">
                <div className="suggestion-content">
                  <div className="suggestion-flow">
                    <span className="doc-name">{currentDocument?.title}</span>
                    <type.icon size={16} color={type.color} />
                    <ArrowRight size={14} />
                    <span className="doc-name">{targetDoc?.title}</span>
                  </div>
                  
                  <div className="suggestion-meta">
                    <span className="type-badge" style={{ backgroundColor: type.color }}>
                      {type.label}
                    </span>
                    <span className="reason">{suggestion.reason}</span>
                    <span className="confidence">
                      置信度: {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="suggestion-actions">
                  <button
                    className="apply-btn"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <Plus size={16} />
                    应用
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="relationship-manager-enhanced">
      <div className="manager-overlay" onClick={onClose} />
      
      <div className="manager-container">
        {/* 头部 */}
        <div className="manager-header">
          <div className="header-info">
            <h2>关系管理器</h2>
            <p>管理 "{currentDocument?.title}" 的文档关系</p>
          </div>
          
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 导航标签 */}
        <div className="manager-tabs">
          {[
            { id: 'overview', label: '概览', icon: TrendingUp },
            { id: 'documents', label: '文档关系', icon: Network },
            { id: 'blocks', label: '段落关系', icon: GitBranch },
            { id: 'suggestions', label: '智能推荐', icon: Brain }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="manager-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'documents' && renderDocumentRelationships()}
          {activeTab === 'blocks' && renderBlockRelationships()}
          {activeTab === 'suggestions' && renderSuggestions()}
        </div>
      </div>
    </div>
  );
};

export default RelationshipManagerEnhanced;
