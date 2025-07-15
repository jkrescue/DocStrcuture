import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Search, Filter, FileText, Layout, Users, Clock, 
  Star, Eye, Copy, ArrowRight, Sparkles, Zap, BookOpen,
  ChevronRight, Tag, User, Calendar, TrendingUp, Award,
  Save, Edit3, Settings, Palette, Type, Table, Link2,
  Image, Code, List, CheckSquare, Quote, Hash, Upload,
  FileUp, Scan, Brain, Network
} from 'lucide-react';
import { useDocStore } from '../../stores/docStore';
import DocumentParser from '../DocumentParser/DocumentParser';

const NewDocumentModal = ({ isOpen, onClose, onCreateDocument }) => {
  const { templates } = useDocStore();
  const [step, setStep] = useState('choice'); // choice, template, customize, create
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documentType, setDocumentType] = useState('blank'); // 添加文档类型状态
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [parsedContent, setParsedContent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentConfig, setDocumentConfig] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    isPublic: false,
    collaborators: [],
    structure: 'free' // free, structured, outline
  });

  // 文档类型预设
  const documentTypes = [
    {
      id: 'blank',
      title: '空白文档',
      description: '使用专业的Notion风格编辑器，支持丰富的内容块',
      icon: FileText,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      features: ['Notion风格编辑', '丰富内容块', '拖拽排序', '斜杠命令'],
      recommended: true,
      editorType: 'blocknote'
    },
    {
      id: 'structured',
      title: '传统编辑器',
      description: '基于块级结构的传统编辑器，适合熟悉现有界面的用户',
      icon: Layout,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      features: ['块级编辑', '传统界面', '稳定可靠', '快速响应'],
      recommended: false,
      editorType: 'traditional'
    },
    {
      id: 'upload_parse',
      title: '文档解析',
      description: '上传PDF等文件，智能解析为结构化文档并建立关联关系',
      icon: Brain,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      features: ['PDF解析', '智能识别', '结构化转换', '关系建立'],
      recommended: true,
      editorType: 'parser'
    },
    {
      id: 'template',
      title: '模板创建',
      description: '选择专业模板，快速开始文档创作',
      icon: Sparkles,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      features: ['即用模板', '专业设计', '快速开始'],
      recommended: false
    },
    {
      id: 'collaborative',
      title: '协作文档',
      description: '多人协作编辑，实时同步更新',
      icon: Users,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      features: ['实时协作', '版本控制', '权限管理'],
      recommended: false
    }
  ];

  // 结构化文档模板
  const structuredTemplates = [
    {
      id: 'report',
      name: '报告文档',
      description: '标准报告格式，包含摘要、正文、结论',
      blocks: [
        { type: 'text', content: { text: '# 报告标题' } },
        { type: 'field', content: { fieldType: 'text', label: '报告编号', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '撰写人', required: true } },
        { type: 'field', content: { fieldType: 'date', label: '报告日期' } },
        { type: 'text', content: { text: '## 执行摘要\n\n## 背景介绍\n\n## 主要内容\n\n## 结论与建议' } }
      ]
    },
    {
      id: 'proposal',
      name: '提案文档',
      description: '项目提案标准格式，包含问题、方案、实施计划',
      blocks: [
        { type: 'text', content: { text: '# 项目提案' } },
        { type: 'field', content: { fieldType: 'text', label: '提案名称', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '提案人', required: true } },
        { type: 'text', content: { text: '## 问题描述\n\n## 解决方案\n\n## 实施计划\n\n## 预期效果\n\n## 资源需求' } },
        { type: 'table', content: { title: '时间计划', data: [['阶段', '开始时间', '结束时间', '关键里程碑'], ['', '', '', '']] } }
      ]
    },
    {
      id: 'specification',
      name: '技术规范',
      description: '技术规范文档，包含架构、接口、实现细节',
      blocks: [
        { type: 'text', content: { text: '# 技术规范文档' } },
        { type: 'field', content: { fieldType: 'text', label: '系统名称', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '版本号', required: true } },
        { type: 'text', content: { text: '## 系统概述\n\n## 技术架构\n\n## 接口规范\n\n## 数据模型\n\n## 部署说明' } }
      ]
    }
  ];

  // 扩展的模板数据
  const enhancedTemplates = [
    {
      id: 'template_1',
      name: '项目需求文档',
      description: '标准的项目需求文档模板，包含完整的需求分析结构',
      category: 'project',
      featured: true,
      author: '张三',
      authorAvatar: '👨‍💼',
      usageCount: 1250,
      rating: 4.8,
      tags: ['需求分析', '项目管理', '产品'],
      thumbnail: '📋',
      difficulty: 'intermediate',
      estimatedTime: '30分钟',
      blocks: [
        { type: 'text', content: { text: '# 项目需求文档\n\n## 项目概述' } },
        { type: 'field', content: { fieldType: 'text', label: '项目名称', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '项目负责人', required: true } },
        { type: 'text', content: { text: '## 需求描述\n\n### 功能需求\n\n### 非功能需求' } }
      ]
    },
    {
      id: 'template_2',
      name: '会议纪要模板',
      description: '高效记录会议内容，包含议题、决议和行动项',
      category: 'meeting',
      featured: false,
      author: '李四',
      authorAvatar: '👩‍💻',
      usageCount: 890,
      rating: 4.6,
      tags: ['会议', '纪要', '协作'],
      thumbnail: '📝',
      difficulty: 'beginner',
      estimatedTime: '15分钟',
      blocks: [
        { type: 'text', content: { text: '# 会议纪要\n\n## 会议信息' } },
        { type: 'field', content: { fieldType: 'text', label: '会议主题', required: true } },
        { type: 'field', content: { fieldType: 'datetime', label: '会议时间' } },
        { type: 'text', content: { text: '## 会议议题\n\n## 讨论内容\n\n## 决议事项' } }
      ]
    },
    {
      id: 'template_3',
      name: '产品设计方案',
      description: '产品设计完整方案模板，包含用户研究、设计思路和原型',
      category: 'design',
      featured: true,
      author: '王五',
      authorAvatar: '🎨',
      usageCount: 567,
      rating: 4.9,
      tags: ['设计', '产品', 'UX'],
      thumbnail: '🎨',
      difficulty: 'advanced',
      estimatedTime: '60分钟',
      blocks: [
        { type: 'text', content: { text: '# 产品设计方案\n\n## 设计概述' } },
        { type: 'field', content: { fieldType: 'text', label: '产品名称', required: true } },
        { type: 'text', content: { text: '## 用户研究\n\n### 目标用户\n\n### 用户需求' } }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: '全部模板', count: enhancedTemplates.length },
    { id: 'project', name: '项目管理', count: 5 },
    { id: 'meeting', name: '会议纪要', count: 3 },
    { id: 'design', name: '设计方案', count: 4 },
    { id: 'report', name: '报告文档', count: 6 },
    { id: 'technical', name: '技术文档', count: 4 }
  ];

  // 筛选模板
  const filteredTemplates = enhancedTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateDocument = (typeId = null) => {
    const targetTypeId = typeId || documentType;
    const selectedDocType = documentTypes.find(type => type.id === targetTypeId);
    const editorType = selectedDocType?.editorType || 'traditional';
    
    let newDoc = {
      id: `doc_${Date.now()}`,
      title: documentConfig.title || '无标题文档',
      content: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'current_user',
        tags: documentConfig.tags,
        category: documentConfig.category,
        description: documentConfig.description,
        isPublic: documentConfig.isPublic,
        collaborators: documentConfig.collaborators,
        status: 'draft',
        editorType: editorType
      },
      blocks: []
    };

    if (selectedTemplate) {
      newDoc.title = selectedTemplate.name + ' - 副本';
      newDoc.blocks = [...selectedTemplate.blocks];
      newDoc.metadata.tags = [...(selectedTemplate.tags || [])];
      newDoc.metadata.category = selectedTemplate.category;
    }

    onCreateDocument(newDoc);
    onClose();
    
    // 重置状态
    setStep('choice');
    setSelectedTemplate(null);
    setDocumentType('blank');
    setDocumentConfig({
      title: '',
      description: '',
      category: '',
      tags: [],
      isPublic: false,
      collaborators: [],
      structure: 'free'
    });
  };

  const renderChoiceStep = () => (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#111827', 
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          创建新文档
        </h2>
        <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
          选择最适合您需求的创建方式，开始您的文档创作之旅
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {documentTypes.map(type => (
          <div
            key={type.id}
            onClick={() => {
              if (type.id === 'template') {
                setStep('template');
              } else if (type.id === 'structured') {
                setDocumentType('structured');
                setStep('customize');
                setDocumentConfig(prev => ({ ...prev, structure: 'structured' }));
              } else if (type.id === 'upload_parse') {
                setDocumentType('upload_parse');
                setStep('parse');
              } else {
                handleCreateDocument(type.id);
              }
            }}
            style={{
              position: 'relative',
              padding: '24px',
              borderRadius: '16px',
              background: 'white',
              border: '2px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = type.color;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {type.recommended && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px 8px',
                backgroundColor: '#fbbf24',
                color: 'white',
                fontSize: '10px',
                fontWeight: '600',
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                推荐
              </div>
            )}

            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: type.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <type.icon size={24} color="white" />
            </div>

            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '8px'
            }}>
              {type.title}
            </h3>

            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              lineHeight: '1.5',
              marginBottom: '16px'
            }}>
              {type.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {type.features.map(feature => (
                <span
                  key={feature}
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              opacity: 0.5
            }}>
              <ArrowRight size={16} color={type.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplateStep = () => (
    <div style={{ display: 'flex', height: '500px' }}>
      {/* 左侧筛选 */}
      <div style={{ 
        width: '240px', 
        borderRight: '1px solid #e5e7eb', 
        padding: '24px 20px',
        backgroundColor: '#fafbfc'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '16px'
        }}>
          模板分类
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: selectedCategory === category.id ? '#eff6ff' : 'transparent',
                color: selectedCategory === category.id ? '#3b82f6' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <span>{category.name}</span>
              <span style={{ 
                fontSize: '12px', 
                backgroundColor: selectedCategory === category.id ? '#3b82f6' : '#e5e7eb',
                color: selectedCategory === category.id ? 'white' : '#6b7280',
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧模板列表 */}
      <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
        {/* 搜索栏 */}
        <div style={{ 
          position: 'relative', 
          marginBottom: '20px',
          maxWidth: '400px'
        }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}
          />
          <input
            type="text"
            placeholder="搜索模板..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '12px',
              paddingTop: '10px',
              paddingBottom: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* 模板网格 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '16px'
        }}>
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                setStep('customize');
              }}
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: selectedTemplate?.id === template.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedTemplate?.id !== template.id) {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTemplate?.id !== template.id) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px'
                }}>
                  {template.thumbnail}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    {template.name}
                  </h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={12} color="#fbbf24" fill="#fbbf24" />
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {template.rating}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Eye size={12} color="#6b7280" />
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {template.usageCount}
                      </span>
                    </div>
                  </div>
                </div>

                {template.featured && (
                  <div style={{
                    padding: '2px 6px',
                    backgroundColor: '#fef3c7',
                    color: '#f59e0b',
                    fontSize: '10px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    精选
                  </div>
                )}
              </div>

              <p style={{ 
                fontSize: '13px', 
                color: '#6b7280', 
                lineHeight: '1.4',
                marginBottom: '12px'
              }}>
                {template.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                {template.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      borderRadius: '8px'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  {template.estimatedTime}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} />
                  {template.author}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#9ca3af'
          }}>
            <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>没有找到匹配的模板</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCustomizeStep = () => (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '8px'
        }}>
          文档配置
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          {selectedTemplate ? 
            `基于 "${selectedTemplate.name}" 模板创建文档` : 
            '配置您的新文档信息'
          }
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 文档标题 */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '6px'
            }}>
              文档标题 *
            </label>
            <input
              type="text"
              value={documentConfig.title}
              onChange={(e) => setDocumentConfig(prev => ({ ...prev, title: e.target.value }))}
              placeholder={selectedTemplate ? `${selectedTemplate.name} - 副本` : '输入文档标题'}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* 文档描述 */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '6px'
            }}>
              文档描述
            </label>
            <textarea
              value={documentConfig.description}
              onChange={(e) => setDocumentConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="简要描述文档内容和用途"
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* 文档分类 */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '6px'
            }}>
              文档分类
            </label>
            <select
              value={documentConfig.category}
              onChange={(e) => setDocumentConfig(prev => ({ ...prev, category: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="">选择分类</option>
              <option value="project">项目管理</option>
              <option value="meeting">会议纪要</option>
              <option value="design">设计方案</option>
              <option value="report">报告文档</option>
              <option value="technical">技术文档</option>
              <option value="other">其他</option>
            </select>
          </div>

          {/* 标签 */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '6px'
            }}>
              标签
            </label>
            <input
              type="text"
              placeholder="输入标签，用逗号分隔"
              onChange={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                setDocumentConfig(prev => ({ ...prev, tags }));
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            {documentConfig.tags.length > 0 && (
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {documentConfig.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: '#eff6ff',
                      color: '#3b82f6',
                      borderRadius: '12px'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 协作设置 */}
          <div>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={documentConfig.isPublic}
                onChange={(e) => setDocumentConfig(prev => ({ ...prev, isPublic: e.target.checked }))}
                style={{ margin: 0 }}
              />
              公开文档（允许他人查看）
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // 文档解析步骤渲染
  const renderParseStep = () => (
    <DocumentParser
      onParseComplete={(document) => {
        onCreateDocument(document);
        onClose();
        // 重置状态
        setStep('choice');
        setSelectedTemplate(null);
        setDocumentType('blank');
        setUploadedFile(null);
        setParsedContent(null);
        setIsProcessing(false);
        setDocumentConfig({
          title: '',
          description: '',
          category: '',
          tags: [],
          isPublic: false,
          collaborators: [],
          structure: 'free'
        });
      }}
      onCancel={() => setStep('choice')}
    />
  );

  if (!isOpen) return null;

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
        width: step === 'choice' ? '90%' : '80%',
        maxWidth: step === 'choice' ? '900px' : '800px',
        maxHeight: '90vh',
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* 头部 */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafbfc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {step !== 'choice' && (
              <button
                onClick={() => {
                  if (step === 'template') setStep('choice');
                  else if (step === 'customize') {
                    setStep(selectedTemplate ? 'template' : 'choice');
                  }
                }}
                style={{
                  padding: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
              </button>
            )}
            
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827',
              margin: 0
            }}>
              {step === 'choice' && '创建新文档'}
              {step === 'template' && '选择模板'}
              {step === 'customize' && '配置文档'}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {step === 'choice' && renderChoiceStep()}
          {step === 'template' && renderTemplateStep()}
          {step === 'customize' && renderCustomizeStep()}
          {step === 'parse' && renderParseStep()}
        </div>

        {/* 底部操作栏 */}
        {step === 'customize' && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#fafbfc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {selectedTemplate && (
                <span>基于模板: {selectedTemplate.name}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                取消
              </button>
              <button
                onClick={handleCreateDocument}
                disabled={!documentConfig.title.trim()}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: documentConfig.title.trim() ? '#3b82f6' : '#d1d5db',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: documentConfig.title.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={14} />
                创建文档
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewDocumentModal;
