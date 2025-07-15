import React, { useState } from 'react';
import { FormInput, Calendar, ChevronDown, CheckSquare, Upload } from 'lucide-react';

const FieldBlock = ({ block, onChange, editable = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fieldType = block.content?.fieldType || 'text';
  const fieldLabel = block.content?.label || '字段标签';
  const fieldValue = block.content?.value || '';
  const fieldOptions = block.content?.options || [];

  const fieldTypes = {
    text: { icon: FormInput, label: '文本输入' },
    number: { icon: FormInput, label: '数字输入' },
    date: { icon: Calendar, label: '日期选择' },
    select: { icon: ChevronDown, label: '下拉选择' },
    checkbox: { icon: CheckSquare, label: '复选框' },
    file: { icon: Upload, label: '文件上传' }
  };

  const handleFieldChange = (updates) => {
    onChange?.({
      content: { ...block.content, ...updates },
      metadata: {
        ...block.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const handleValueChange = (newValue) => {
    handleFieldChange({ value: newValue });
  };

  const renderFieldInput = () => {
    switch (fieldType) {
      case 'text':
        return (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入文本"
            disabled={!editable}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={fieldValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入数字"
            disabled={!editable}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={fieldValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!editable}
          />
        );

      case 'select':
        return (
          <select
            value={fieldValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!editable}
          >
            <option value="">请选择...</option>
            {fieldOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fieldValue === 'true' || fieldValue === true}
              onChange={(e) => handleValueChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={!editable}
            />
            <span className="text-gray-700">
              {block.content?.checkboxLabel || '选项'}
            </span>
          </label>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleValueChange(file.name);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!editable}
            />
            {fieldValue && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                已选择: {fieldValue}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-gray-500 italic">未知字段类型</div>
        );
    }
  };

  const FieldIcon = fieldTypes[fieldType]?.icon || FormInput;

  return (
    <div className="field-block group relative border-l-2 border-transparent hover:border-green-200 pl-4 transition-colors">
      {/* 块类型指示器 */}
      <div className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FieldIcon size={16} className="text-green-500" />
      </div>

      <div className="bg-green-50 p-4 rounded-lg space-y-3">
        {/* 字段配置编辑 */}
        {isEditing ? (
          <div className="space-y-3 border-b border-green-200 pb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                字段标签
              </label>
              <input
                type="text"
                value={fieldLabel}
                onChange={(e) => handleFieldChange({ label: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入字段标签"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                字段类型
              </label>
              <select
                value={fieldType}
                onChange={(e) => handleFieldChange({ fieldType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(fieldTypes).map(([type, config]) => (
                  <option key={type} value={type}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 下拉选项配置 */}
            {fieldType === 'select' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  选项 (每行一个)
                </label>
                <textarea
                  value={fieldOptions.join('\n')}
                  onChange={(e) => handleFieldChange({ 
                    options: e.target.value.split('\n').filter(opt => opt.trim()) 
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="选项1&#10;选项2&#10;选项3"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                完成
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FieldIcon size={16} className="text-green-600" />
              <span className="font-medium text-gray-800">{fieldLabel}</span>
              <span className="text-xs text-gray-500">
                ({fieldTypes[fieldType]?.label})
              </span>
            </div>
            {editable && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                配置
              </button>
            )}
          </div>
        )}

        {/* 字段输入 */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">
            {fieldLabel}
            {block.content?.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          {renderFieldInput()}
        </div>

        {/* 字段验证提示 */}
        {block.content?.validation?.error && (
          <div className="text-sm text-red-600">
            {block.content.validation.error}
          </div>
        )}
      </div>

      {/* 块状态指示器 */}
      {block.metadata?.locked && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
          已锁定
        </div>
      )}
    </div>
  );
};

export default FieldBlock;