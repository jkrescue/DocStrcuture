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
  Zap
} from 'lucide-react';
import BlockEditor from '../components/BlockEditor/BlockEditor';
import SearchPanel from '../components/SearchPanel/SearchPanel';
import TemplateCenter from '../components/TemplateCenter/TemplateCenter';
import TemplateCenterEnhanced from '../components/TemplateCenter/TemplateCenter_Enhanced';
import VersionPanel from '../components/VersionPanel/VersionPanel';
import GraphViewer from '../components/GraphViewer/GraphViewer';
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
    setCollaborativeMode
  } = useDocStore();

  const [activePanel, setActivePanel] = useState('editor');
  const [showSidebar, setShowSidebar] = useState(true);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [useEnhancedTemplateCenter, setUseEnhancedTemplateCenter] = useState(true);

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
        return <VersionPanel document={currentDocument} />;
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
            <div style={{ flex: 1, padding: '20px 40px', backgroundColor: '#fafbfc', overflow: 'auto' }}>
              {currentDocument ? (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <BlockEditor
                    blocks={currentDocument.blocks || []}
                    onBlocksChange={handleBlocksChange}
                    editable={true}
                  />
                </div>
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
                      onClick={() => createNewDocument()}
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
              onClick={() => createNewDocument()}
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
            {/* 工作区文档 */}
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
                我的文档 ({documents.length})
              </div>
              {workspaceExpanded && (
                <div style={{ marginTop: '8px' }}>
                  {documents.length > 0 ? (
                    documents.map(renderDocumentItem)
                  ) : (
                    <div style={{ 
                      padding: '12px',
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '12px'
                    }}>
                      还没有文档
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
        <div style={{ 
          height: '56px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '12px'
        }}>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              padding: '8px',
              border: 'none',
              background: 'transparent',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <FolderOpen size={18} />
          </button>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activePanel === 'templates' && (
              <button
                onClick={() => setUseEnhancedTemplateCenter(!useEnhancedTemplateCenter)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: useEnhancedTemplateCenter ? '#3b82f6' : 'white',
                  color: useEnhancedTemplateCenter ? 'white' : '#6b7280',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <Sparkles size={14} />
                {useEnhancedTemplateCenter ? '增强版' : '基础版'}
              </button>
            )}
            
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
              <Save size={14} />
              保存
            </button>

            <button
              style={{
                padding: '8px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              <Bell size={16} />
            </button>
            
            <button
              style={{
                padding: '8px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* 主要内容 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default EditorDemo;