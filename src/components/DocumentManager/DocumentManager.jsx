import React, { useState, useEffect } from 'react';
import useDocStore from '../../stores/docStore';
import './DocumentManager.css';

const DocumentManager = ({ onDocumentSelect, onClose }) => {
  const { 
    documents, 
    currentDocument,
    addDocument, 
    removeDocument, 
    setCurrentDocument,
    templates
  } = useDocStore();

  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [sortBy, setSortBy] = useState('updatedAt'); // updatedAt | createdAt | title
  const [sortOrder, setSortOrder] = useState('desc'); // asc | desc
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // 创建新文档
  const handleCreateDocument = (templateId = null) => {
    const template = templateId ? templates.find(t => t.id === templateId) : null;
    const newDocument = {
      id: `doc_${Date.now()}`,
      title: template ? `新建${template.name}` : '新建文档',
      description: template?.description || '',
      blocks: template?.blocks ? [...template.blocks.map((block, index) => ({
        ...block,
        id: `block_${Date.now()}_${index}`
      }))] : [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: '当前用户',
        version: '1.0.0',
        templateId: templateId,
        category: template?.category || 'document',
        tags: []
      }
    };

    addDocument(newDocument);
    setCurrentDocument(newDocument);
    setShowNewDocumentModal(false);
    
    if (onDocumentSelect) {
      onDocumentSelect(newDocument);
    }
  };

  // 删除文档
  const handleDeleteDocument = (documentId, event) => {
    event.stopPropagation();
    if (window.confirm('确定要删除这个文档吗？')) {
      removeDocument(documentId);
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  // 选择文档
  const handleDocumentSelect = (document) => {
    setCurrentDocument(document);
    if (onDocumentSelect) {
      onDocumentSelect(document);
    }
  };

  // 排序文档
  const sortedDocuments = [...documents].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title || '';
        bValue = b.title || '';
        break;
      case 'createdAt':
        aValue = new Date(a.metadata?.createdAt || 0);
        bValue = new Date(b.metadata?.createdAt || 0);
        break;
      case 'updatedAt':
      default:
        aValue = new Date(a.metadata?.updatedAt || 0);
        bValue = new Date(b.metadata?.updatedAt || 0);
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取文档预览内容
  const getDocumentPreview = (document) => {
    if (!document.blocks || document.blocks.length === 0) {
      return '空文档';
    }
    
    const textBlock = document.blocks.find(block => 
      block.type === 'text' && block.content?.text
    );
    
    if (textBlock) {
      const text = textBlock.content.text.replace(/[#*\n]/g, ' ').trim();
      return text.length > 100 ? text.substring(0, 100) + '...' : text;
    }
    
    return `包含 ${document.blocks.length} 个块`;
  };

  return (
    <div className="document-manager">
      {/* 头部工具栏 */}
      <div className="document-manager-header">
        <div className="header-left">
          <h2>文档管理</h2>
          <span className="document-count">{documents.length} 个文档</span>
        </div>
        
        <div className="header-actions">
          {/* 视图切换 */}
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="网格视图"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="列表视图"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </button>
          </div>

          {/* 排序选择 */}
          <select 
            className="sort-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <option value="updatedAt-desc">最近修改</option>
            <option value="updatedAt-asc">最早修改</option>
            <option value="createdAt-desc">最近创建</option>
            <option value="createdAt-asc">最早创建</option>
            <option value="title-asc">标题 A-Z</option>
            <option value="title-desc">标题 Z-A</option>
          </select>

          {/* 新建文档按钮 */}
          <button 
            className="btn btn-primary"
            onClick={() => setShowNewDocumentModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            新建文档
          </button>

          {/* 关闭按钮 */}
          {onClose && (
            <button className="btn btn-secondary" onClick={onClose}>
              关闭
            </button>
          )}
        </div>
      </div>

      {/* 文档列表 */}
      <div className={`document-list ${viewMode}`}>
        {sortedDocuments.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
            </svg>
            <h3>还没有文档</h3>
            <p>点击"新建文档"开始创建您的第一个文档</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowNewDocumentModal(true)}
            >
              新建文档
            </button>
          </div>
        ) : (
          sortedDocuments.map(document => (
            <div 
              key={document.id}
              className={`document-item ${currentDocument?.id === document.id ? 'active' : ''}`}
              onClick={() => handleDocumentSelect(document)}
            >
              <div className="document-header">
                <h3 className="document-title">{document.title || '未命名文档'}</h3>
                <div className="document-actions">
                  <button 
                    className="action-btn"
                    onClick={(e) => handleDeleteDocument(document.id, e)}
                    title="删除文档"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84L14.962 3.5H15.5a.5.5 0 0 0 0-1h-1.004a.58.58 0 0 0-.01 0H11Zm1.938 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.896Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="document-meta">
                <span className="document-category">
                  {document.metadata?.category === 'document' && '📄'}
                  {document.metadata?.category === 'meeting' && '📅'}
                  {document.metadata?.category === 'report' && '📊'}
                  {document.metadata?.category || '📄'} 
                </span>
                <span className="document-author">
                  {document.metadata?.author || '未知作者'}
                </span>
                <span className="document-date">
                  {formatDate(document.metadata?.updatedAt)}
                </span>
              </div>
              
              <div className="document-preview">
                {getDocumentPreview(document)}
              </div>
              
              <div className="document-stats">
                <span className="block-count">
                  {document.blocks?.length || 0} 个块
                </span>
                {document.metadata?.templateId && (
                  <span className="template-indicator">
                    基于模板
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 新建文档模态框 */}
      {showNewDocumentModal && (
        <div className="modal-overlay" onClick={() => setShowNewDocumentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>新建文档</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNewDocumentModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="template-grid">
                {/* 空白文档 */}
                <div 
                  className="template-item"
                  onClick={() => handleCreateDocument()}
                >
                  <div className="template-icon">📄</div>
                  <h4>空白文档</h4>
                  <p>从零开始创建文档</p>
                </div>
                
                {/* 模板选项 */}
                {templates.filter(t => t.featured).map(template => (
                  <div 
                    key={template.id}
                    className="template-item"
                    onClick={() => handleCreateDocument(template.id)}
                  >
                    <div className="template-icon">
                      {template.category === 'document' && '📋'}
                      {template.category === 'meeting' && '📅'}
                      {template.category === 'report' && '📊'}
                    </div>
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;