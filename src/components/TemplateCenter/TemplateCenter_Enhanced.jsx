import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Eye, Download, Star, Clock, User, Heart, Share2, 
  Filter, ChevronDown, X, Search, Tag, Bookmark, ThumbsUp,
  Calendar, TrendingUp, Award, Zap, Copy, Edit3, Settings
} from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const TemplateCenter = ({ onClose, onApplyTemplate }) => {
  const { templates, applyTemplate } = useDocStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteTemplates, setFavoriteTemplates] = useState(['template_1', 'template_3']);
  const [recentlyUsed, setRecentlyUsed] = useState(['template_1', 'template_2']);
  
  // 扩展的模板数据
  const [extendedTemplates, setExtendedTemplates] = useState([
    {
      id: 'template_1',
      name: '项目需求文档',
      description: '标准的项目需求文档模板，包含完整的需求分析结构',
      category: 'project',
      featured: true,
      author: '张三',
      authorAvatar: '👨‍💼',
      createdAt: '2024-01-15',
      updatedAt: '2024-03-20',
      usageCount: 1250,
      rating: 4.8,
      ratingCount: 89,
      tags: ['需求分析', '项目管理', '产品'],
      thumbnail: '📋',
      difficulty: 'intermediate',
      estimatedTime: '30分钟',
      blocks: [
        { type: 'text', content: { text: '# 项目需求文档\n\n## 项目概述' } },
        { type: 'field', content: { fieldType: 'text', label: '项目名称', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '项目负责人', required: true } },
        { type: 'field', content: { fieldType: 'date', label: '项目开始时间' } },
        { type: 'field', content: { fieldType: 'date', label: '预计完成时间' } },
        { type: 'field', content: { fieldType: 'select', label: '项目优先级', options: ['低', '中', '高', '紧急'] } },
        { type: 'text', content: { text: '## 需求描述\n\n### 功能需求\n\n### 非功能需求' } },
        { type: 'table', content: { title: '功能模块清单', data: [['模块', '优先级', '预计工时'], ['', '', '']] } }
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
      createdAt: '2024-02-10',
      updatedAt: '2024-03-15',
      usageCount: 890,
      rating: 4.6,
      ratingCount: 67,
      tags: ['会议', '纪要', '协作'],
      thumbnail: '📝',
      difficulty: 'beginner',
      estimatedTime: '15分钟',
      blocks: [
        { type: 'text', content: { text: '# 会议纪要\n\n## 会议信息' } },
        { type: 'field', content: { fieldType: 'text', label: '会议主题', required: true } },
        { type: 'field', content: { fieldType: 'datetime', label: '会议时间' } },
        { type: 'field', content: { fieldType: 'text', label: '会议地点' } },
        { type: 'field', content: { fieldType: 'text', label: '主持人' } },
        { type: 'text', content: { text: '## 参会人员' } },
        { type: 'table', content: { title: '参会人员', data: [['姓名', '部门', '职位'], ['', '', '']] } },
        { type: 'text', content: { text: '## 会议议题\n\n## 讨论内容\n\n## 决议事项\n\n## 行动项' } },
        { type: 'table', content: { title: '行动项跟踪', data: [['任务', '负责人', '截止时间', '状态'], ['', '', '', '']] } }
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
      createdAt: '2024-01-25',
      updatedAt: '2024-03-18',
      usageCount: 567,
      rating: 4.9,
      ratingCount: 45,
      tags: ['设计', '产品', 'UX'],
      thumbnail: '🎨',
      difficulty: 'advanced',
      estimatedTime: '60分钟',
      blocks: [
        { type: 'text', content: { text: '# 产品设计方案\n\n## 设计概述' } },
        { type: 'field', content: { fieldType: 'text', label: '产品名称', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '设计师', required: true } },
        { type: 'text', content: { text: '## 用户研究\n\n### 目标用户\n\n### 用户画像\n\n### 用户需求' } },
        { type: 'text', content: { text: '## 设计目标\n\n## 设计原则\n\n## 界面设计\n\n## 交互设计' } }
      ]
    },
    {
      id: 'template_4',
      name: '周报模板',
      description: '标准周报格式，清晰展示工作进展和计划',
      category: 'report',
      featured: false,
      author: '赵六',
      authorAvatar: '📊',
      createdAt: '2024-02-20',
      updatedAt: '2024-03-10',
      usageCount: 1456,
      rating: 4.7,
      ratingCount: 123,
      tags: ['周报', '汇报', '总结'],
      thumbnail: '📊',
      difficulty: 'beginner',
      estimatedTime: '20分钟',
      blocks: [
        { type: 'text', content: { text: '# 周报\n\n## 基本信息' } },
        { type: 'field', content: { fieldType: 'text', label: '姓名', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '部门', required: true } },
        { type: 'field', content: { fieldType: 'date', label: '周报日期' } },
        { type: 'text', content: { text: '## 本周工作总结' } },
        { type: 'table', content: { title: '工作完成情况', data: [['工作项', '完成度', '备注'], ['', '', '']] } },
        { type: 'text', content: { text: '## 下周工作计划\n\n## 需要协助的事项\n\n## 其他说明' } }
      ]
    },
    {
      id: 'template_5',
      name: '技术文档模板',
      description: '技术文档标准格式，包含API文档、架构说明等',
      category: 'document',
      featured: false,
      author: '孙七',
      authorAvatar: '⚡',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-22',
      usageCount: 234,
      rating: 4.5,
      ratingCount: 28,
      tags: ['技术', '文档', 'API'],
      thumbnail: '⚡',
      difficulty: 'advanced',
      estimatedTime: '45分钟',
      blocks: [
        { type: 'text', content: { text: '# 技术文档\n\n## 概述' } },
        { type: 'field', content: { fieldType: 'text', label: '项目名称', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '版本号', required: true } },
        { type: 'text', content: { text: '## 架构设计\n\n## API 接口\n\n## 数据结构\n\n## 部署说明' } }
      ]
    },
    {
      id: 'template_6',
      name: '市场调研报告',
      description: '市场调研标准模板，包含数据分析和竞品对比',
      category: 'research',
      featured: true,
      author: '周八',
      authorAvatar: '📈',
      createdAt: '2024-02-15',
      updatedAt: '2024-03-25',
      usageCount: 678,
      rating: 4.8,
      ratingCount: 56,
      tags: ['市场调研', '分析', '报告'],
      thumbnail: '📈',
      difficulty: 'intermediate',
      estimatedTime: '50分钟',
      blocks: [
        { type: 'text', content: { text: '# 市场调研报告\n\n## 调研概述' } },
        { type: 'field', content: { fieldType: 'text', label: '调研主题', required: true } },
        { type: 'field', content: { fieldType: 'date', label: '调研时间' } },
        { type: 'text', content: { text: '## 市场现状\n\n## 竞品分析\n\n## 用户调研\n\n## 结论建议' } },
        { type: 'table', content: { title: '竞品对比', data: [['产品', '特点', '优势', '劣势'], ['', '', '', '']] } }
      ]
    }
  ]);

  const categories = [
    { id: 'all', name: '全部模板', count: extendedTemplates.length, icon: '📁' },
    { id: 'project', name: '项目管理', count: extendedTemplates.filter(t => t.category === 'project').length, icon: '📋' },
    { id: 'meeting', name: '会议纪要', count: extendedTemplates.filter(t => t.category === 'meeting').length, icon: '📝' },
    { id: 'design', name: '设计方案', count: extendedTemplates.filter(t => t.category === 'design').length, icon: '🎨' },
    { id: 'report', name: '报告汇总', count: extendedTemplates.filter(t => t.category === 'report').length, icon: '📊' },
    { id: 'document', name: '技术文档', count: extendedTemplates.filter(t => t.category === 'document').length, icon: '⚡' },
    { id: 'research', name: '调研分析', count: extendedTemplates.filter(t => t.category === 'research').length, icon: '📈' }
  ];

  const sortOptions = [
    { id: 'popular', name: '最受欢迎', icon: '🔥' },
    { id: 'newest', name: '最新创建', icon: '🆕' },
    { id: 'rating', name: '评分最高', icon: '⭐' },
    { id: 'usage', name: '使用最多', icon: '📊' }
  ];

  const filteredAndSortedTemplates = extendedTemplates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'rating':
          return b.rating - a.rating;
        case 'usage':
          return b.usageCount - a.usageCount;
        default: // popular
          return (b.rating * b.usageCount) - (a.rating * a.usageCount);
      }
    });

  const handleApplyTemplate = (templateId) => {
    const template = extendedTemplates.find(t => t.id === templateId);
    if (template) {
      // 更新使用统计
      setExtendedTemplates(prev => 
        prev.map(t => 
          t.id === templateId 
            ? { ...t, usageCount: t.usageCount + 1 }
            : t
        )
      );
      
      // 添加到最近使用
      setRecentlyUsed(prev => {
        const updated = [templateId, ...prev.filter(id => id !== templateId)];
        return updated.slice(0, 5);
      });
      
      applyTemplate(templateId);
      onApplyTemplate?.(templateId);
      onClose?.();
    }
  };

  const toggleFavorite = (templateId) => {
    setFavoriteTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '入门';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#fbbf24' : '#d1d5db' }}>⭐</span>
    ));
  };

  const renderTemplateCard = (template) => {
    const isFavorite = favoriteTemplates.includes(template.id);
    const isRecentlyUsed = recentlyUsed.includes(template.id);

    return (
      <div
        key={template.id}
        onClick={() => setSelectedTemplate(template)}
        style={{
          padding: '16px',
          backgroundColor: selectedTemplate?.id === template.id ? '#eff6ff' : '#ffffff',
          borderRadius: '12px',
          border: `1px solid ${selectedTemplate?.id === template.id ? '#3b82f6' : '#e5e7eb'}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
          marginBottom: '12px'
        }}
        onMouseEnter={(e) => {
          if (selectedTemplate?.id !== template.id) {
            e.target.style.borderColor = '#cbd5e1';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedTemplate?.id !== template.id) {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        {/* 标记 */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
          {template.featured && (
            <span style={{
              backgroundColor: '#fbbf24',
              color: 'white',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '500'
            }}>
              精选
            </span>
          )}
          {isRecentlyUsed && (
            <span style={{
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '500'
            }}>
              最近使用
            </span>
          )}
        </div>

        {/* 模板头部 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
          <div style={{ 
            fontSize: '32px', 
            width: '48px', 
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px'
          }}>
            {template.thumbnail}
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1f2937',
                margin: 0
              }}>
                {template.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(template.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isFavorite ? '#ef4444' : '#9ca3af',
                  fontSize: '16px'
                }}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
            
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '0 0 8px 0',
              lineHeight: '1.4'
            }}>
              {template.description}
            </p>

            {/* 评分和统计 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {renderStars(template.rating)}
                <span style={{ color: '#6b7280', marginLeft: '4px' }}>
                  {template.rating} ({template.ratingCount})
                </span>
              </div>
              <span style={{ color: '#6b7280' }}>
                {template.usageCount.toLocaleString()} 次使用
              </span>
            </div>
          </div>
        </div>

        {/* 标签 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {template.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: '500'
              }}
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* 底部信息 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{template.authorAvatar}</span>
            <span>{template.author}</span>
            <span>•</span>
            <span
              style={{
                color: getDifficultyColor(template.difficulty),
                fontWeight: '500'
              }}
            >
              {getDifficultyText(template.difficulty)}
            </span>
          </div>
          <div>
            <Clock size={12} style={{ marginRight: '4px' }} />
            {template.estimatedTime}
          </div>
        </div>
      </div>
    );
  };

  const renderTemplatePreview = (template) => {
    return (
      <div style={{ 
        backgroundColor: '#f9fafb', 
        padding: '20px', 
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h4 style={{ 
          fontWeight: '600', 
          color: '#1f2937', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Eye size={16} />
          模板预览
        </h4>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {template.blocks.map((block, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              {block.type === 'text' && (
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  borderLeft: '3px solid #3b82f6' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '6px'
                  }}>
                    <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500' }}>
                      📄 文本块
                    </span>
                  </div>
                  <div style={{ 
                    color: '#374151', 
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line'
                  }}>
                    {block.content.text}
                  </div>
                </div>
              )}
              
              {block.type === 'field' && (
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  borderLeft: '3px solid #10b981' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '6px'
                  }}>
                    <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '500' }}>
                      📝 字段 - {block.content.fieldType}
                    </span>
                    {block.content.required && (
                      <span style={{ color: '#ef4444', fontSize: '10px' }}>*必填</span>
                    )}
                  </div>
                  <div style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    {block.content.label}
                  </div>
                  {block.content.options && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6b7280', 
                      marginTop: '4px' 
                    }}>
                      选项: {block.content.options.join(', ')}
                    </div>
                  )}
                </div>
              )}
              
              {block.type === 'table' && (
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  borderLeft: '3px solid #8b5cf6' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '6px'
                  }}>
                    <span style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: '500' }}>
                      📊 表格
                    </span>
                  </div>
                  <div style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    {block.content.title}
                  </div>
                  {block.content.data && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6b7280', 
                      marginTop: '4px' 
                    }}>
                      {block.content.data.length > 1 ? 
                        `${block.content.data.length - 1} 行数据` : 
                        '空表格'
                      }
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#ffffff' 
    }}>
      {/* 顶部工具栏 */}
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#111827', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📚 模板中心
            </h2>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#374151'
                }}
              >
                {viewMode === 'grid' ? '📋 列表' : '⊞ 网格'}
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: showFilters ? '#3b82f6' : '#f3f4f6',
                  color: showFilters ? 'white' : '#374151',
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
                <Filter size={12} />
                筛选
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              color: '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '8px',
              borderRadius: '6px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* 搜索栏 */}
        <div style={{ 
          marginTop: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px' 
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
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
              placeholder="搜索模板名称、描述或标签..."
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
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.icon} {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  分类筛选
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: selectedCategory === category.id ? '#3b82f6' : '#e5e7eb',
                        color: selectedCategory === category.id ? 'white' : '#374151',
                        fontWeight: '500'
                      }}
                    >
                      {category.icon} {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧分类面板 */}
        <div style={{ 
          width: '280px', 
          borderRight: '1px solid #e5e7eb', 
          backgroundColor: '#f9fafb', 
          padding: '24px',
          overflowY: 'auto'
        }}>
          {/* 分类列表 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '12px' 
            }}>
              分类浏览
            </h3>
            {categories.map(category => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  backgroundColor: selectedCategory === category.id ? '#3b82f6' : 'transparent',
                  color: selectedCategory === category.id ? 'white' : '#374151',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.backgroundColor = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{category.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{category.name}</span>
                </div>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '500',
                  opacity: 0.8
                }}>
                  {category.count}
                </span>
              </div>
            ))}
          </div>

          {/* 我的收藏 */}
          {favoriteTemplates.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                ❤️ 我的收藏
              </h3>
              {favoriteTemplates.slice(0, 3).map(templateId => {
                const template = extendedTemplates.find(t => t.id === templateId);
                return template ? (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginBottom: '6px',
                      backgroundColor: selectedTemplate?.id === template.id ? '#eff6ff' : 'white',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '500', 
                      color: '#374151',
                      marginBottom: '2px'
                    }}>
                      {template.thumbnail} {template.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {template.usageCount} 次使用
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* 最近使用 */}
          {recentlyUsed.length > 0 && (
            <div>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                🕒 最近使用
              </h3>
              {recentlyUsed.slice(0, 3).map(templateId => {
                const template = extendedTemplates.find(t => t.id === templateId);
                return template ? (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginBottom: '6px',
                      backgroundColor: selectedTemplate?.id === template.id ? '#eff6ff' : 'white',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '500', 
                      color: '#374151',
                      marginBottom: '2px'
                    }}>
                      {template.thumbnail} {template.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {template.author}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* 中间模板列表 */}
        <div style={{ 
          flex: 1, 
          padding: '24px', 
          overflowY: 'auto',
          backgroundColor: '#ffffff'
        }}>
          {/* 统计信息 */}
          <div style={{ 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              找到 <strong>{filteredAndSortedTemplates.length}</strong> 个模板
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              按 {sortOptions.find(opt => opt.id === sortBy)?.name} 排序
            </div>
          </div>

          {/* 模板列表 */}
          <div style={{ 
            display: viewMode === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : 'none',
            flexDirection: viewMode === 'list' ? 'column' : 'none',
            gap: '16px'
          }}>
            {filteredAndSortedTemplates.map(template => renderTemplateCard(template))}
          </div>

          {filteredAndSortedTemplates.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '14px',
              marginTop: '60px'
            }}>
              <FileText size={48} style={{ 
                color: '#d1d5db', 
                margin: '0 auto 16px',
                display: 'block'
              }} />
              <p>没有找到匹配的模板</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>
                尝试调整搜索关键词或筛选条件
              </p>
            </div>
          )}
        </div>

        {/* 右侧详情面板 */}
        <div style={{ 
          width: '400px', 
          borderLeft: '1px solid #e5e7eb', 
          backgroundColor: '#fafbfc',
          padding: '24px',
          overflowY: 'auto'
        }}>
          {selectedTemplate ? (
            <div>
              {/* 模板头部信息 */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ 
                    fontSize: '48px',
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {selectedTemplate.thumbnail}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      margin: '0 0 4px 0'
                    }}>
                      {selectedTemplate.name}
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>

                {/* 评分和统计 */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {renderStars(selectedTemplate.rating)}
                    <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '4px' }}>
                      {selectedTemplate.rating} ({selectedTemplate.ratingCount} 评分)
                    </span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <button
                    onClick={() => handleApplyTemplate(selectedTemplate.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                  >
                    <Plus size={16} />
                    使用模板
                  </button>
                  
                  <button
                    onClick={() => toggleFavorite(selectedTemplate.id)}
                    style={{
                      padding: '12px',
                      backgroundColor: favoriteTemplates.includes(selectedTemplate.id) ? '#ef4444' : '#f3f4f6',
                      color: favoriteTemplates.includes(selectedTemplate.id) ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    {favoriteTemplates.includes(selectedTemplate.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>

              {/* 模板预览 */}
              {renderTemplatePreview(selectedTemplate)}

              {/* 模板信息 */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '16px', 
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h4 style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '12px' 
                }}>
                  模板信息
                </h4>
                <div style={{ fontSize: '14px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <span style={{ color: '#6b7280' }}>作者:</span>
                    <span style={{ color: '#374151' }}>
                      {selectedTemplate.authorAvatar} {selectedTemplate.author}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <span style={{ color: '#6b7280' }}>难度:</span>
                    <span style={{ 
                      color: getDifficultyColor(selectedTemplate.difficulty),
                      fontWeight: '500'
                    }}>
                      {getDifficultyText(selectedTemplate.difficulty)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <span style={{ color: '#6b7280' }}>预计时间:</span>
                    <span style={{ color: '#374151' }}>{selectedTemplate.estimatedTime}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <span style={{ color: '#6b7280' }}>使用次数:</span>
                    <span style={{ color: '#374151' }}>
                      {selectedTemplate.usageCount.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between' 
                  }}>
                    <span style={{ color: '#6b7280' }}>最后更新:</span>
                    <span style={{ color: '#374151' }}>
                      {new Date(selectedTemplate.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 标签 */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '16px', 
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h4 style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '12px' 
                }}>
                  标签
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedTemplate.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontWeight: '500'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 相关模板 */}
              <div>
                <h4 style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '12px' 
                }}>
                  相关模板
                </h4>
                <div>
                  {extendedTemplates
                    .filter(t => t.id !== selectedTemplate.id && t.category === selectedTemplate.category)
                    .slice(0, 2)
                    .map(template => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      style={{
                        padding: '12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        marginBottom: '8px',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.borderColor = '#93c5fd'}
                      onMouseOut={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontSize: '16px' }}>{template.thumbnail}</span>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: '#374151' 
                        }}>
                          {template.name}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {template.description}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginTop: '6px',
                        fontSize: '11px',
                        color: '#9ca3af'
                      }}>
                        <span>⭐ {template.rating}</span>
                        <span>•</span>
                        <span>{template.usageCount} 使用</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: '#6b7280',
              textAlign: 'center'
            }}>
              <div>
                <FileText size={64} style={{ 
                  margin: '0 auto 20px', 
                  opacity: 0.5,
                  display: 'block'
                }} />
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>选择模板查看详情</h3>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>
                  点击左侧任意模板<br />查看详细信息和预览
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateCenter;
