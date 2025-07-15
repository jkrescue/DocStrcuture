import React, { useState } from 'react';
import { FileText, Plus, Eye, Download, Star, Clock, User } from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const TemplateCenter = ({ onClose, onApplyTemplate }) => {
  const { templates, applyTemplate } = useDocStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部模板', count: templates.length },
    { id: 'document', name: '文档类', count: 2 },
    { id: 'meeting', name: '会议类', count: 1 },
    { id: 'project', name: '项目类', count: 1 },
    { id: 'report', name: '报告类', count: 0 }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyTemplate = (templateId) => {
    applyTemplate(templateId);
    onApplyTemplate?.(templateId);
    onClose?.();
  };

  const renderTemplatePreview = (template) => {
    return (
      <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
        <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>模板预览</h4>
        <div>
          {template.blocks.map((block, index) => (
            <div key={index} style={{ fontSize: '14px', marginBottom: '8px' }}>
              {block.type === 'text' && (
                <div style={{ backgroundColor: '#ffffff', padding: '8px', borderRadius: '4px', borderLeft: '2px solid #bfdbfe' }}>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>文本块</span>
                  <div style={{ color: '#374151' }}>{block.content.text}</div>
                </div>
              )}
              {block.type === 'field' && (
                <div style={{ backgroundColor: '#ffffff', padding: '8px', borderRadius: '4px', borderLeft: '2px solid #bbf7d0' }}>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>字段 - {block.content.fieldType}</span>
                  <div style={{ color: '#374151' }}>{block.content.label}</div>
                </div>
              )}
              {block.type === 'table' && (
                <div style={{ backgroundColor: '#ffffff', padding: '8px', borderRadius: '4px', borderLeft: '2px solid #e9d5ff' }}>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>表格</span>
                  <div style={{ color: '#374151' }}>{block.content.title}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <div style={{ flex: 1, display: 'flex' }}>
        {/* 左侧边栏 */}
        <div style={{ width: '25%', borderRight: '1px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>模板中心</h2>
            <button
              onClick={onClose}
              style={{
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px',
                lineHeight: 1
              }}
              onMouseOver={(e) => e.target.style.color = '#374151'}
              onMouseOut={(e) => e.target.style.color = '#6b7280'}
            >
              ✕
            </button>
          </div>

          {/* 搜索框 */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '14px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* 分类筛选 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontWeight: '500', color: '#374151', marginBottom: '12px', fontSize: '14px' }}>分类</h3>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  backgroundColor: selectedCategory === category.id ? '#dbeafe' : 'transparent',
                  color: selectedCategory === category.id ? '#1d4ed8' : '#374151',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{category.name}</span>
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: '#e5e7eb',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {category.count}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* 创建新模板 */}
          <div>
            <button style={{
              width: '100%',
              padding: '12px',
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              color: '#6b7280',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#93c5fd';
              e.target.style.color = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.color = '#6b7280';
            }}>
              <Plus size={20} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '14px' }}>创建新模板</div>
            </button>
          </div>
        </div>

        {/* 中间模板列表 */}
        <div style={{ width: '40%', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '500', color: '#1f2937', margin: 0 }}>
              {filteredTemplates.length} 个模板
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280', gap: '8px' }}>
              <span>排序:</span>
              <select style={{
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '14px',
                outline: 'none'
              }}>
                <option>最新创建</option>
                <option>使用频率</option>
                <option>名称排序</option>
              </select>
            </div>
          </div>

          <div style={{ height: 'calc(100vh - 150px)', overflowY: 'auto', paddingRight: '8px' }}>
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                style={{
                  padding: '16px',
                  border: selectedTemplate?.id === template.id ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  backgroundColor: selectedTemplate?.id === template.id ? '#eff6ff' : '#ffffff',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (selectedTemplate?.id !== template.id) {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedTemplate?.id !== template.id) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} style={{ color: '#2563eb' }} />
                    <h4 style={{ fontWeight: '500', color: '#111827', margin: 0 }}>{template.name}</h4>
                    {template.featured && (
                      <Star size={14} style={{ color: '#eab308', fill: 'currentColor' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyTemplate(template.id);
                      }}
                      style={{
                        padding: '4px',
                        color: '#2563eb',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      title="使用模板"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '4px',
                        color: '#6b7280',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      title="预览"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>{template.description}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} />
                      <span>系统</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      <span>2天前</span>
                    </span>
                  </div>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {template.blocks.length} 个块
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧预览 */}
        <div style={{ width: '35%', padding: '24px', backgroundColor: '#f9fafb' }}>
          {selectedTemplate ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 'bold', color: '#111827', margin: 0 }}>{selectedTemplate.name}</h3>
                <button
                  onClick={() => handleApplyTemplate(selectedTemplate.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  使用此模板
                </button>
              </div>

              <p style={{ color: '#4b5563', marginBottom: '24px' }}>{selectedTemplate.description}</p>

              {renderTemplatePreview(selectedTemplate)}

              {/* 模板信息 */}
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>模板信息</h4>
                <div style={{ fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>包含块数:</span>
                    <span style={{ color: '#374151' }}>{selectedTemplate.blocks.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>创建时间:</span>
                    <span style={{ color: '#374151' }}>2024-01-15</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>使用次数:</span>
                    <span style={{ color: '#374151' }}>156</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>最后更新:</span>
                    <span style={{ color: '#374151' }}>2天前</span>
                  </div>
                </div>
              </div>

              {/* 相关模板 */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>相关模板</h4>
                <div>
                  {templates.filter(t => t.id !== selectedTemplate.id).slice(0, 2).map(template => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      style={{
                        padding: '8px',
                        backgroundColor: '#ffffff',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        marginBottom: '8px',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.borderColor = '#93c5fd'}
                      onMouseOut={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{template.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{template.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
              <div style={{ textAlign: 'center' }}>
                <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>选择左侧模板查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateCenter;