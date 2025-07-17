import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  MessageSquare, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  TrendingUp,
  FileSearch,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import SmartApprovalAssistant from './SmartApprovalAssistant';
import './AICollaborationAssistant.css';

// AI协作助手主组件
const AICollaborationAssistant = ({ 
  documentId,
  documentData,
  currentUser,
  isOpen = false,
  onToggle,
  onClose 
}) => {
  const [activeMode, setActiveMode] = useState('approval'); // approval, review, suggestion
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 模拟AI分析过程
  useEffect(() => {
    if (isOpen && documentData) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setAiInsights({
          collaborationScore: Math.random() * 30 + 70, // 70-100分
          activeCollaborators: Math.floor(Math.random() * 8) + 2, // 2-10人
          pendingActions: Math.floor(Math.random() * 5) + 1, // 1-6个
          suggestionsCount: Math.floor(Math.random() * 3) + 2 // 2-5个
        });
        setIsAnalyzing(false);
      }, 1500);
    }
  }, [isOpen, documentData]);

  const handleSuggestionApply = (suggestion) => {
    console.log('Applied suggestion:', suggestion);
    // 这里可以集成到实际的审批系统中
  };

  const handleFeedback = (suggestionId, rating, comment) => {
    console.log('Feedback:', { suggestionId, rating, comment });
    // 发送反馈到AI训练系统
  };

  if (!isOpen) return null;

  return (
    <div className={`ai-collaboration-assistant ${isMinimized ? 'minimized' : ''}`}>
      {/* 助手头部 */}
      <div className="ai-assistant-header">
        <div className="header-left">
          <div className="ai-avatar">
            <Brain size={20} />
            <Sparkles className="sparkle" size={12} />
          </div>
          <div className="header-info">
            <h3>AI协作助手</h3>
            {!isMinimized && (
              <p>
                {isAnalyzing ? '正在分析文档...' : '为您提供智能协作建议'}
              </p>
            )}
          </div>
        </div>
        
        <div className="header-actions">
          {/* 协作状态指示器 */}
          {aiInsights && !isMinimized && (
            <div className="collaboration-status">
              <div className="status-item">
                <Users size={14} />
                <span>{aiInsights.activeCollaborators}人协作中</span>
              </div>
              <div className="status-item">
                <CheckCircle size={14} />
                <span>{aiInsights.pendingActions}个待处理</span>
              </div>
              <div className="status-score">
                <TrendingUp size={14} />
                <span>协作效率 {Math.round(aiInsights.collaborationScore)}%</span>
              </div>
            </div>
          )}
          
          <button 
            className="minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      {!isMinimized && (
        <div className="ai-assistant-content">
          {/* 模式切换选项卡 */}
          <div className="mode-tabs">
            <button 
              className={`mode-tab ${activeMode === 'approval' ? 'active' : ''}`}
              onClick={() => setActiveMode('approval')}
            >
              <CheckCircle size={16} />
              智能审批
            </button>
            <button 
              className={`mode-tab ${activeMode === 'review' ? 'active' : ''}`}
              onClick={() => setActiveMode('review')}
            >
              <FileSearch size={16} />
              协作分析
            </button>
            <button 
              className={`mode-tab ${activeMode === 'suggestion' ? 'active' : ''}`}
              onClick={() => setActiveMode('suggestion')}
            >
              <Lightbulb size={16} />
              优化建议
            </button>
          </div>

          {/* 内容区域 */}
          <div className="assistant-body">
            {activeMode === 'approval' && (
              <SmartApprovalAssistant
                documentId={documentId}
                documentData={documentData}
                currentUser={currentUser}
                onSuggestionApply={handleSuggestionApply}
                onFeedback={handleFeedback}
              />
            )}

            {activeMode === 'review' && (
              <div className="collaboration-analysis">
                <h4>协作效率分析</h4>
                {isAnalyzing ? (
                  <div className="analysis-loading">
                    <div className="loading-spinner"></div>
                    <p>正在分析协作数据...</p>
                  </div>
                ) : aiInsights ? (
                  <div className="analysis-content">
                    {/* 协作效率概览 */}
                    <div className="efficiency-overview">
                      <div className="efficiency-circle">
                        <svg viewBox="0 0 100 100" className="efficiency-svg">
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke="#e5e7eb" 
                            strokeWidth="8"
                          />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="8"
                            strokeDasharray={`${(aiInsights.collaborationScore / 100) * 251} 251`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="efficiency-text">
                          {Math.round(aiInsights.collaborationScore)}%
                        </div>
                      </div>
                      <div className="efficiency-details">
                        <h5>协作效率评分</h5>
                        <p>基于响应时间、参与度、任务完成率等指标综合评估</p>
                        <div className="metrics">
                          <div className="metric">
                            <span className="metric-label">平均响应时间</span>
                            <span className="metric-value">2.3小时</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">活跃参与度</span>
                            <span className="metric-value">85%</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">任务完成率</span>
                            <span className="metric-value">92%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 协作热点分析 */}
                    <div className="collaboration-hotspots">
                      <h5>协作热点区域</h5>
                      <div className="hotspots-list">
                        <div className="hotspot-item high">
                          <div className="hotspot-indicator"></div>
                          <div className="hotspot-content">
                            <span className="hotspot-title">第3章节 - 预算规划</span>
                            <span className="hotspot-stats">8条评论 • 3人编辑</span>
                          </div>
                        </div>
                        <div className="hotspot-item medium">
                          <div className="hotspot-indicator"></div>
                          <div className="hotspot-content">
                            <span className="hotspot-title">第5章节 - 风险评估</span>
                            <span className="hotspot-stats">5条评论 • 2人编辑</span>
                          </div>
                        </div>
                        <div className="hotspot-item low">
                          <div className="hotspot-indicator"></div>
                          <div className="hotspot-content">
                            <span className="hotspot-title">第1章节 - 项目概述</span>
                            <span className="hotspot-stats">2条评论 • 1人编辑</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 瓶颈识别 */}
                    <div className="bottleneck-analysis">
                      <h5>协作瓶颈识别</h5>
                      <div className="bottlenecks">
                        <div className="bottleneck-item">
                          <AlertTriangle size={16} className="bottleneck-icon" />
                          <div className="bottleneck-info">
                            <span className="bottleneck-title">审批流程延迟</span>
                            <span className="bottleneck-detail">财务审批环节平均用时48小时，超出预期</span>
                          </div>
                        </div>
                        <div className="bottleneck-item">
                          <Users size={16} className="bottleneck-icon" />
                          <div className="bottleneck-info">
                            <span className="bottleneck-title">关键人员参与度低</span>
                            <span className="bottleneck-detail">技术负责人李明最近3天未参与讨论</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {activeMode === 'suggestion' && (
              <div className="optimization-suggestions">
                <h4>协作优化建议</h4>
                
                <div className="suggestions-grid">
                  {/* 流程优化建议 */}
                  <div className="suggestion-category">
                    <h5>
                      <Zap size={16} />
                      流程优化
                    </h5>
                    <div className="suggestion-items">
                      <div className="suggestion-item">
                        <div className="suggestion-header">
                          <span className="suggestion-title">并行审批流程</span>
                          <span className="impact-badge high">高影响</span>
                        </div>
                        <p className="suggestion-desc">
                          建议将财务审批和技术审批并行进行，可节省约24小时
                        </p>
                        <button className="apply-suggestion-btn">
                          <Zap size={14} />
                          应用建议
                        </button>
                      </div>
                      
                      <div className="suggestion-item">
                        <div className="suggestion-header">
                          <span className="suggestion-title">自动化提醒</span>
                          <span className="impact-badge medium">中影响</span>
                        </div>
                        <p className="suggestion-desc">
                          设置智能提醒，当评论超过24小时未回复时自动通知
                        </p>
                        <button className="apply-suggestion-btn">
                          <Zap size={14} />
                          应用建议
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 沟通优化建议 */}
                  <div className="suggestion-category">
                    <h5>
                      <MessageSquare size={16} />
                      沟通优化
                    </h5>
                    <div className="suggestion-items">
                      <div className="suggestion-item">
                        <div className="suggestion-header">
                          <span className="suggestion-title">定期同步会议</span>
                          <span className="impact-badge medium">中影响</span>
                        </div>
                        <p className="suggestion-desc">
                          建议每周二、四下午3点安排15分钟协作同步会议
                        </p>
                        <button className="apply-suggestion-btn">
                          <Zap size={14} />
                          应用建议
                        </button>
                      </div>
                      
                      <div className="suggestion-item">
                        <div className="suggestion-header">
                          <span className="suggestion-title">专家咨询机制</span>
                          <span className="impact-badge high">高影响</span>
                        </div>
                        <p className="suggestion-desc">
                          对于复杂问题，建议引入相关领域专家进行咨询
                        </p>
                        <button className="apply-suggestion-btn">
                          <Zap size={14} />
                          应用建议
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 效率提升建议 */}
                  <div className="suggestion-category">
                    <h5>
                      <TrendingUp size={16} />
                      效率提升
                    </h5>
                    <div className="suggestion-items">
                      <div className="suggestion-item">
                        <div className="suggestion-header">
                          <span className="suggestion-title">模板标准化</span>
                          <span className="impact-badge low">低影响</span>
                        </div>
                        <p className="suggestion-desc">
                          创建标准化的文档模板，减少重复性工作
                        </p>
                        <button className="apply-suggestion-btn">
                          <Zap size={14} />
                          应用建议
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AICollaborationAssistant;