import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Bell, 
  User, 
  Settings, 
  Plus, 
  FolderOpen,
  Users,
  History,
  Download,
  Share2,
  Eye,
  Edit3,
  Layout,
  Network,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Hash,
  Clock,
  Save,
  Zap,
  MessageSquare
} from 'lucide-react';
import BlockEditor from '../components/BlockEditor/BlockEditor';
import DocumentManager from '../components/DocumentManager/DocumentManager';
import SearchPanel from '../components/SearchPanel/SearchPanel';
import TemplateCenter from '../components/TemplateCenter/TemplateCenter';
import TemplateCenterEnhanced from '../components/TemplateCenter/TemplateCenter_Enhanced';
import VersionPanel from '../components/VersionPanel/VersionPanel';
import VersionPanelEnhanced from '../components/VersionPanel/VersionPanel_Enhanced';
import GraphViewer from '../components/GraphViewer/GraphViewer';
import NewDocumentModal from '../components/NewDocumentModal/NewDocumentModal';
import RelationshipManager from '../components/RelationshipManager/RelationshipManager';
import RelationshipManagerEnhanced from '../components/RelationshipManager/RelationshipManagerEnhanced';
import SimpleCollaborationPanel from '../components/CollaborationPanel/SimpleCollaborationPanel';
import AIDocumentAnalyzer from '../components/AIAssistant/AIDocumentAnalyzer_Fixed';
import { useDocStore } from '../stores/docStore';

const EditorDemo = () => {
  const {
    currentDocument,
    documents,
    templates,
    versions,
    searchQuery,
    selectedBlocks,
    isCollaborativeMode,
    setCurrentDocument,
    updateCurrentDocument,
    addDocument,
    setSearchQuery,
    addBlockToDocument,
    updateBlockInDocument,
    deleteBlockFromDocument,
    setSelectedBlocks,
    setCollaborativeMode,
    getRecentlyOpenedDocuments
  } = useDocStore();

  const [activePanel, setActivePanel] = useState('editor');
  const [showSidebar, setShowSidebar] = useState(true);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [useEnhancedTemplateCenter, setUseEnhancedTemplateCenter] = useState(true);
  const [useEnhancedVersionPanel, setUseEnhancedVersionPanel] = useState(true);
  const [useEnhancedBlockEditor, setUseEnhancedBlockEditor] = useState(true);
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [showRelationshipManager, setShowRelationshipManager] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [showAIAnalyzer, setShowAIAnalyzer] = useState(false);

  // 创建新文档
  const createNewDocument = (template = null) => {
    const newDoc = {
      id: `doc_${Date.now()}`,
      title: template ? `基于${template.name}的新文档` : '无标题文档',
      content: template ? template.content : [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'current_user',
        tags: template ? template.tags : [],
        collaborators: [],
        status: 'draft'
      },
      blocks: template ? template.blocks || [] : []
    };

    addDocument(newDoc);
    setCurrentDocument(newDoc);
    setActivePanel('editor');
  };

  // 处理新文档创建
  const handleCreateDocument = (newDoc) => {
    addDocument(newDoc);
    setCurrentDocument(newDoc);
    setActivePanel('editor');
    setShowNewDocumentModal(false);
  };

  // 更新文档标题
  const updateDocumentTitle = (title) => {
    if (currentDocument) {
      updateCurrentDocument({
        title,
        metadata: {
          ...currentDocument.metadata,
          updatedAt: new Date().toISOString()
        }
      });
    }
  };

  // 处理块变化
  const handleBlocksChange = (blocks) => {
    if (currentDocument) {
      updateCurrentDocument({
        blocks,
        metadata: {
          ...currentDocument.metadata,
          updatedAt: new Date().toISOString()
        }
      });
    }
  };

  // 侧边栏文档项
  const renderDocumentItem = (doc) => (
    <div
      key={doc.id}
      onClick={() => {
        setCurrentDocument(doc);
        setActivePanel('editor');
      }}
      style={{
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: currentDocument?.id === doc.id ? '#eff6ff' : 'transparent',
        borderLeft: currentDocument?.id === doc.id ? '3px solid #3b82f6' : '3px solid transparent',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (currentDocument?.id !== doc.id) {
          e.target.style.backgroundColor = '#f8fafc';
        }
      }}
      onMouseLeave={(e) => {
        if (currentDocument?.id !== doc.id) {
          e.target.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <FileText size={16} color="#6b7280" />
        <span style={{ color: '#374151', fontWeight: currentDocument?.id === doc.id ? '500' : '400' }}>
          {doc.title}
        </span>
      </div>
      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px', marginLeft: '24px' }}>
        {new Date(doc.metadata.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );

  // 主界面渲染
  const renderMainContent = () => {
    switch (activePanel) {
      case 'documents':
        return (
          <DocumentManager 
            onDocumentSelect={(document) => {
              setCurrentDocument(document);
              setActivePanel('editor');
            }}
            onClose={() => setActivePanel('editor')}
          />
        );
      case 'search':
        return <SearchPanel onSelectDocument={setCurrentDocument} />;
      case 'templates':
        return useEnhancedTemplateCenter ? 
          <TemplateCenterEnhanced 
            onClose={() => setActivePanel('editor')}
            onApplyTemplate={createNewDocument} 
          /> : 
          <TemplateCenter onSelectTemplate={createNewDocument} />;
      case 'versions':
        return useEnhancedVersionPanel ? 
          <VersionPanelEnhanced 
            onClose={() => setActivePanel('editor')}
            document={currentDocument}
          /> : 
          <VersionPanel document={currentDocument} />;
      case 'graph':
        return <GraphViewer />;
      case 'editor':
      default:
        return (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 文档标题区域 */}
            {currentDocument && (
              <div style={{ 
                padding: '20px 40px', 
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={currentDocument.title}
                    onChange={(e) => updateDocumentTitle(e.target.value)}
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: '#1f2937',
                      flex: 1,
                      padding: '4px 0'
                    }}
                    placeholder="无标题文档"
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setCollaborativeMode(!isCollaborativeMode)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        border: `1px solid ${isCollaborativeMode ? '#3b82f6' : '#d1d5db'}`,
                        borderRadius: '6px',
                        background: isCollaborativeMode ? '#eff6ff' : 'white',
                        color: isCollaborativeMode ? '#3b82f6' : '#6b7280',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <Users size={14} />
                      协作模式
                    </button>
                    <button
                      onClick={() => setShowRelationshipManager(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        background: 'white',
                        color: '#6b7280',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <Network size={14} />
                      关系管理
                    </button>
                    <button
                      onClick={() => setShowAIAnalyzer(!showAIAnalyzer)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        border: `1px solid ${showAIAnalyzer ? '#667eea' : '#d1d5db'}`,
                        borderRadius: '6px',
                        background: showAIAnalyzer ? '#f3f4f6' : 'white',
                        color: showAIAnalyzer ? '#667eea' : '#6b7280',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <Sparkles size={14} />
                      AI分析
                    </button>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        background: 'white',
                        color: '#6b7280',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <Share2 size={14} />
                      分享
                    </button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    最后编辑：{new Date(currentDocument.metadata.updatedAt).toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} />
                    作者：{currentDocument.metadata.author}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Hash size={12} />
                    {currentDocument.blocks?.length || 0} 个内容块
                  </div>
                </div>
              </div>
            )}

            {/* 编辑器内容 */}
            <div style={{ 
              flex: 1, 
              padding: '20px 40px', 
              backgroundColor: '#fafbfc', 
              overflow: 'auto',
              display: 'flex',
              gap: '20px'
            }}>
              {/* 主编辑区 */}
              <div style={{ 
                flex: showAIAnalyzer ? '1' : '1',
                maxWidth: showAIAnalyzer ? 'calc(100% - 420px)' : '800px',
                margin: showAIAnalyzer ? '0' : '0 auto',
                transition: 'all 0.3s ease'
              }}>
                {currentDocument ? (
                  <BlockEditor
                    blocks={currentDocument.blocks || []}
                    onBlocksChange={handleBlocksChange}
                    editable={true}
                    enhanced={useEnhancedBlockEditor}
                    document={currentDocument}
                  />
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px',
                    color: '#6b7280'
                  }}>
                    <Sparkles size={48} style={{ margin: '0 auto 20px', color: '#d1d5db' }} />
                    <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#374151' }}>
                      欢迎使用文档编辑器
                    </h3>
                    <p style={{ marginBottom: '20px' }}>
                      开始创建你的第一个文档，或从模板中选择一个
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        onClick={() => setShowNewDocumentModal(true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={16} />
                        新建文档
                      </button>
                      <button
                        onClick={() => setActivePanel('templates')}
                        style={{
                          display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        backgroundColor: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      <Layout size={16} />
                      使用模板
                    </button>
                  </div>
                </div>
              )}
              </div>
              
              {/* AI分析器侧边栏 */}
              {showAIAnalyzer && currentDocument && (
                <div style={{
                  width: '400px',
                  flexShrink: 0,
                  transition: 'all 0.3s ease'
                }}>
                  <AIDocumentAnalyzer 
                    document={currentDocument}
                    onClose={() => setShowAIAnalyzer(false)}
                  />
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 侧边栏 */}
      {showSidebar && (
        <div style={{ 
          width: '280px', 
          backgroundColor: '#f8fafc', 
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* 侧边栏头部 */}
          <div style={{ 
            padding: '16px', 
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                backgroundColor: '#3b82f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={18} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '16px', color: '#1f2937' }}>
                  文档工作台
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  专业文档编辑
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowNewDocumentModal(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              新建文档
            </button>
          </div>

          {/* 导航菜单 */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { id: 'documents', label: '文档管理', icon: FolderOpen },
                { id: 'editor', label: '编辑器', icon: Edit3 },
                { id: 'search', label: '全局搜索', icon: Search },
                { id: 'templates', label: '模板中心', icon: Layout },
                { id: 'versions', label: '版本历史', icon: History },
                { id: 'graph', label: '关系图谱', icon: Network }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    backgroundColor: activePanel === item.id ? '#eff6ff' : 'transparent',
                    color: activePanel === item.id ? '#3b82f6' : '#6b7280',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 文档列表 */}
          <div style={{ flex: 1, padding: '12px 16px', overflow: 'auto' }}>
            {/* 最近打开的文档 */}
            <div style={{ marginBottom: '16px' }}>
              <div
                onClick={() => setWorkspaceExpanded(!workspaceExpanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 0',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {workspaceExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                最近打开 ({getRecentlyOpenedDocuments(6).length})
              </div>
              {workspaceExpanded && (
                <div style={{ marginTop: '8px' }}>
                  {getRecentlyOpenedDocuments(6).length > 0 ? (
                    getRecentlyOpenedDocuments(6).map(renderDocumentItem)
                  ) : (
                    <div style={{ 
                      padding: '12px',
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '12px'
                    }}>
                      还没有打开过文档
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 模板快速访问 */}
            <div style={{ marginBottom: '16px' }}>
              <div
                onClick={() => setTemplatesExpanded(!templatesExpanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 0',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {templatesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                快速模板
              </div>
              {templatesExpanded && (
                <div style={{ marginTop: '8px' }}>
                  {templates.slice(0, 3).map(template => (
                    <div
                      key={template.id}
                      onClick={() => createNewDocument(template)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        fontSize: '13px',
                        color: '#6b7280'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Zap size={12} />
                        {template.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 侧边栏底部 */}
          <div style={{ 
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
              <User size={14} />
              <span>当前用户</span>
              <div style={{ marginLeft: 'auto' }}>
                <Settings size={14} style={{ cursor: 'pointer' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 顶部工具栏 */}
        <div className="toolbar-responsive">
          {/* 左侧区域 */}
          <div className="toolbar-section" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="toolbar-button"
              style={{
                padding: '10px',
                border: 'none',
                background: 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#6b7280',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <FolderOpen size={20} />
            </button>

            {/* 当前文档标题 */}
            {currentDocument && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 0'
              }}>
                <FileText size={16} color="#6b7280" />
                <span className="toolbar-title" style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {currentDocument.title}
                </span>
              </div>
            )}
          </div>

          <div style={{ flex: 1 }} />

          {/* 右侧工具区域 */}
          <div className="toolbar-section" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '4px 0'
          }}>
            {activePanel === 'editor' && currentDocument && (
              <div className="toolbar-section toolbar-divider" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                borderLeft: '1px solid #e5e7eb',
                paddingLeft: '16px'
              }}>
                {/* 编辑器状态标识 */}
                <div className="toolbar-button" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: currentDocument.metadata?.editorType === 'blocknote' ? '#dbeafe' : '#f8fafc',
                  color: currentDocument.metadata?.editorType === 'blocknote' ? '#1e40af' : '#475569',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: '1px solid',
                  borderColor: currentDocument.metadata?.editorType === 'blocknote' ? '#bfdbfe' : '#e2e8f0'
                }}>
                  <Sparkles size={14} />
                  <span>{currentDocument.metadata?.editorType === 'blocknote' ? 'Notion编辑器' : '块编辑器'}</span>
                </div>
                
                {/* 传统编辑器才显示切换按钮 */}
                {currentDocument.metadata?.editorType !== 'blocknote' && (
                  <button
                    onClick={() => setUseEnhancedBlockEditor(!useEnhancedBlockEditor)}
                    className="toolbar-button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      background: useEnhancedBlockEditor ? '#4f46e5' : 'white',
                      color: useEnhancedBlockEditor ? 'white' : '#6b7280',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Edit3 size={14} />
                    <span>{useEnhancedBlockEditor ? '增强版' : '切换增强'}</span>
                  </button>
                )}
              </div>
            )}

            {activePanel === 'templates' && (
              <div className="toolbar-section toolbar-divider" style={{ 
                borderLeft: '1px solid #e5e7eb',
                paddingLeft: '16px'
              }}>
                <button
                  onClick={() => setUseEnhancedTemplateCenter(!useEnhancedTemplateCenter)}
                  className="toolbar-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: useEnhancedTemplateCenter ? '#059669' : 'white',
                    color: useEnhancedTemplateCenter ? 'white' : '#6b7280',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Layout size={14} />
                  <span>{useEnhancedTemplateCenter ? '增强模式' : '切换增强'}</span>
                </button>
              </div>
            )}

            {activePanel === 'versions' && (
              <div className="toolbar-section toolbar-divider" style={{ 
                borderLeft: '1px solid #e5e7eb',
                paddingLeft: '16px'
              }}>
                <button
                  onClick={() => setUseEnhancedVersionPanel(!useEnhancedVersionPanel)}
                  className="toolbar-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: useEnhancedVersionPanel ? '#dc2626' : 'white',
                    color: useEnhancedVersionPanel ? 'white' : '#6b7280',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <History size={14} />
                  <span>{useEnhancedVersionPanel ? '增强模式' : '切换增强'}</span>
                </button>
              </div>
            )}
            {/* 操作按钮组 */}
            <div className="toolbar-section toolbar-divider" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              borderLeft: '1px solid #e5e7eb',
              paddingLeft: '16px'
            }}>
              <button
                className="toolbar-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#6b7280',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f8fafc';
                  e.target.style.borderColor = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <Save size={14} />
                <span>保存</span>
              </button>

              {activePanel === 'editor' && currentDocument && (
                <button
                  onClick={() => setShowCollaborationPanel(true)}
                  className="toolbar-collaboration-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    position: 'relative',
                    boxShadow: '0 2px 8px rgba(78, 205, 196, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(78, 205, 196, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(78, 205, 196, 0.3)';
                  }}
                >
                  <MessageSquare size={16} />
                  <span>协作</span>
                  {/* 通知徽章 */}
                  <span className="notification-badge" style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '2px 6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    minWidth: '20px',
                    textAlign: 'center',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    3
                  </span>
                </button>
              )}
            </div>

            {/* 用户操作区域 */}
            <div className="toolbar-section toolbar-divider" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              borderLeft: '1px solid #e5e7eb',
              paddingLeft: '16px'
            }}>
              <button
                className="toolbar-button"
                style={{
                  padding: '10px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <Bell size={18} />
              </button>
              
              <button
                className="toolbar-button"
                style={{
                  padding: '10px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderMainContent()}
        </div>
      </div>

      {/* 新建文档模态框 */}
      <NewDocumentModal
        isOpen={showNewDocumentModal}
        onClose={() => setShowNewDocumentModal(false)}
        onCreateDocument={handleCreateDocument}
      />

      {/* 关系管理器 */}
      {showRelationshipManager && currentDocument && (
        <RelationshipManagerEnhanced
          isOpen={showRelationshipManager}
          documentId={currentDocument.id}
          onClose={() => setShowRelationshipManager(false)}
        />
      )}

      {/* 协作面板 */}
      {showCollaborationPanel && currentDocument && (
        <SimpleCollaborationPanel
          documentId={currentDocument.id}
          documentTitle={currentDocument.title}
          currentUser={{
            id: 'current_user',
            name: 'current_user',
            avatar: '👤',
            department: '技术部',
            role: 'developer'
          }}
          isOpen={showCollaborationPanel}
          onClose={() => setShowCollaborationPanel(false)}
        />
      )}
    </div>
  );
};

export default EditorDemo;