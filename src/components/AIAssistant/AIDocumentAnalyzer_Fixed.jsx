import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Table, 
  Target, 
  Calendar, 
  DollarSign, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Eye, 
  Copy, 
  Plus, 
  X, 
  RefreshCw,
  User,
  FileSearch,
  Clock,
  Download
} from 'lucide-react';
import './AIDocumentAnalyzer.css';

// 简化的分析数据生成函数
const generateAnalysisData = (content) => {
  return {
    documentType: 'general',
    confidence: 0.95,
    extractedData: {
      tables: [
        {
          id: 'product_comparison',
          title: '竞品功能对比表',
          type: 'data',
          rows: 7,
          columns: 6,
          confidence: 0.92,
          data: [
            ['功能', 'Notion', 'Confluence', 'Obsidian', 'Typora', '石墨文档'],
            ['实时协作', '✓', '✓', 'X', 'X', '✓'],
            ['模板系统', '✓', '✓', 'X', 'X', '✓'],
            ['版本控制', '✓', '✓', 'X', 'X', '✓'],
            ['移动应用', '✓', '✓', '✓', 'X', '✓'],
            ['离线编辑', '✓', '✓', '✓', '✓', '✓']
          ],
          insights: [
            '检测到完整的竞品对比分析表格',
            '发现5个主要竞品的功能对比',
            '实时协作和移动应用是关键差异化功能'
          ]
        }
      ],
      keyInfo: [
        { 
          type: 'target', 
          label: '分析产品数量', 
          value: '5个', 
          confidence: 1.0, 
          source: '表格统计', 
          location: '对比表格' 
        },
        { 
          type: 'target', 
          label: '对比功能项', 
          value: '5项核心功能', 
          confidence: 0.95, 
          source: '自动识别', 
          location: '表格行' 
        },
        { 
          type: 'date', 
          label: '分析时间', 
          value: new Date().toLocaleDateString(), 
          confidence: 1.0, 
          source: '系统生成', 
          location: '文档属性' 
        },
        { 
          type: 'target', 
          label: '文档类型', 
          value: '竞品分析报告', 
          confidence: 0.88, 
          source: '内容分析', 
          location: '标题识别' 
        }
      ],
      risks: [
        {
          id: 'risk_1',
          title: '功能对比不够深入',
          level: 'medium',
          probability: 0.65,
          description: '当前对比主要关注基础功能，缺少深度功能分析',
          suggestion: '建议补充高级功能对比，如API集成、自定义扩展等'
        },
        {
          id: 'risk_2', 
          title: '缺少用户体验评估',
          level: 'medium',
          probability: 0.70,
          description: '分析侧重功能有无，缺少用户体验和易用性对比',
          suggestion: '建议加入用户界面友好度、学习成本等评估维度'
        }
      ],
      suggestions: [
        {
          id: 'suggestion_1',
          title: '增加定价分析',
          impact: 'high',
          effort: 'low',
          description: '补充各产品的定价策略和成本效益分析'
        },
        {
          id: 'suggestion_2',
          title: '添加市场份额数据',
          impact: 'medium', 
          effort: 'medium',
          description: '收集各竞品的市场占有率和用户规模数据'
        }
      ]
    }
  };
};

const AIDocumentAnalyzer = ({ 
  document,
  onClose,
  onExtractedDataApply,
  onSuggestionApply,
  className = ''
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('tables');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailModalContent, setDetailModalContent] = useState(null);

  // 分析文档内容
  const analyzeDocument = useCallback(async () => {
    if (!document) return;
    
    setIsAnalyzing(true);
    
    // 模拟分析延迟
    setTimeout(() => {
      const content = document.blocks?.map(block => block.content || '').join(' ') || document.title || '';
      const analysisResult = generateAnalysisData(content);
      setAnalysis(analysisResult);
      setIsAnalyzing(false);
    }, 2000);
  }, [document]);

  useEffect(() => {
    analyzeDocument();
  }, [analyzeDocument]);

  const handleApplyKeyInfo = (info) => {
    onExtractedDataApply?.({
      type: 'keyInfo',
      data: info
    });
  };

  const handleApplyTable = (table) => {
    onExtractedDataApply?.({
      type: 'table',
      data: table
    });
  };

  const handleApplySuggestion = (suggestion) => {
    onSuggestionApply?.(suggestion);
  };

  const showDetailView = (type, data) => {
    setDetailModalContent({ type, data });
    setShowDetailModal(true);
  };

  return (
    <div className={`ai-document-analyzer ${className}`}>
      {/* 分析器头部 */}
      <div className="analyzer-header">
        <div className="header-left">
          <div className="ai-icon">
            <Sparkles size={20} />
            <div className="sparkle">
              <Sparkles size={12} />
            </div>
          </div>
          <div className="header-info">
            <h3>AI文档分析</h3>
            <p>智能提取 • 风险识别 • 优化建议</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={analyzeDocument}
            disabled={isAnalyzing}
          >
            <RefreshCw size={14} />
            重新分析
          </button>
        </div>
      </div>

      {/* 分析中状态 */}
      {isAnalyzing && (
        <div className="analyzing-state">
          <div className="analyzing-animation">
            <div className="pulse-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>正在分析文档内容...</p>
          </div>
          <div className="analyzing-steps">
            <div className="step active">
              <CheckCircle size={16} />
              <span>表格识别</span>
            </div>
            <div className="step active">
              <CheckCircle size={16} />
              <span>信息提取</span>
            </div>
            <div className="step">
              <Clock size={16} />
              <span>风险评估</span>
            </div>
          </div>
        </div>
      )}

      {/* 分析结果 */}
      {analysis && !isAnalyzing && (
        <div className="analysis-results">
          {/* 标签页导航 */}
          <div className="analysis-tabs">
            <button 
              className={`tab ${activeTab === 'tables' ? 'active' : ''}`}
              onClick={() => setActiveTab('tables')}
            >
              <Table size={16} />
              表格数据 ({analysis.extractedData?.tables?.length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'keyinfo' ? 'active' : ''}`}
              onClick={() => setActiveTab('keyinfo')}
            >
              <Target size={16} />
              关键信息 ({analysis.extractedData?.keyInfo?.length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'risks' ? 'active' : ''}`}
              onClick={() => setActiveTab('risks')}
            >
              <AlertTriangle size={16} />
              风险识别 ({analysis.extractedData?.risks?.length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              <Lightbulb size={16} />
              优化建议 ({analysis.extractedData?.suggestions?.length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <CheckCircle size={16} />
              校核流程
            </button>
          </div>

          {/* 表格数据标签页 */}
          {activeTab === 'tables' && (
            <div className="tables-section">
              {analysis.extractedData?.tables?.map((table, index) => (
                <div key={table.id} className="table-card">
                  <div className="table-header">
                    <div className="table-info">
                      <h4>{table.title}</h4>
                      <div className="table-meta">
                        <span className="table-size">{table.rows}行 × {table.columns}列</span>
                        <span className="confidence">置信度 {Math.round(table.confidence * 100)}%</span>
                        <span className={`table-type ${table.type}`}>{table.type}</span>
                      </div>
                    </div>
                    <div className="table-actions">
                      <button 
                        className="action-btn preview"
                        onClick={() => showDetailView('table', table)}
                      >
                        <Eye size={14} />
                        查看
                      </button>
                      <button 
                        className="action-btn apply"
                        onClick={() => handleApplyTable(table)}
                      >
                        <Plus size={14} />
                        应用
                      </button>
                    </div>
                  </div>

                  {/* 表格预览 */}
                  <div className="table-preview">
                    <table>
                      <thead>
                        <tr>
                          {table.data[0]?.map((header, i) => (
                            <th key={i}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.data.slice(1, 4).map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {table.data.length > 4 && (
                      <div className="table-more">
                        还有 {table.data.length - 4} 行数据...
                      </div>
                    )}
                  </div>

                  {/* 表格洞察 */}
                  {table.insights && table.insights.length > 0 && (
                    <div className="table-insights">
                      <h5>智能洞察</h5>
                      <ul>
                        {table.insights.map((insight, i) => (
                          <li key={i}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 关键信息标签页 */}
          {activeTab === 'keyinfo' && (
            <div className="keyinfo-section">
              <div className="keyinfo-grid">
                {analysis.extractedData?.keyInfo?.map((info, index) => (
                  <div key={index} className={`keyinfo-card ${info.type}`}>
                    <div className="keyinfo-icon">
                      {info.type === 'date' && <Calendar size={20} />}
                      {info.type === 'currency' && <DollarSign size={20} />}
                      {info.type === 'person' && <Users size={20} />}
                      {info.type === 'target' && <Target size={20} />}
                      {info.type === 'phone' && <Phone size={20} />}
                      {info.type === 'email' && <Mail size={20} />}
                      {info.type === 'location' && <MapPin size={20} />}
                    </div>
                    
                    <div className="keyinfo-content">
                      <div className="keyinfo-label">{info.label}</div>
                      <div className="keyinfo-value">{info.value}</div>
                      <div className="keyinfo-meta">
                        <span className="location">来源: {info.location}</span>
                        <span className="confidence">置信度 {Math.round(info.confidence * 100)}%</span>
                      </div>
                    </div>

                    <div className="keyinfo-actions">
                      <button 
                        className="action-btn copy"
                        onClick={() => navigator.clipboard.writeText(info.value)}
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        className="action-btn apply"
                        onClick={() => handleApplyKeyInfo(info)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 风险识别标签页 */}
          {activeTab === 'risks' && (
            <div className="risks-section">
              {analysis.extractedData?.risks?.map((risk, index) => (
                <div key={index} className={`risk-card ${risk.level}`}>
                  <div className="risk-header">
                    <div className="risk-indicator">
                      <AlertTriangle size={18} />
                    </div>
                    <div className="risk-content">
                      <div className="risk-title">
                        <h4>{risk.title}</h4>
                        <span className={`risk-level ${risk.level}`}>{risk.level}</span>
                        <span className="probability">概率 {Math.round(risk.probability * 100)}%</span>
                      </div>
                      <p className="risk-description">{risk.description}</p>
                      <div className="risk-suggestion">💡 {risk.suggestion}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 优化建议标签页 */}
          {activeTab === 'suggestions' && (
            <div className="suggestions-section">
              {analysis.extractedData?.suggestions?.map((suggestion, index) => (
                <div key={index} className="suggestion-card">
                  <div className="suggestion-header">
                    <div className="suggestion-icon">
                      <Lightbulb size={20} />
                    </div>
                    <div className="suggestion-content">
                      <div className="suggestion-title">
                        <h4>{suggestion.title}</h4>
                        <div className="suggestion-badges">
                          <span className={`impact ${suggestion.impact}`}>影响: {suggestion.impact}</span>
                          <span className={`effort ${suggestion.effort}`}>成本: {suggestion.effort}</span>
                        </div>
                      </div>
                      <p className="suggestion-description">{suggestion.description}</p>
                      <div className="suggestion-actions">
                        <button 
                          className="apply-btn"
                          onClick={() => handleApplySuggestion(suggestion)}
                        >
                          <Plus size={14} />
                          应用建议
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 校核流程标签页 */}
          {activeTab === 'audit' && (
            <div className="audit-section">
              <div className="audit-workflow">
                <h4 style={{ marginBottom: '20px', color: '#374151', fontSize: '16px', fontWeight: '600' }}>
                  文档校核工作流
                </h4>
                
                <div className="audit-steps">
                  <div className="audit-step completed">
                    <div className="step-icon">
                      <CheckCircle size={16} />
                    </div>
                    <div className="step-content">
                      <h5>自动检查</h5>
                      <p>术语统一性、格式规范、引用完整性检查</p>
                      <span className="step-status">已完成 - 2分钟前</span>
                    </div>
                  </div>
                  
                  <div className="audit-step active">
                    <div className="step-icon">
                      <Clock size={16} />
                    </div>
                    <div className="step-content">
                      <h5>专家审阅</h5>
                      <p>等待技术专家审阅</p>
                      <span className="step-status">进行中 - 已分配</span>
                    </div>
                  </div>
                </div>

                <div className="auto-check-results">
                  <h5 style={{ marginBottom: '16px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>
                    自动检查结果
                  </h5>
                  
                  <div className="check-item">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    <span>术语统一性检查 - 通过</span>
                  </div>
                  
                  <div className="check-item">
                    <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                    <span>表格格式检查 - 发现1处不规范</span>
                  </div>
                </div>

                <div className="audit-actions">
                  <button 
                    className="action-btn apply"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '10px 16px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                  >
                    <FileSearch size={14} />
                    触发专家复审
                  </button>
                  
                  <button 
                    className="action-btn preview"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '10px 16px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} />
                    导出校核报告
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 详情模态框 */}
      {showDetailModal && detailModalContent && (
        <div className="detail-modal">
          <div className="modal-backdrop" onClick={() => setShowDetailModal(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h3>{detailModalContent.data.title}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <table className="detail-table">
                <thead>
                  <tr>
                    {detailModalContent.data.data[0]?.map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detailModalContent.data.data.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn secondary" onClick={() => setShowDetailModal(false)}>
                关闭
              </button>
              <button 
                className="btn primary"
                onClick={() => {
                  handleApplyTable(detailModalContent.data);
                  setShowDetailModal(false);
                }}
              >
                <Plus size={14} />
                应用到文档
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDocumentAnalyzer;
