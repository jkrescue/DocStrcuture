import React, { useState, useEffect } from 'react';
import { 
  Network, Plus, Trash2, Edit3, Eye, Link2, 
  ArrowRight, GitBranch, Zap, Brain, Target,
  Search, Filter, Settings, Download, Share2,
  ChevronDown, ChevronRight, Tag, Clock
} from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const RelationshipManager = ({ documentId, onClose }) => {
  const {
    documents,
    documentRelationships,
    blockRelationships,
    addDocumentRelationship,
    addBlockRelationship,
    removeDocumentRelationship,
    removeBlockRelationship,
    getDocumentRelationships,
    suggestRelationships
  } = useDocStore();

  const [activeTab, setActiveTab] = useState('documents'); // documents, blocks, suggestions
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [relationType, setRelationType] = useState('relates');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const currentDocument = documents.find(doc => doc.id === documentId);
  const currentRelationships = getDocumentRelationships(documentId);

  // 关系类型定义
  const relationshipTypes = [
    { id: 'relates', label: '相关', color: '#6b7280', description: '内容相关或主题相近' },
    { id: 'derives', label: '衍生', color: '#3b82f6', description: '从源文档衍生或扩展' },
    { id: 'references', label: '引用', color: '#10b981', description: '引用或参考源文档' },
    { id: 'conflicts', label: '冲突', color: '#ef4444', description: '观点或内容存在冲突' },
    { id: 'implements', label: '实现', color: '#8b5cf6', description: '具体实现或执行源文档' },
    { id: 'replaces', label: '替代', color: '#f59e0b', description: '替代或更新源文档' }
  ];

  useEffect(() => {
    if (documentId) {
      const suggestions = suggestRelationships(documentId);
      setSuggestions(suggestions);
    }
  }, [documentId, suggestRelationships]);

  // 过滤文档
  const filteredDocuments = documents.filter(doc => 
    doc.id !== documentId && 
    (searchQuery === '' || doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 创建关系
  const handleCreateRelationship = () => {
    if (selectedSource && selectedTarget && relationType) {
      if (activeTab === 'documents') {
        addDocumentRelationship(selectedSource, selectedTarget, relationType, description);
      } else {
        addBlockRelationship(selectedSource, selectedTarget, relationType, description);
      }
      
      // 重置表单
      setSelectedSource(null);
      setSelectedTarget(null);
      setDescription('');
    }
  };

  // 应用建议的关系
  const applySuggestion = (suggestion) => {
    addDocumentRelationship(
      documentId, 
      suggestion.targetDocId, 
      suggestion.suggestedType, 
      suggestion.reason
    );
    setSuggestions(prev => prev.filter(s => s.targetDocId !== suggestion.targetDocId));
  };

  // 渲染文档关系tab
  const renderDocumentRelationships = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Network size={20} />
          文档关系管理
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr auto', 
          gap: '12px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500', 
              marginBottom: '4px',
              color: '#374151'
            }}>
              源文档
            </label>
            <select
              value={selectedSource || ''}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">选择源文档</option>
              <option value={documentId}>{currentDocument?.title} (当前)</option>
              {filteredDocuments.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500', 
              marginBottom: '4px',
              color: '#374151'
            }}>
              目标文档
            </label>
            <select
              value={selectedTarget || ''}
              onChange={(e) => setSelectedTarget(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">选择目标文档</option>
              {filteredDocuments.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500', 
              marginBottom: '4px',
              color: '#374151'
            }}>
              关系类型
            </label>
            <select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {relationshipTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateRelationship}
            disabled={!selectedSource || !selectedTarget}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedSource && selectedTarget ? '#3b82f6' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: selectedSource && selectedTarget ? 'pointer' : 'not-allowed',
              fontWeight: '500',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} />
            添加关系
          </button>
        </div>

        <div style={{ marginTop: '12px' }}>
          <input
            type="text"
            placeholder="关系描述（可选）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* 现有关系列表 */}
      <div>
        <h4 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '16px',
          color: '#111827'
        }}>
          已建立的关系 ({currentRelationships.length})
        </h4>

        {currentRelationships.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px dashed #d1d5db'
          }}>
            <Network size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>暂无文档关系</p>
            <p style={{ fontSize: '14px' }}>开始建立文档之间的关联关系</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentRelationships.map(relationship => {
              const sourceDoc = documents.find(d => d.id === relationship.sourceDocId);
              const targetDoc = documents.find(d => d.id === relationship.targetDocId);
              const type = relationshipTypes.find(t => t.id === relationship.type);
              
              return (
                <div
                  key={relationship.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontWeight: '500', fontSize: '14px' }}>
                        {sourceDoc?.title}
                      </span>
                      <ArrowRight size={14} color="#6b7280" />
                      <span style={{ fontWeight: '500', fontSize: '14px' }}>
                        {targetDoc?.title}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: type?.color + '20',
                          color: type?.color,
                          fontWeight: '500'
                        }}
                      >
                        {type?.label}
                      </span>
                      
                      {relationship.description && (
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {relationship.description}
                        </span>
                      )}
                      
                      <span style={{ 
                        fontSize: '11px', 
                        color: '#9ca3af',
                        marginLeft: 'auto'
                      }}>
                        {new Date(relationship.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeDocumentRelationship(relationship.id)}
                    style={{
                      padding: '6px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // 渲染建议tab
  const renderSuggestions = () => (
    <div style={{ padding: '20px' }}>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Brain size={20} />
        智能推荐关系
      </h3>

      {suggestions.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px dashed #d1d5db'
        }}>
          <Brain size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>暂无推荐关系</p>
          <p style={{ fontSize: '14px' }}>系统正在分析文档内容以发现潜在关系</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {suggestions.map(suggestion => {
            const targetDoc = documents.find(d => d.id === suggestion.targetDocId);
            const type = relationshipTypes.find(t => t.id === suggestion.suggestedType);
            
            return (
              <div
                key={suggestion.targetDocId}
                style={{
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontWeight: '500', fontSize: '14px' }}>
                      {currentDocument?.title}
                    </span>
                    <ArrowRight size={14} color="#6b7280" />
                    <span style={{ fontWeight: '500', fontSize: '14px' }}>
                      {targetDoc?.title}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: type?.color + '20',
                        color: type?.color,
                        fontWeight: '500'
                      }}
                    >
                      {type?.label}
                    </span>
                    
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {suggestion.reason}
                    </span>
                    
                    <span style={{ 
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      fontWeight: '500'
                    }}>
                      置信度: {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => applySuggestion(suggestion)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={12} />
                  应用
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 头部 */}
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '4px'
            }}>
              关系管理器
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              管理 "{currentDocument?.title}" 的文档关系
            </p>
          </div>
          
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab导航 */}
        <div style={{ 
          padding: '0 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: '24px'
        }}>
          {[
            { id: 'documents', label: '文档关系', icon: Network },
            { id: 'suggestions', label: '智能推荐', icon: Brain }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 0',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'documents' && renderDocumentRelationships()}
          {activeTab === 'suggestions' && renderSuggestions()}
        </div>
      </div>
    </div>
  );
};

export default RelationshipManager;
