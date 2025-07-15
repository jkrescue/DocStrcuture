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
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-3">模板预览</h4>
        <div className="space-y-2">
          {template.blocks.map((block, index) => (
            <div key={index} className="text-sm">
              {block.type === 'text' && (
                <div className="bg-white p-2 rounded border-l-2 border-blue-200">
                  <span className="text-gray-500 text-xs">文本块</span>
                  <div className="text-gray-700">{block.content.text}</div>
                </div>
              )}
              {block.type === 'field' && (
                <div className="bg-white p-2 rounded border-l-2 border-green-200">
                  <span className="text-gray-500 text-xs">字段 - {block.content.fieldType}</span>
                  <div className="text-gray-700">{block.content.label}</div>
                </div>
              )}
              {block.type === 'table' && (
                <div className="bg-white p-2 rounded border-l-2 border-purple-200">
                  <span className="text-gray-500 text-xs">表格</span>
                  <div className="text-gray-700">{block.content.title}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex">
        {/* 左侧边栏 */}
        <div className="w-1/4 border-r bg-gray-50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">模板中心</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* 搜索框 */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 分类筛选 */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700 mb-3">分类</h3>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{category.name}</span>
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {category.count}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* 创建新模板 */}
          <div className="mt-8">
            <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
              <Plus size={20} className="mx-auto mb-1" />
              <div className="text-sm">创建新模板</div>
            </button>
          </div>
        </div>

        {/* 中间模板列表 */}
        <div className="w-2/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">
              {filteredTemplates.length} 个模板
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>排序:</span>
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>最新创建</option>
                <option>使用频率</option>
                <option>名称排序</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-full">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-blue-600" />
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    {template.featured && (
                      <Star size={14} className="text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyTemplate(template.id);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="使用模板"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                      title="预览"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <User size={12} />
                      <span>系统</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>2天前</span>
                    </span>
                  </div>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {template.blocks.length} 个块
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧预览 */}
        <div className="w-2/5 p-6 bg-gray-50">
          {selectedTemplate ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">{selectedTemplate.name}</h3>
                <button
                  onClick={() => handleApplyTemplate(selectedTemplate.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  使用此模板
                </button>
              </div>

              <p className="text-gray-600 mb-6">{selectedTemplate.description}</p>

              {renderTemplatePreview(selectedTemplate)}

              {/* 模板信息 */}
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">模板信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">包含块数:</span>
                    <span className="text-gray-700">{selectedTemplate.blocks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">创建时间:</span>
                    <span className="text-gray-700">2024-01-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">使用次数:</span>
                    <span className="text-gray-700">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">最后更新:</span>
                    <span className="text-gray-700">2天前</span>
                  </div>
                </div>
              </div>

              {/* 相关模板 */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">相关模板</h4>
                <div className="space-y-2">
                  {templates.filter(t => t.id !== selectedTemplate.id).slice(0, 2).map(template => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className="p-2 bg-white rounded border hover:border-blue-300 cursor-pointer transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-700">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
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