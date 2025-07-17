import React, { useState, useEffect } from 'react';
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
  MessageSquare,
  Brain,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Database,
  FileSearch,
  Target,
  Lightbulb
} from 'lucide-react';
import BlockEditor from '../components/BlockEditor/BlockEditor';
import DocumentManager from '../components/DocumentManager/DocumentManager';
import SearchPanel from '../components/SearchPanel/SearchPanel';
import TemplateCenter from '../components/TemplateCenter/TemplateCenter';
import VersionPanel from '../components/VersionPanel/VersionPanel';
import GraphViewer from '../components/GraphViewer/GraphViewer';
import NewDocumentModal from '../components/NewDocumentModal/NewDocumentModal';
import RelationshipManager from '../components/RelationshipManager/RelationshipManager';
import SimpleCollaborationPanel from '../components/CollaborationPanel/SimpleCollaborationPanel';
import AIAssistantTrigger from '../components/AIAssistant/AIAssistantTrigger';
import { useDocStore } from '../stores/docStore';
import './EditorDemoEnhanced.css';

// AI信息抽取面板组件
const AIExtractedInfoPanel = ({ documentContent, onConfirmField, onExport }) => {
  const [extractedFields, setExtractedFields] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (documentContent) {
      setIsAnalyzing(true);
      // 模拟AI信息抽取
      setTimeout(() => {
        const mockExtractedData = [
          {
            id: 'field_1',
            label: '项目名称',
            value: '2024年产品开发计划',
            confidence: 0.95,
            type: 'title',
            editable: true,
            confirmed: false
          },
          {
            id: 'field_2',
            label: '开始日期',
            value: '2024-01-15',
            confidence: 0.88,
            type: 'date',
            editable: true,
            confirmed: false
          },
          {
            id: 'field_3',
            label: '预算金额',
            value: '¥500,000',
            confidence: 0.92,
            type: 'currency',
            editable: true,
            confirmed: false
          },
          {
            id: 'field_4',
            label: '负责人',
            value: '张三',
            confidence: 0.78,
            type: 'person',
            editable: true,
            confirmed: false
          },
          {
            id: 'field_5',
            label: '联系邮箱',
            value: 'zhangsan@company.com',
            confidence: 0.85,
            type: 'email',
            editable: true,
            confirmed: false
          }
        ];
        setExtractedFields(mockExtractedData);
        setIsAnalyzing(false);
      }, 2000);
    }
  }, [documentContent]);

  const handleFieldEdit = (fieldId, newValue) => {
    setExtractedFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, value: newValue } : field
    ));
  };

  const handleFieldConfirm = (fieldId) => {
    setExtractedFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, confirmed: true } : field
    ));
    onConfirmField?.(fieldId);
  };

  const handleExportData = (format) => {
    const confirmedFields = extractedFields.filter(field => field.confirmed);
    const exportData = confirmedFields.reduce((acc, field) => {
      acc[field.label] = field.value;
      return acc;
    }, {});
    
    if (format === 'json') {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '提取字段.json';
      link.click();
    }
    
    onExport?.(exportData, format);
  };

  return (
    <div className="ai-extracted-info-panel">
      <div className="panel-header">
        <div className="header-title">
          <Database size={18} />
          <h3>AI信息抽取</h3>
        </div>
        {isAnalyzing && (
          <div className="analyzing-indicator">
            <div className="spinner"></div>
            <span>分析中...</span>
          </div>
        )}
      </div>

      <div className="extracted-fields">
        {extractedFields.map((field) => (
          <div key={field.id} className={`field-item ${field.confirmed ? 'confirmed' : ''}`}>
            <div className="field-header">
              <span className="field-label">{field.label}</span>
              <div className="field-confidence">
                <span className={`confidence-badge ${field.confidence > 0.9 ? 'high' : field.confidence > 0.8 ? 'medium' : 'low'}`}>
                  {Math.round(field.confidence * 100)}%
                </span>
              </div>
            </div>
            
            <div className="field-value">
              {field.editable ? (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleFieldEdit(field.id, e.target.value)}
                  className="field-input"
                />
              ) : (
                <span className="field-text">{field.value}</span>
              )}
            </div>
            
            <div className="field-actions">
              {!field.confirmed ? (
                <button 
                  className="confirm-btn"
                  onClick={() => handleFieldConfirm(field.id)}
                >
                  <CheckCircle size={14} />
                  确认
                </button>
              ) : (
                <span className="confirmed-status">
                  <CheckCircle size={14} />
                  已确认
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="panel-actions">
        <button 
          className="export-btn"
          onClick={() => handleExportData('json')}
          disabled={extractedFields.filter(f => f.confirmed).length === 0}
        >
          <Download size={16} />
          导出JSON
        </button>
        <button 
          className="export-btn secondary"
          onClick={() => handleExportData('csv')}
          disabled={extractedFields.filter(f => f.confirmed).length === 0}
        >
          <FileText size={16} />
          导出CSV
        </button>
      </div>
    </div>
  );
};

// AI冲突检测组件
const AIConflictDetector = ({ content, onResolveConflict }) => {
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    // 模拟冲突检测
    const mockConflicts = [
      {
        id: 'conflict_1',
        type: 'content_inconsistency',
        severity: 'medium',
        location: '第2段',
        description: '与版本V1.2中的描述不一致',
        suggestion: '建议统一使用最新版本的描述',
        conflictText: '项目预算为50万元',
        sourceText: '项目预算为60万元'
      },
      {
        id: 'conflict_2',
        type: 'duplicate_content',
        severity: 'low',
        location: '第5段',
        description: '内容与第3段重复',
        suggestion: '建议合并或删除重复内容',
        conflictText: '技术架构采用微服务设计',
        sourceText: '采用微服务架构设计'
      }
    ];
    setConflicts(mockConflicts);
  }, [content]);

  return (
    <div className="ai-conflict-detector">
      {conflicts.map((conflict) => (
        <div key={conflict.id} className={`conflict-item ${conflict.severity}`}>
          <div className="conflict-header">
            <AlertTriangle size={16} />
            <span className="conflict-location">{conflict.location}</span>
            <span className={`severity-badge ${conflict.severity}`}>
              {conflict.severity === 'high' ? '高风险' : conflict.severity === 'medium' ? '中风险' : '低风险'}
            </span>
          </div>
          
          <div className="conflict-description">
            {conflict.description}
          </div>
          
          <div className="conflict-comparison">
            <div className="conflict-text">
              <strong>当前:</strong> {conflict.conflictText}
            </div>
            <div className="source-text">
              <strong>来源:</strong> {conflict.sourceText}
            </div>
          </div>
          
          <div className="conflict-suggestion">
            <Lightbulb size={14} />
            <span>{conflict.suggestion}</span>
          </div>
          
          <div className="conflict-actions">
            <button 
              className="resolve-btn"
              onClick={() => onResolveConflict?.(conflict.id, 'accept_current')}
            >
              保持当前
            </button>
            <button 
              className="resolve-btn secondary"
              onClick={() => onResolveConflict?.(conflict.id, 'accept_source')}
            >
              采用来源
            </button>
            <button 
              className="resolve-btn tertiary"
              onClick={() => onResolveConflict?.(conflict.id, 'manual')}
            >
              手动处理
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// AI引用校验组件
const AIReferenceValidator = ({ references, onUpdateReference }) => {
  const [validationResults, setValidationResults] = useState([]);

  useEffect(() => {
    // 模拟引用校验
    const mockValidations = [
      {
        id: 'ref_1',
        referenceId: 'ref_chapter_a',
        title: '第一章 项目概述',
        status: 'outdated',
        issue: '引用章节标题已变更',
        originalTitle: '第一章 概述',
        currentTitle: '第一章 项目概述',
        suggestion: '更新引用标题以保持一致'
      },
      {
        id: 'ref_2',
        referenceId: 'ref_table_b',
        title: '开发计划表',
        status: 'permission_denied',
        issue: '引用内容权限不足',
        suggestion: '联系管理员获取查看权限'
      }
    ];
    setValidationResults(mockValidations);
  }, [references]);

  return (
    <div className="ai-reference-validator">
      {validationResults.map((validation) => (
        <div key={validation.id} className={`reference-item ${validation.status}`}>
          <div className="reference-header">
            <ExternalLink size={16} />
            <span className="reference-title">{validation.title}</span>
            <span className={`status-badge ${validation.status}`}>
              {validation.status === 'outdated' ? '需更新' : 
               validation.status === 'permission_denied' ? '权限不足' : '正常'}
            </span>
          </div>
          
          <div className="reference-issue">
            <Info size={14} />
            <span>{validation.issue}</span>
          </div>
          
          {validation.originalTitle && validation.currentTitle && (
            <div className="reference-comparison">
              <div className="original-title">
                <strong>原标题:</strong> {validation.originalTitle}
              </div>
              <div className="current-title">
                <strong>新标题:</strong> {validation.currentTitle}
              </div>
            </div>
          )}
          
          <div className="reference-suggestion">
            <Lightbulb size={14} />
            <span>{validation.suggestion}</span>
          </div>
          
          <div className="reference-actions">
            {validation.status === 'outdated' && (
              <button 
                className="update-btn"
                onClick={() => onUpdateReference?.(validation.id, validation.currentTitle)}
              >
                <Zap size={14} />
                自动更新
              </button>
            )}
            <button className="ignore-btn">
              忽略
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// 增强的文档编辑器主组件
const EditorDemoEnhanced = () => {
  const {
    currentDocument,
    documents,
    templates,
    versions,
    searchQuery,
    selectedBlocks,
    isCollaborativeMode,
    setCurrentDocument,
    updateDocument,
    searchDocuments,
    setSelectedBlocks,
    toggleCollaborativeMode
  } = useDocStore();

  const [activePanel, setActivePanel] = useState('edit'); // 'edit', 'search', 'templates', 'versions', 'graph', 'relationships', 'collaboration'
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeAITab, setActiveAITab] = useState('extract'); // 'extract', 'conflicts', 'references'

  // 模拟当前用户
  const currentUser = {
    id: 'user_001',
    name: '张三',
    role: '产品经理',
    avatar: '👨‍💼'
  };

  const handleNewDocument = (template, title) => {
    const newDoc = {
      id: `doc_${Date.now()}`,
      title: title || '新建文档',
      content: template?.content || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: currentUser,
      tags: template?.tags || [],
      category: template?.category || '其他'
    };
    
    setCurrentDocument(newDoc);
    setShowNewDocModal(false);
    setActivePanel('edit');
  };

  const handleDocumentUpdate = (updates) => {
    if (currentDocument) {
      updateDocument(currentDocument.id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleAIExtractConfirm = (fieldId) => {
    console.log('AI字段确认:', fieldId);
  };

  const handleAIExport = (data, format) => {
    console.log('AI数据导出:', data, format);
  };

  const handleConflictResolve = (conflictId, resolution) => {
    console.log('冲突解决:', conflictId, resolution);
  };

  const handleReferenceUpdate = (refId, newTitle) => {
    console.log('引用更新:', refId, newTitle);
  };

  const renderMainContent = () => {
    switch (activePanel) {
      case 'edit':
        return (
          <div className="editor-content">
            <div className="editor-header">
              <div className="document-info">
                <h1>{currentDocument?.title || '新建文档'}</h1>
                <div className="document-meta">
                  <span className="meta-item">
                    <User size={14} />
                    {currentDocument?.author?.name || currentUser.name}
                  </span>
                  <span className="meta-item">
                    <Clock size={14} />
                    {currentDocument?.updatedAt ? new Date(currentDocument.updatedAt).toLocaleString() : '刚刚'}
                  </span>
                  {isCollaborativeMode && (
                    <span className="meta-item collaborative">
                      <Users size={14} />
                      协作模式
                    </span>
                  )}
                </div>
              </div>
              
              <div className="editor-actions">
                <button 
                  className={`action-btn ${showAIPanel ? 'active' : ''}`}
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  title="AI增强功能"
                >
                  <Brain size={16} />
                  AI增强
                </button>
                <button 
                  className="action-btn"
                  onClick={() => toggleCollaborativeMode()}
                  title="协作模式"
                >
                  <Users size={16} />
                  {isCollaborativeMode ? '退出协作' : '开启协作'}
                </button>
                <button className="action-btn primary">
                  <Save size={16} />
                  保存
                </button>
              </div>
            </div>

            <div className="editor-workspace">
              <div className="editor-main">
                <BlockEditor
                  document={currentDocument}
                  onUpdate={handleDocumentUpdate}
                  selectedBlocks={selectedBlocks}
                  onSelectBlocks={setSelectedBlocks}
                  isCollaborative={isCollaborativeMode}
                />
              </div>

              {/* AI增强面板 */}
              {showAIPanel && (
                <div className="ai-enhancement-panel">
                  <div className="ai-panel-header">
                    <h3>
                      <Sparkles size={18} />
                      AI增强功能
                    </h3>
                    <button 
                      className="close-btn"
                      onClick={() => setShowAIPanel(false)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="ai-tabs">
                    <button 
                      className={`ai-tab ${activeAITab === 'extract' ? 'active' : ''}`}
                      onClick={() => setActiveAITab('extract')}
                    >
                      <Database size={16} />
                      信息抽取
                    </button>
                    <button 
                      className={`ai-tab ${activeAITab === 'conflicts' ? 'active' : ''}`}
                      onClick={() => setActiveAITab('conflicts')}
                    >
                      <AlertTriangle size={16} />
                      冲突检测
                    </button>
                    <button 
                      className={`ai-tab ${activeAITab === 'references' ? 'active' : ''}`}
                      onClick={() => setActiveAITab('references')}
                    >
                      <ExternalLink size={16} />
                      引用校验
                    </button>
                  </div>

                  <div className="ai-tab-content">
                    {activeAITab === 'extract' && (
                      <AIExtractedInfoPanel
                        documentContent={currentDocument?.content}
                        onConfirmField={handleAIExtractConfirm}
                        onExport={handleAIExport}
                      />
                    )}
                    
                    {activeAITab === 'conflicts' && (
                      <AIConflictDetector
                        content={currentDocument?.content}
                        onResolveConflict={handleConflictResolve}
                      />
                    )}
                    
                    {activeAITab === 'references' && (
                      <AIReferenceValidator
                        references={currentDocument?.references}
                        onUpdateReference={handleReferenceUpdate}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'search':
        return <SearchPanel documents={documents} onSelectDocument={setCurrentDocument} />;
      
      case 'templates':
        return <TemplateCenter templates={templates} onSelectTemplate={(template) => handleNewDocument(template)} />;
      
      case 'versions':
        return <VersionPanel document={currentDocument} versions={versions} />;
      
      case 'graph':
        return <GraphViewer documents={documents} currentDocument={currentDocument} />;
      
      case 'relationships':
        return <RelationshipManager documents={documents} currentDocument={currentDocument} />;
      
      case 'collaboration':
        return <SimpleCollaborationPanel document={currentDocument} currentUser={currentUser} />;
      
      default:
        return <div>选择一个功能开始使用</div>;
    }
  };

  return (
    <div className="editor-demo-enhanced">
      {/* 侧边栏 */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FileText size={24} />
            {!sidebarCollapsed && <span>文档工作台</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <div className="sidebar-nav">
          <button 
            className={`nav-item ${activePanel === 'edit' ? 'active' : ''}`}
            onClick={() => setActivePanel('edit')}
            title="文档编辑"
          >
            <Edit3 size={20} />
            {!sidebarCollapsed && <span>文档编辑</span>}
          </button>
          
          <button 
            className={`nav-item ${activePanel === 'search' ? 'active' : ''}`}
            onClick={() => setActivePanel('search')}
            title="搜索文档"
          >
            <Search size={20} />
            {!sidebarCollapsed && <span>搜索文档</span>}
          </button>
          
          <button 
            className={`nav-item ${activePanel === 'templates' ? 'active' : ''}`}
            onClick={() => setActivePanel('templates')}
            title="模板中心"
          >
            <Layout size={20} />
            {!sidebarCollapsed && <span>模板中心</span>}
          </button>
          
          <button 
            className={`nav-item ${activePanel === 'versions' ? 'active' : ''}`}
            onClick={() => setActivePanel('versions')}
            title="版本管理"
          >
            <History size={20} />
            {!sidebarCollapsed && <span>版本管理</span>}
          </button>
          
          <button 
            className={`nav-item ${activePanel === 'graph' ? 'active' : ''}`}
            onClick={() => setActivePanel('graph')}
            title="关系图谱"
          >
            <Network size={20} />
            {!sidebarCollapsed && <span>关系图谱</span>}
          </button>
          
          <button 
            className={`nav-item ${activePanel === 'relationships' ? 'active' : ''}`}
            onClick={() => setActivePanel('relationships')}
            title="关系管理"
          >
            <Hash size={20} />
            {!sidebarCollapsed && <span>关系管理</span>}
          </button>
          
          <button 
            className={`nav-item ${activePanel === 'collaboration' ? 'active' : ''}`}
            onClick={() => setActivePanel('collaboration')}
            title="协作管理"
          >
            <Users size={20} />
            {!sidebarCollapsed && <span>协作管理</span>}
          </button>
        </div>

        <div className="sidebar-footer">
          <button 
            className="new-doc-btn"
            onClick={() => setShowNewDocModal(true)}
            title="新建文档"
          >
            <Plus size={20} />
            {!sidebarCollapsed && <span>新建文档</span>}
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="main-content">
        {renderMainContent()}
      </div>

      {/* AI助手触发器 */}
      <AIAssistantTrigger
        documentId={currentDocument?.id}
        documentData={currentDocument}
        currentUser={currentUser}
        className="floating"
      />

      {/* 新建文档模态框 */}
      {showNewDocModal && (
        <NewDocumentModal
          templates={templates}
          onConfirm={handleNewDocument}
          onCancel={() => setShowNewDocModal(false)}
        />
      )}
    </div>
  );
};

export default EditorDemoEnhanced;
