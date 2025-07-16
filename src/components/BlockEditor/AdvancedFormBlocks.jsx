import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Palette, Hash, Users, Upload, ChevronDown } from 'lucide-react';

// 日期时间块组件
export const DateTimeBlock = ({ block, onChange, editable = true }) => {
  const content = block.content || { label: '日期时间', value: '', required: false, showTime: true };

  const handleChange = (field, value) => {
    onChange({
      content: {
        ...content,
        [field]: value
      }
    });
  };

  return (
    <div className="advanced-form-block">
      {editable && (
        <div className="block-config">
          <input
            type="text"
            placeholder="字段标签"
            value={content.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="field-label-input"
          />
          <div className="config-options">
            <label>
              <input
                type="checkbox"
                checked={content.required}
                onChange={(e) => handleChange('required', e.target.checked)}
              />
              必填
            </label>
            <label>
              <input
                type="checkbox"
                checked={content.showTime}
                onChange={(e) => handleChange('showTime', e.target.checked)}
              />
              显示时间
            </label>
          </div>
        </div>
      )}
      
      <div className="form-field">
        <label className="field-label">
          <Calendar size={16} />
          {content.label}
          {content.required && <span className="required">*</span>}
        </label>
        <input
          type={content.showTime ? "datetime-local" : "date"}
          value={content.value}
          onChange={(e) => handleChange('value', e.target.value)}
          className="form-input datetime-input"
          disabled={!editable}
        />
      </div>
    </div>
  );
};

// 下拉选择块组件
export const SelectBlock = ({ block, onChange, editable = true }) => {
  const content = block.content || { 
    label: '下拉选择', 
    value: '', 
    options: ['选项1', '选项2', '选项3'], 
    multiple: false,
    required: false 
  };

  const [newOption, setNewOption] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleChange = (field, value) => {
    onChange({
      content: {
        ...content,
        [field]: value
      }
    });
  };

  const addOption = () => {
    if (newOption.trim()) {
      handleChange('options', [...content.options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    const newOptions = content.options.filter((_, i) => i !== index);
    handleChange('options', newOptions);
  };

  return (
    <div className="advanced-form-block">
      {editable && (
        <div className="block-config">
          <input
            type="text"
            placeholder="字段标签"
            value={content.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="field-label-input"
          />
          <div className="config-options">
            <label>
              <input
                type="checkbox"
                checked={content.required}
                onChange={(e) => handleChange('required', e.target.checked)}
              />
              必填
            </label>
            <label>
              <input
                type="checkbox"
                checked={content.multiple}
                onChange={(e) => handleChange('multiple', e.target.checked)}
              />
              多选
            </label>
          </div>
          
          <div className="options-config">
            <div className="add-option">
              <input
                type="text"
                placeholder="添加选项"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addOption()}
              />
              <button onClick={addOption} className="add-btn">添加</button>
            </div>
            <div className="options-list">
              {content.options.map((option, index) => (
                <div key={index} className="option-item">
                  <span>{option}</span>
                  <button onClick={() => removeOption(index)} className="remove-btn">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="form-field">
        <label className="field-label">
          <ChevronDown size={16} />
          {content.label}
          {content.required && <span className="required">*</span>}
        </label>
        <select
          value={content.value}
          onChange={(e) => handleChange('value', e.target.value)}
          multiple={content.multiple}
          className="form-input select-input"
          disabled={!editable}
        >
          <option value="">请选择...</option>
          {content.options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// 数字输入块组件
export const NumberBlock = ({ block, onChange, editable = true }) => {
  const content = block.content || { 
    label: '数字输入', 
    value: 0, 
    min: null, 
    max: null, 
    step: 1, 
    unit: '',
    required: false 
  };

  const handleChange = (field, value) => {
    onChange({
      content: {
        ...content,
        [field]: value
      }
    });
  };

  return (
    <div className="advanced-form-block">
      {editable && (
        <div className="block-config">
          <input
            type="text"
            placeholder="字段标签"
            value={content.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="field-label-input"
          />
          <div className="number-config">
            <input
              type="number"
              placeholder="最小值"
              value={content.min || ''}
              onChange={(e) => handleChange('min', e.target.value ? Number(e.target.value) : null)}
            />
            <input
              type="number"
              placeholder="最大值"
              value={content.max || ''}
              onChange={(e) => handleChange('max', e.target.value ? Number(e.target.value) : null)}
            />
            <input
              type="text"
              placeholder="单位"
              value={content.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={content.required}
              onChange={(e) => handleChange('required', e.target.checked)}
            />
            必填
          </label>
        </div>
      )}
      
      <div className="form-field">
        <label className="field-label">
          <Hash size={16} />
          {content.label}
          {content.required && <span className="required">*</span>}
        </label>
        <div className="number-input-wrapper">
          <input
            type="number"
            value={content.value}
            onChange={(e) => handleChange('value', Number(e.target.value))}
            min={content.min}
            max={content.max}
            step={content.step}
            className="form-input number-input"
            disabled={!editable}
          />
          {content.unit && <span className="input-unit">{content.unit}</span>}
        </div>
      </div>
    </div>
  );
};

// 人员选择块组件
export const PersonSelectorBlock = ({ block, onChange, editable = true }) => {
  const content = block.content || { 
    label: '人员选择', 
    value: [], 
    multiple: true,
    required: false 
  };

  // 模拟人员数据
  const mockPeople = [
    { id: 1, name: '张三', department: '产品部', avatar: '👨' },
    { id: 2, name: '李四', department: '技术部', avatar: '👩' },
    { id: 3, name: '王五', department: '设计部', avatar: '👨' },
    { id: 4, name: '赵六', department: '运营部', avatar: '👩' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (field, value) => {
    onChange({
      content: {
        ...content,
        [field]: value
      }
    });
  };

  const addPerson = (person) => {
    const currentPeople = Array.isArray(content.value) ? content.value : [];
    if (!currentPeople.find(p => p.id === person.id)) {
      handleChange('value', [...currentPeople, person]);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const removePerson = (personId) => {
    const currentPeople = Array.isArray(content.value) ? content.value : [];
    handleChange('value', currentPeople.filter(p => p.id !== personId));
  };

  const filteredPeople = mockPeople.filter(person => 
    person.name.includes(searchTerm) || person.department.includes(searchTerm)
  );

  return (
    <div className="advanced-form-block">
      {editable && (
        <div className="block-config">
          <input
            type="text"
            placeholder="字段标签"
            value={content.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="field-label-input"
          />
          <div className="config-options">
            <label>
              <input
                type="checkbox"
                checked={content.required}
                onChange={(e) => handleChange('required', e.target.checked)}
              />
              必填
            </label>
            <label>
              <input
                type="checkbox"
                checked={content.multiple}
                onChange={(e) => handleChange('multiple', e.target.checked)}
              />
              多选
            </label>
          </div>
        </div>
      )}
      
      <div className="form-field">
        <label className="field-label">
          <Users size={16} />
          {content.label}
          {content.required && <span className="required">*</span>}
        </label>
        
        <div className="person-selector">
          <div className="selected-people">
            {(content.value || []).map(person => (
              <div key={person.id} className="selected-person">
                <span className="person-avatar">{person.avatar}</span>
                <span className="person-name">{person.name}</span>
                {editable && (
                  <button 
                    onClick={() => removePerson(person.id)}
                    className="remove-person-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {editable && (
            <div className="person-search-wrapper">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder="搜索人员..."
                className="form-input person-search-input"
              />
              
              {showDropdown && (
                <div className="person-dropdown">
                  {filteredPeople.map(person => (
                    <div
                      key={person.id}
                      className="person-option"
                      onClick={() => addPerson(person)}
                    >
                      <span className="person-avatar">{person.avatar}</span>
                      <div className="person-info">
                        <div className="person-name">{person.name}</div>
                        <div className="person-department">{person.department}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 文件上传块组件
export const FileUploadBlock = ({ block, onChange, editable = true }) => {
  const content = block.content || { 
    label: '文件上传', 
    files: [], 
    maxFiles: 5,
    acceptedTypes: '.pdf,.doc,.docx,.png,.jpg,.jpeg',
    required: false 
  };

  const [dragOver, setDragOver] = useState(false);

  const handleChange = (field, value) => {
    onChange({
      content: {
        ...content,
        [field]: value
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!editable) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const currentFiles = content.files || [];
    const newFiles = [...currentFiles, ...droppedFiles.slice(0, content.maxFiles - currentFiles.length)];
    handleChange('files', newFiles);
  };

  const handleFileSelect = (e) => {
    if (!editable) return;
    
    const selectedFiles = Array.from(e.target.files);
    const currentFiles = content.files || [];
    const newFiles = [...currentFiles, ...selectedFiles.slice(0, content.maxFiles - currentFiles.length)];
    handleChange('files', newFiles);
  };

  const removeFile = (index) => {
    const newFiles = (content.files || []).filter((_, i) => i !== index);
    handleChange('files', newFiles);
  };

  return (
    <div className="advanced-form-block">
      {editable && (
        <div className="block-config">
          <input
            type="text"
            placeholder="字段标签"
            value={content.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="field-label-input"
          />
          <div className="file-config">
            <input
              type="number"
              placeholder="最大文件数"
              value={content.maxFiles}
              onChange={(e) => handleChange('maxFiles', Number(e.target.value))}
              min="1"
              max="10"
            />
            <input
              type="text"
              placeholder="允许的文件类型"
              value={content.acceptedTypes}
              onChange={(e) => handleChange('acceptedTypes', e.target.value)}
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={content.required}
              onChange={(e) => handleChange('required', e.target.checked)}
            />
            必填
          </label>
        </div>
      )}
      
      <div className="form-field">
        <label className="field-label">
          <Upload size={16} />
          {content.label}
          {content.required && <span className="required">*</span>}
        </label>
        
        <div
          className={`file-drop-zone ${dragOver ? 'drag-over' : ''} ${!editable ? 'disabled' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); if (editable) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          {editable && (
            <>
              <input
                type="file"
                multiple
                accept={content.acceptedTypes}
                onChange={handleFileSelect}
                className="file-input-hidden"
                id={`file-input-${block.id}`}
              />
              <label htmlFor={`file-input-${block.id}`} className="file-input-label">
                <div className="upload-icon">📁</div>
                <div>点击或拖拽文件到此处</div>
                <div className="upload-hint">最多 {content.maxFiles} 个文件</div>
              </label>
            </>
          )}
        </div>
        
        {(content.files || []).length > 0 && (
          <div className="file-list">
            {(content.files || []).map((file, index) => (
              <div key={index} className="file-item">
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                {editable && (
                  <button 
                    onClick={() => removeFile(index)}
                    className="remove-file-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 颜色选择块组件
export const ColorPickerBlock = ({ block, onChange, editable = true }) => {
  const content = block.content || { 
    label: '颜色选择', 
    value: '#4ECDC4',
    required: false 
  };

  const [showPicker, setShowPicker] = useState(false);
  
  const presetColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const handleChange = (field, value) => {
    onChange({
      content: {
        ...content,
        [field]: value
      }
    });
  };

  return (
    <div className="advanced-form-block">
      {editable && (
        <div className="block-config">
          <input
            type="text"
            placeholder="字段标签"
            value={content.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="field-label-input"
          />
          <label>
            <input
              type="checkbox"
              checked={content.required}
              onChange={(e) => handleChange('required', e.target.checked)}
            />
            必填
          </label>
        </div>
      )}
      
      <div className="form-field">
        <label className="field-label">
          <Palette size={16} />
          {content.label}
          {content.required && <span className="required">*</span>}
        </label>
        
        <div className="color-picker-wrapper">
          <div 
            className="color-preview"
            style={{ backgroundColor: content.value }}
            onClick={() => editable && setShowPicker(!showPicker)}
          >
            <span className="color-value">{content.value}</span>
          </div>
          
          {showPicker && editable && (
            <div className="color-picker-dropdown">
              <div className="preset-colors">
                {presetColors.map(color => (
                  <div
                    key={color}
                    className="preset-color"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      handleChange('value', color);
                      setShowPicker(false);
                    }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={content.value}
                onChange={(e) => handleChange('value', e.target.value)}
                className="color-input"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
