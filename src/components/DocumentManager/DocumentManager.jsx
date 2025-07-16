import React, { useState, useEffect } from 'react';
import useDocStore from '../../stores/docStore';
import './DocumentManager.css';

const DocumentManager = ({ onDocumentSelect, onClose }) => {
  const { 
    documents, 
    folders,
    currentDocument,
    currentFolderId,
    addDocument, 
    removeDocument,
    removeMultipleDocuments,
    moveDocuments,
    duplicateDocument,
    setCurrentDocument,
    setCurrentFolder,
    addFolder,
    removeFolder,
    updateFolder,
    getDocumentsInFolder,
    getSubfolders,
    getFolderPath,
    templates
  } = useDocStore();

  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [sortBy, setSortBy] = useState('updatedAt'); // updatedAt | createdAt | title
  const [sortOrder, setSortOrder] = useState('desc'); // asc | desc
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3b82f6');

  // 获取当前文件夹的内容
  const currentFolderDocuments = getDocumentsInFolder(currentFolderId);
  const currentSubfolders = getSubfolders(currentFolderId);
  const folderPath = getFolderPath(currentFolderId);
  
  // 创建新文档
  const handleCreateDocument = (templateId = null) => {
    const template = templateId ? templates.find(t => t.id === templateId) : null;
    const newDocument = {
      id: `doc_${Date.now()}`,
      title: template ? `新建${template.name}` : '新建文档',
      description: template?.description || '',
      folderId: currentFolderId, // 在当前文件夹中创建
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

  // 创建新文件夹
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      name: newFolderName,
      parentId: currentFolderId,
      color: newFolderColor,
      metadata: {
        author: '当前用户'
      }
    };

    addFolder(newFolder);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  // 删除文档
  const handleDeleteDocument = (documentId, event) => {
    event.stopPropagation();
    if (window.confirm('确定要删除这个文档吗？')) {
      removeDocument(documentId);
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  // 批量删除文档
  const handleBatchDelete = () => {
    if (selectedDocuments.length === 0) return;
    
    const count = selectedDocuments.length;
    if (window.confirm(`确定要删除选中的 ${count} 个文档吗？`)) {
      removeMultipleDocuments(selectedDocuments);
      setSelectedDocuments([]);
      setIsSelectMode(false);
    }
  };

  // 批量移动文档
  const handleBatchMove = (targetFolderId) => {
    if (selectedDocuments.length === 0) return;
    
    moveDocuments(selectedDocuments, targetFolderId);
    setSelectedDocuments([]);
    setIsSelectMode(false);
    setShowMoveModal(false);
  };

  // 复制文档
  const handleDuplicateDocument = (documentId, event) => {
    event.stopPropagation();
    duplicateDocument(documentId);
  };

  // 选择/取消选择文档
  const handleSelectDocument = (documentId, event) => {
    event.stopPropagation();
    
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    } else {
      setSelectedDocuments(prev => [...prev, documentId]);
    }
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedDocuments.length === currentFolderDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(currentFolderDocuments.map(doc => doc.id));
    }
  };

  // 进入文件夹
  const handleEnterFolder = (folderId) => {
    setCurrentFolder(folderId);
    setSelectedDocuments([]);
    setIsSelectMode(false);
  };

  // 返回上级文件夹
  const handleGoBack = () => {
    const parent = folderPath.length > 1 ? folderPath[folderPath.length - 2] : null;
    setCurrentFolder(parent?.id || null);
    setSelectedDocuments([]);
    setIsSelectMode(false);
  };

  // 删除文件夹
  const handleDeleteFolder = (folderId, event) => {
    event.stopPropagation();
    const folder = folders.find(f => f.id === folderId);
    const documentsCount = getDocumentsInFolder(folderId).length;
    const subfoldersCount = getSubfolders(folderId).length;
    
    let message = `确定要删除文件夹"${folder?.name}"吗？`;
    if (documentsCount > 0 || subfoldersCount > 0) {
      message += `\n文件夹中的 ${documentsCount} 个文档和 ${subfoldersCount} 个子文件夹将移动到上级目录。`;
    }
    
    if (window.confirm(message)) {
      removeFolder(folderId);
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
  const sortedDocuments = [...currentFolderDocuments].sort((a, b) => {
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
          <div className="header-title">
            <h2>文档管理</h2>
            <span className="document-count">
              {currentFolderDocuments.length} 个文档
              {currentSubfolders.length > 0 && `, ${currentSubfolders.length} 个文件夹`}
            </span>
          </div>
          
          {/* 面包屑导航 */}
          <div className="breadcrumb">
            <button 
              className="breadcrumb-item"
              onClick={() => setCurrentFolder(null)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
              </svg>
              根目录
            </button>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <span className="breadcrumb-separator">/</span>
                <button 
                  className="breadcrumb-item"
                  onClick={() => setCurrentFolder(folder.id)}
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="header-actions">
          {/* 批量操作工具栏 */}
          {isSelectMode && (
            <div className="batch-toolbar">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleSelectAll}
              >
                {selectedDocuments.length === currentFolderDocuments.length ? '取消全选' : '全选'}
              </button>
              <span className="selected-count">
                已选择 {selectedDocuments.length} 项
              </span>
              {selectedDocuments.length > 0 && (
                <>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowMoveModal(true)}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8.5 1.5a.5.5 0 0 0-1 0V4H5a.5.5 0 0 0 0 1h2.5v2.5a.5.5 0 0 0 1 0V5H11a.5.5 0 0 0 0-1H8.5V1.5z"/>
                      <path fillRule="evenodd" d="M13.5 9.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h11zm-.5 1H3v3h10v-3z"/>
                    </svg>
                    移动
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={handleBatchDelete}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84L14.962 3.5H15.5a.5.5 0 0 0 0-1h-1.004a.58.58 0 0 0-.01 0H11Z"/>
                    </svg>
                    删除
                  </button>
                </>
              )}
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setIsSelectMode(false);
                  setSelectedDocuments([]);
                }}
              >
                取消
              </button>
            </div>
          )}

          {/* 普通工具栏 */}
          {!isSelectMode && (
            <>
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

              {/* 批量选择模式 */}
              {currentFolderDocuments.length > 0 && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsSelectMode(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"/>
                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V11h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                  </svg>
                  批量选择
                </button>
              )}

              {/* 新建文件夹按钮 */}
              <button 
                className="btn btn-secondary"
                onClick={() => setShowNewFolderModal(true)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M.5 3l.04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9.81a2 2 0 0 0 1.991-1.819l.637-7a1.99 1.99 0 0 0-.342-1.311L12.5 3H3.36a1 1 0 0 0-.928.629l-.44 1.056A1 1 0 0 0 1.04 5.4L.5 3zm5.64.422a.8.8 0 1 1 1.04.956l-.64 1.215a.8.8 0 0 1-1.04-.956l.64-1.215z"/>
                </svg>
                新建文件夹
              </button>

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
            </>
          )}
        </div>
      </div>

      {/* 文档和文件夹列表 */}
      <div className={`document-list ${viewMode}`}>
        {sortedDocuments.length === 0 && currentSubfolders.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
            </svg>
            <h3>文件夹为空</h3>
            <p>点击"新建文档"或"新建文件夹"开始创建内容</p>
            <div className="empty-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setShowNewDocumentModal(true)}
              >
                新建文档
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowNewFolderModal(true)}
              >
                新建文件夹
              </button>
            </div>
          </div>
        ) : (
          <div className="content-grid">
            {/* 文件夹列表 */}
            {currentSubfolders.map(folder => (
              <div 
                key={`folder-${folder.id}`}
                className="folder-item"
                onClick={() => handleEnterFolder(folder.id)}
              >
                <div className="folder-header">
                  <div className="folder-icon" style={{ color: folder.color }}>
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M.5 3l.04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14h9.81a2 2 0 0 0 1.991-1.819l.637-7a1.99 1.99 0 0 0-.342-1.311L12.5 3H3.36a1 1 0 0 0-.928.629l-.44 1.056A1 1 0 0 0 1.04 5.4L.5 3z"/>
                    </svg>
                  </div>
                  <h3 className="folder-title">{folder.name}</h3>
                  <div className="folder-actions">
                    <button 
                      className="action-btn"
                      onClick={(e) => handleDeleteFolder(folder.id, e)}
                      title="删除文件夹"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84L14.962 3.5H15.5a.5.5 0 0 0 0-1h-1.004a.58.58 0 0 0-.01 0H11Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="folder-meta">
                  <span className="folder-author">
                    {folder.metadata?.author || '未知作者'}
                  </span>
                  <span className="folder-date">
                    {formatDate(folder.metadata?.updatedAt)}
                  </span>
                </div>
                
                <div className="folder-stats">
                  <span className="item-count">
                    {getDocumentsInFolder(folder.id).length} 个文档
                  </span>
                  <span className="subfolder-count">
                    {getSubfolders(folder.id).length} 个子文件夹
                  </span>
                </div>
              </div>
            ))}

            {/* 文档列表 */}
            {sortedDocuments.map(document => (
              <div 
                key={document.id}
                className={`document-item ${currentDocument?.id === document.id ? 'active' : ''} ${selectedDocuments.includes(document.id) ? 'selected' : ''}`}
                onClick={() => handleDocumentSelect(document)}
              >
                {/* 复选框 */}
                {isSelectMode && (
                  <div className="document-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(document.id)}
                      onChange={(e) => handleSelectDocument(document.id, e)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                <div className="document-header">
                  <h3 className="document-title">{document.title || '未命名文档'}</h3>
                  <div className="document-actions">
                    <button 
                      className="action-btn"
                      onClick={(e) => handleDuplicateDocument(document.id, e)}
                      title="复制文档"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                      </svg>
                    </button>
                    <button 
                      className="action-btn"
                      onClick={(e) => handleDeleteDocument(document.id, e)}
                      title="删除文档"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84L14.962 3.5H15.5a.5.5 0 0 0 0-1h-1.004a.58.58 0 0 0-.01 0H11Z"/>
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
            ))}
          </div>
        )}
      </div>

      {/* 新建文件夹模态框 */}
      {showNewFolderModal && (
        <div className="modal-overlay" onClick={() => setShowNewFolderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>新建文件夹</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNewFolderModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="folder-name">文件夹名称</label>
                <input
                  id="folder-name"
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="输入文件夹名称"
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="folder-color">文件夹颜色</label>
                <div className="color-picker">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'].map(color => (
                    <button
                      key={color}
                      className={`color-option ${newFolderColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewFolderColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowNewFolderModal(false)}
                >
                  取消
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 移动文档模态框 */}
      {showMoveModal && (
        <div className="modal-overlay" onClick={() => setShowMoveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>移动文档</h3>
              <button 
                className="modal-close"
                onClick={() => setShowMoveModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p>选择目标文件夹（{selectedDocuments.length} 个文档）：</p>
              
              <div className="folder-tree">
                {/* 根目录选项 */}
                <div 
                  className={`folder-tree-item ${currentFolderId === null ? 'disabled' : ''}`}
                  onClick={() => currentFolderId !== null && handleBatchMove(null)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
                  </svg>
                  <span>根目录</span>
                  {currentFolderId === null && <span className="current-folder">（当前位置）</span>}
                </div>
                
                {/* 其他文件夹 */}
                {folders.map(folder => (
                  <div 
                    key={folder.id}
                    className={`folder-tree-item ${folder.id === currentFolderId ? 'disabled' : ''}`}
                    onClick={() => folder.id !== currentFolderId && handleBatchMove(folder.id)}
                    style={{ paddingLeft: `${(getFolderPath(folder.id).length - 1) * 20 + 20}px` }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: folder.color }}>
                      <path d="M.5 3l.04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14h9.81a2 2 0 0 0 1.991-1.819l.637-7a1.99 1.99 0 0 0-.342-1.311L12.5 3H3.36a1 1 0 0 0-.928.629l-.44 1.056A1 1 0 0 0 1.04 5.4L.5 3z"/>
                    </svg>
                    <span>{folder.name}</span>
                    {folder.id === currentFolderId && <span className="current-folder">（当前位置）</span>}
                  </div>
                ))}
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowMoveModal(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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