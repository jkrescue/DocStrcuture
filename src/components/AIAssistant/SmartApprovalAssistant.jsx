import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Target,
  FileSearch,
  BarChart3,
  Zap,
  Users,
  Calendar,
  MessageSquare,
  Eye,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import './SmartApprovalAssistant.css';

// 模拟AI分析数据
const generateSmartSuggestions = (documentData, historicalData) => {
  // 基于历史数据的审批预测
  const approvalPrediction = {
    probability: Math.random() * 0.4 + 0.6, // 60-100%的通过概率
    confidence: Math.random() * 0.3 + 0.7, // 70-100%的置信度
    avgProcessTime: Math.floor(Math.random() * 48) + 12, // 12-60小时
    similarDocsApproved: Math.floor(Math.random() * 50) + 20 // 20-70个相似文档
  };

  // 风险点识别
  const riskFactors = [
    {
      type: 'budget',
      level: 'medium',
      message: '预算金额超出同类项目15%，建议重点关注成本控制',
      suggestion: '对比近6个月类似项目的预算分配，优化资源配置'
    },
    {
      type: 'timeline',
      level: 'low',
      message: '项目时间线较为紧张，可能影响质量交付',
      suggestion: '建议增加关键节点的质量检查，确保按时交付'
    },
    {
      type: 'compliance',
      level: 'high',
      message: '发现潜在合规风险，需要法务部门确认',
      suggestion: '涉及数据处理条款，建议在审批前咨询法务意见'
    }
  ];

  // 审批意见建议
  const suggestedComments = [
    {
      type: 'positive',
      template: '项目目标明确，预算合理，建议通过。请在执行过程中重点关注进度控制。',
      useCase: '当文档质量较高且风险较低时使用'
    },
    {
      type: 'conditional',
      template: '总体方案可行，但建议在以下方面进行调整：1. 优化预算分配 2. 完善风险控制措施',
      useCase: '当文档有改进空间但整体可接受时使用'
    },
    {
      type: 'negative',
      template: '当前方案存在较大风险，建议重新评估以下要点：合规性检查、成本效益分析',
      useCase: '当发现重大风险或问题时使用'
    }
  ];

  // 相似文档参考
  const similarDocuments = [
    {
      id: 'doc_001',
      title: '2024年Q4营销活动策划方案',
      approvalResult: 'approved',
      processingTime: '24小时',
      similarity: 85,
      keyDecisionFactors: ['预算合理', '目标明确', '风险可控']
    },
    {
      id: 'doc_002', 
      title: '品牌推广项目实施计划',
      approvalResult: 'approved_with_conditions',
      processingTime: '36小时',
      similarity: 78,
      keyDecisionFactors: ['需要调整时间线', '预算需要优化']
    },
    {
      id: 'doc_003',
      title: '数字化转型方案设计',
      approvalResult: 'rejected',
      processingTime: '18小时',
      similarity: 72,
      keyDecisionFactors: ['合规风险过高', 'ROI不明确']
    }
  ];

  return {
    approvalPrediction,
    riskFactors,
    suggestedComments,
    similarDocuments
  };
};

const SmartApprovalAssistant = ({ 
  documentId,
  documentData,
  currentUser,
  onSuggestionApply,
  onFeedback 
}) => {
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [activeTab, setActiveTab] = useState('prediction');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRisk, setExpandedRisk] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  useEffect(() => {
    // 模拟AI分析过程
    setIsLoading(true);
    setTimeout(() => {
      const suggestions = generateSmartSuggestions(documentData, {});
      setAiSuggestions(suggestions);
      setIsLoading(false);
    }, 2000);
  }, [documentId, documentData]);

  const handleApplySuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    onSuggestionApply?.(suggestion);
  };

  const handleFeedback = (suggestionId, rating, comment) => {
    onFeedback?.(suggestionId, rating, comment);
  };

  if (isLoading) {
    return (
      <div className="smart-approval-assistant loading">
        <div className="ai-header">
          <Brain className="ai-icon pulse" size={24} />
          <div className="ai-title">
            <h3>AI审批助手</h3>
            <p>正在分析文档并生成智能建议...</p>
          </div>
        </div>
        <div className="loading-animation">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p>分析历史数据中...</p>
        </div>
      </div>
    );
  }

  if (!aiSuggestions) return null;

  const { approvalPrediction, riskFactors, suggestedComments, similarDocuments } = aiSuggestions;

  return (
    <div className="smart-approval-assistant">
      {/* AI助手头部 */}
      <div className="ai-header">
        <div className="ai-icon-wrapper">
          <Brain className="ai-icon" size={24} />
          <Sparkles className="sparkle-icon" size={16} />
        </div>
        <div className="ai-title">
          <h3>AI审批助手</h3>
          <p>基于{similarDocuments.length}个相似文档和历史数据分析</p>
        </div>
        <div className="confidence-badge">
          <Target size={16} />
          置信度 {Math.round(approvalPrediction.confidence * 100)}%
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="ai-tabs">
        <button 
          className={`tab-button ${activeTab === 'prediction' ? 'active' : ''}`}
          onClick={() => setActiveTab('prediction')}
        >
          <TrendingUp size={16} />
          预测分析
        </button>
        <button 
          className={`tab-button ${activeTab === 'risks' ? 'active' : ''}`}
          onClick={() => setActiveTab('risks')}
        >
          <AlertTriangle size={16} />
          风险识别
        </button>
        <button 
          className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          <Lightbulb size={16} />
          意见建议
        </button>
        <button 
          className={`tab-button ${activeTab === 'similar' ? 'active' : ''}`}
          onClick={() => setActiveTab('similar')}
        >
          <FileSearch size={16} />
          相似参考
        </button>
      </div>

      {/* 预测分析标签页 */}
      {activeTab === 'prediction' && (
        <div className="tab-content prediction-tab">
          <div className="prediction-summary">
            <div className="prediction-card main-prediction">
              <div className="prediction-header">
                <BarChart3 size={20} />
                <h4>审批通过概率</h4>
              </div>
              <div className="probability-display">
                <div className="probability-circle">
                  <svg viewBox="0 0 100 100" className="probability-svg">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="8"
                      strokeDasharray={`${approvalPrediction.probability * 283} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                      className="probability-progress"
                    />
                  </svg>
                  <div className="probability-text">
                    {Math.round(approvalPrediction.probability * 100)}%
                  </div>
                </div>
                <div className="probability-details">
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>预计处理时间: {approvalPrediction.avgProcessTime}小时</span>
                  </div>
                  <div className="detail-item">
                    <Users size={16} />
                    <span>相似文档: {approvalPrediction.similarDocsApproved}个已通过</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="prediction-factors">
              <h5>关键影响因素</h5>
              <div className="factors-list">
                <div className="factor positive">
                  <CheckCircle2 size={16} />
                  <span>文档结构完整，信息详尽</span>
                  <div className="factor-weight">+25%</div>
                </div>
                <div className="factor positive">
                  <CheckCircle2 size={16} />
                  <span>历史项目成功率较高</span>
                  <div className="factor-weight">+20%</div>
                </div>
                <div className="factor neutral">
                  <Info size={16} />
                  <span>预算范围在正常区间内</span>
                  <div className="factor-weight">+5%</div>
                </div>
                <div className="factor negative">
                  <AlertTriangle size={16} />
                  <span>存在合规风险需要关注</span>
                  <div className="factor-weight">-15%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 风险识别标签页 */}
      {activeTab === 'risks' && (
        <div className="tab-content risks-tab">
          <div className="risks-summary">
            <div className="risk-overview">
              <h4>识别到 {riskFactors.length} 个潜在风险点</h4>
              <div className="risk-level-stats">
                <div className="risk-stat high">
                  <div className="risk-count">1</div>
                  <div className="risk-label">高风险</div>
                </div>
                <div className="risk-stat medium">
                  <div className="risk-count">1</div>
                  <div className="risk-label">中风险</div>
                </div>
                <div className="risk-stat low">
                  <div className="risk-count">1</div>
                  <div className="risk-label">低风险</div>
                </div>
              </div>
            </div>

            <div className="risks-list">
              {riskFactors.map((risk, index) => (
                <div 
                  key={index} 
                  className={`risk-item ${risk.level} ${expandedRisk === index ? 'expanded' : ''}`}
                  onClick={() => setExpandedRisk(expandedRisk === index ? null : index)}
                >
                  <div className="risk-header">
                    <div className="risk-indicator">
                      <AlertTriangle size={18} />
                    </div>
                    <div className="risk-content">
                      <div className="risk-title">
                        <span className={`risk-badge ${risk.level}`}>
                          {risk.level === 'high' ? '高风险' : risk.level === 'medium' ? '中风险' : '低风险'}
                        </span>
                        <h5>{risk.message}</h5>
                      </div>
                      {expandedRisk === index && (
                        <div className="risk-details">
                          <div className="risk-suggestion">
                            <Lightbulb size={16} />
                            <span><strong>建议措施:</strong> {risk.suggestion}</span>
                          </div>
                          <div className="risk-actions">
                            <button className="risk-action primary">
                              <Eye size={14} />
                              查看详情
                            </button>
                            <button className="risk-action secondary">
                              <MessageSquare size={14} />
                              添加备注
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="risk-arrow">
                      <ArrowRight size={16} className={expandedRisk === index ? 'rotated' : ''} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 意见建议标签页 */}
      {activeTab === 'suggestions' && (
        <div className="tab-content suggestions-tab">
          <div className="suggestions-header">
            <h4>智能审批意见生成</h4>
            <p>基于文档内容和历史数据，为您推荐合适的审批意见</p>
          </div>

          <div className="suggestions-list">
            {suggestedComments.map((suggestion, index) => (
              <div 
                key={index} 
                className={`suggestion-card ${suggestion.type} ${selectedSuggestion?.template === suggestion.template ? 'selected' : ''}`}
              >
                <div className="suggestion-header">
                  <div className="suggestion-icon">
                    {suggestion.type === 'positive' && <ThumbsUp size={18} />}
                    {suggestion.type === 'conditional' && <Clock size={18} />}
                    {suggestion.type === 'negative' && <ThumbsDown size={18} />}
                  </div>
                  <div className="suggestion-type">
                    {suggestion.type === 'positive' && '推荐通过'}
                    {suggestion.type === 'conditional' && '有条件通过'}
                    {suggestion.type === 'negative' && '建议拒绝'}
                  </div>
                  <div className="suggestion-usage">
                    <Info size={14} />
                    <span>{suggestion.useCase}</span>
                  </div>
                </div>

                <div className="suggestion-content">
                  <p>{suggestion.template}</p>
                </div>

                <div className="suggestion-actions">
                  <button 
                    className="suggestion-action primary"
                    onClick={() => handleApplySuggestion(suggestion)}
                  >
                    <Zap size={14} />
                    使用此模板
                  </button>
                  <button className="suggestion-action secondary">
                    <MessageSquare size={14} />
                    自定义编辑
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="custom-suggestion">
            <h5>自定义意见生成</h5>
            <div className="custom-form">
              <textarea 
                placeholder="描述您的具体要求，AI将帮您生成个性化的审批意见..."
                rows={3}
              />
              <button className="generate-btn">
                <Brain size={16} />
                生成意见
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 相似文档参考标签页 */}
      {activeTab === 'similar' && (
        <div className="tab-content similar-tab">
          <div className="similar-header">
            <h4>相似文档审批参考</h4>
            <p>找到 {similarDocuments.length} 个相似度较高的历史文档</p>
          </div>

          <div className="similar-documents">
            {similarDocuments.map((doc, index) => (
              <div key={doc.id} className="similar-doc-card">
                <div className="doc-header">
                  <div className="doc-title">
                    <FileSearch size={18} />
                    <h5>{doc.title}</h5>
                  </div>
                  <div className="similarity-score">
                    相似度 {doc.similarity}%
                  </div>
                </div>

                <div className="doc-details">
                  <div className="doc-result">
                    <div className={`result-badge ${doc.approvalResult.replace('_', '-')}`}>
                      {doc.approvalResult === 'approved' && <CheckCircle2 size={14} />}
                      {doc.approvalResult === 'approved_with_conditions' && <Clock size={14} />}
                      {doc.approvalResult === 'rejected' && <XCircle size={14} />}
                      <span>
                        {doc.approvalResult === 'approved' && '已通过'}
                        {doc.approvalResult === 'approved_with_conditions' && '有条件通过'}
                        {doc.approvalResult === 'rejected' && '已拒绝'}
                      </span>
                    </div>
                    <div className="processing-time">
                      <Calendar size={14} />
                      处理时间: {doc.processingTime}
                    </div>
                  </div>

                  <div className="decision-factors">
                    <h6>关键决策因素:</h6>
                    <div className="factors">
                      {doc.keyDecisionFactors.map((factor, i) => (
                        <span key={i} className="factor-tag">{factor}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="doc-actions">
                  <button className="doc-action">
                    <Eye size={14} />
                    查看详情
                  </button>
                  <button className="doc-action">
                    <MessageSquare size={14} />
                    参考意见
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 反馈区域 */}
      <div className="ai-feedback">
        <div className="feedback-header">
          <h5>这些建议对您有帮助吗？</h5>
        </div>
        <div className="feedback-actions">
          <button 
            className="feedback-btn positive"
            onClick={() => handleFeedback('suggestions', 'positive', '')}
          >
            <ThumbsUp size={16} />
            有帮助
          </button>
          <button 
            className="feedback-btn negative"
            onClick={() => handleFeedback('suggestions', 'negative', '')}
          >
            <ThumbsDown size={16} />
            需要改进
          </button>
          <button className="feedback-btn neutral">
            <MessageSquare size={16} />
            提供反馈
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartApprovalAssistant;
