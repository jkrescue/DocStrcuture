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
  X
} from 'lucide-react';
import { useDocStore } from '../../stores/docStore';
import './RelationshipManagerEnhanced.css';

const RelationshipManagerEnhanced = ({ isOpen, onClose, documentId }) => {
  const { 
    documents, 
    documentRelationships, 
    addDocumentRelationship, 
    removeDocumentRelationship,
    blockRelationships,
    addBlockRelationship,
    removeBlockRelationship
  } = useDocStore();

  // 基础状态
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSource, setSelectedSource] = useState(documentId);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [relationType, setRelationType] = useState('relates');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
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
    }
  ];

  // 当前文档和关系
  const currentDocument = documents.find(doc => doc.id === documentId);
  const currentRelationships = documentRelationships.filter(rel => 
    rel.sourceDocId === documentId || rel.targetDocId === documentId
  );

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
    const stats = relationshipTypes.reduce((acc, type) => {
      acc[type.id] = currentRelationships.filter(rel => rel.type === type.id).length;
      return acc;
    }, {});
    
    return {
      total: currentRelationships.length,
      types: stats,
      incoming: currentRelationships.filter(rel => rel.targetDocId === documentId).length,
      outgoing: currentRelationships.filter(rel => rel.sourceDocId === documentId).length
    };
  }, [currentRelationships, documentId]);

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
            <div className="stat-number">{relationshipStats.total}</div>
            <div className="stat-label">总关系数</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{relationshipStats.incoming}</div>
            <div className="stat-label">传入关系</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <ArrowRight size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{relationshipStats.outgoing}</div>
            <div className="stat-label">传出关系</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Brain size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{suggestions.length}</div>
            <div className="stat-label">智能推荐</div>
          </div>
        </div>
      </div>

      {/* 关系类型分布 */}
      <div className="relationship-distribution">
        <h4>关系类型分布</h4>
        <div className="type-stats">
          {relationshipTypes.map(type => {
            const count = relationshipStats.types[type.id] || 0;
            const percentage = relationshipStats.total > 0 ? (count / relationshipStats.total) * 100 : 0;
            
            return (
              <div key={type.id} className="type-stat-item">
                <div className="type-info">
                  <type.icon size={16} color={type.color} />
                  <span className="type-name">{type.label}</span>
                  <span className="type-count">({count})</span>
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
            onClick={() => setActiveTab('create')}
          >
            <Plus size={16} />
            创建关系
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

  // 渲染创建关系面板
  const renderCreateRelationship = () => (
    <div className="create-panel">
      <div className="panel-header">
        <h3>
          <Plus size={20} />
          创建新关系
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
    </div>
  );

  // 渲染关系列表
  const renderRelationshipsList = () => (
    <div className="relationships-panel">
      <div className="panel-header">
        <h3>
          <Network size={20} />
          关系列表 ({filteredRelationships.length})
        </h3>
        
        <div className="list-controls">
          <div className="filter-group">
            <select
              value={relationshipFilter}
              onChange={(e) => setRelationshipFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">所有类型</option>
              {relationshipTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              列表
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              网格
            </button>
          </div>
        </div>
      </div>

      {selectedRelationships.length > 0 && (
        <div className="batch-actions">
          <span className="selected-count">
            已选择 {selectedRelationships.length} 个关系
          </span>
          <button 
            className="batch-delete-btn"
            onClick={handleBatchDelete}
          >
            <Trash2 size={16} />
            批量删除
          </button>
        </div>
      )}

      <div className={`relationships-list ${viewMode}`}>
        {filteredRelationships.length === 0 ? (
          <div className="empty-state">
            <Network size={48} />
            <h4>暂无关系</h4>
            <p>开始创建文档之间的关联关系</p>
            <button 
              className="create-first-btn"
              onClick={() => setActiveTab('create')}
            >
              <Plus size={16} />
              创建第一个关系
            </button>
          </div>
        ) : (
          filteredRelationships.map(relationship => {
            const sourceDoc = documents.find(d => d.id === relationship.sourceDocId);
            const targetDoc = documents.find(d => d.id === relationship.targetDocId);
            const type = relationshipTypes.find(t => t.id === relationship.type);
            const isSelected = selectedRelationships.includes(relationship.id);
            
            return (
              <div
                key={relationship.id}
                className={`relationship-item ${isSelected ? 'selected' : ''}`}
              >
                <div className="relationship-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRelationships(prev => [...prev, relationship.id]);
                      } else {
                        setSelectedRelationships(prev => prev.filter(id => id !== relationship.id));
                      }
                    }}
                  />
                </div>
                
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
                      {new Date(relationship.createdAt).toLocaleDateString()}
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
          })
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
            { id: 'create', label: '创建关系', icon: Plus },
            { id: 'list', label: '关系列表', icon: Network },
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
          {activeTab === 'create' && renderCreateRelationship()}
          {activeTab === 'list' && renderRelationshipsList()}
          {activeTab === 'suggestions' && renderSuggestions()}
        </div>
      </div>
    </div>
  );
};

export default RelationshipManagerEnhanced;
