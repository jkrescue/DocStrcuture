import React, { useState } from 'react';
import './AdvancedFormControls.css';

// 日期时间选择器组件
const DateTimeSelector = ({ value, onChange, label, type = "datetime-local" }) => {
  return (
    <div className="form-control-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input datetime-input"
      />
    </div>
  );
};

// 下拉菜单组件
const DropdownSelector = ({ value, onChange, options, label, multiple = false }) => {
  return (
    <div className="form-control-group">
      <label className="form-label">{label}</label>
      <select
        value={value}
        onChange={(e) => {
          if (multiple) {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            onChange(selectedOptions);
          } else {
            onChange(e.target.value);
          }
        }}
        multiple={multiple}
        className="form-input dropdown-input"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// 文件上传器组件
const FileUploader = ({ files, onChange, label, accept = "*/*", maxFiles = 5 }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onChange([...files, ...droppedFiles.slice(0, maxFiles - files.length)]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onChange([...files, ...selectedFiles.slice(0, maxFiles - files.length)]);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="form-control-group">
      <label className="form-label">{label}</label>
      <div
        className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="file-input-hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          <div className="upload-icon">📁</div>
          <div>点击或拖拽文件到此处</div>
          <div className="upload-hint">最多 {maxFiles} 个文件</div>
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <span className="file-name">{file.name}</span>
              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
              <button 
                onClick={() => removeFile(index)}
                className="remove-file-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 数字输入器组件
const NumberInput = ({ value, onChange, label, min, max, step = 1, unit = "" }) => {
  return (
    <div className="form-control-group">
      <label className="form-label">{label}</label>
      <div className="number-input-wrapper">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="form-input number-input"
        />
        {unit && <span className="input-unit">{unit}</span>}
      </div>
    </div>
  );
};

// 人员选择器组件
const PersonSelector = ({ selectedPeople, onChange, label }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // 模拟人员数据
  const allPeople = [
    { id: 1, name: '张三', avatar: '👨', department: '产品部' },
    { id: 2, name: '李四', avatar: '👩', department: '技术部' },
    { id: 3, name: '王五', avatar: '👨', department: '设计部' },
    { id: 4, name: '赵六', avatar: '👩', department: '运营部' },
    { id: 5, name: '陈七', avatar: '👨', department: '产品部' }
  ];

  const filteredPeople = allPeople.filter(person => 
    person.name.includes(searchTerm) || person.department.includes(searchTerm)
  );

  const addPerson = (person) => {
    if (!selectedPeople.find(p => p.id === person.id)) {
      onChange([...selectedPeople, person]);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const removePerson = (personId) => {
    onChange(selectedPeople.filter(p => p.id !== personId));
  };

  return (
    <div className="form-control-group">
      <label className="form-label">{label}</label>
      <div className="person-selector">
        <div className="selected-people">
          {selectedPeople.map(person => (
            <div key={person.id} className="selected-person">
              <span className="person-avatar">{person.avatar}</span>
              <span className="person-name">{person.name}</span>
              <button 
                onClick={() => removePerson(person.id)}
                className="remove-person-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
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
              {filteredPeople.length === 0 && (
                <div className="no-results">未找到匹配的人员</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 颜色选择器组件
const ColorPicker = ({ value, onChange, label }) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const presetColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  return (
    <div className="form-control-group">
      <label className="form-label">{label}</label>
      <div className="color-picker-wrapper">
        <div 
          className="color-preview"
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        >
          <span className="color-value">{value}</span>
        </div>
        
        {showPicker && (
          <div className="color-picker-dropdown">
            <div className="preset-colors">
              {presetColors.map(color => (
                <div
                  key={color}
                  className="preset-color"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color);
                    setShowPicker(false);
                  }}
                />
              ))}
            </div>
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="color-input"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// 主组件
const AdvancedFormControls = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    priority: '',
    categories: [],
    files: [],
    budget: 0,
    assignees: [],
    themeColor: '#4ECDC4'
  });

  const priorityOptions = [
    { value: '', label: '请选择优先级' },
    { value: 'low', label: '低优先级' },
    { value: 'medium', label: '中优先级' },
    { value: 'high', label: '高优先级' },
    { value: 'urgent', label: '紧急' }
  ];

  const categoryOptions = [
    { value: 'development', label: '开发' },
    { value: 'design', label: '设计' },
    { value: 'testing', label: '测试' },
    { value: 'documentation', label: '文档' },
    { value: 'marketing', label: '市场' }
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="advanced-form-controls">
      <div className="form-header">
        <h2>🎛️ 高级表单控件演示</h2>
        <p>展示各种高级表单控件的交互功能</p>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <h3>📅 日期时间控件</h3>
          <DateTimeSelector
            value={formData.startDate}
            onChange={(value) => updateFormData('startDate', value)}
            label="开始时间"
          />
          <DateTimeSelector
            value={formData.endDate}
            onChange={(value) => updateFormData('endDate', value)}
            label="结束时间"
          />
        </div>

        <div className="form-section">
          <h3>📋 选择控件</h3>
          <DropdownSelector
            value={formData.priority}
            onChange={(value) => updateFormData('priority', value)}
            options={priorityOptions}
            label="优先级"
          />
          <DropdownSelector
            value={formData.categories}
            onChange={(value) => updateFormData('categories', value)}
            options={categoryOptions}
            label="类别 (多选)"
            multiple={true}
          />
        </div>

        <div className="form-section">
          <h3>📁 文件上传</h3>
          <FileUploader
            files={formData.files}
            onChange={(files) => updateFormData('files', files)}
            label="项目附件"
            accept=".pdf,.doc,.docx,.png,.jpg"
            maxFiles={3}
          />
        </div>

        <div className="form-section">
          <h3>🔢 数值输入</h3>
          <NumberInput
            value={formData.budget}
            onChange={(value) => updateFormData('budget', value)}
            label="项目预算"
            min={0}
            max={1000000}
            step={1000}
            unit="元"
          />
        </div>

        <div className="form-section">
          <h3>👥 人员选择</h3>
          <PersonSelector
            selectedPeople={formData.assignees}
            onChange={(people) => updateFormData('assignees', people)}
            label="项目成员"
          />
        </div>

        <div className="form-section">
          <h3>🎨 颜色选择</h3>
          <ColorPicker
            value={formData.themeColor}
            onChange={(color) => updateFormData('themeColor', color)}
            label="主题色彩"
          />
        </div>
      </div>

      <div className="form-preview">
        <h3>📊 表单数据预览</h3>
        <pre className="form-data-display">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AdvancedFormControls;
