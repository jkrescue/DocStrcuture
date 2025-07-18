import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Eye,
  Settings
} from 'lucide-react';
import AIAssistantTrigger from '../components/AIAssistant/AIAssistantTrigger';
import { ApprovalWorkflow } from '../components/ApprovalSystem/ApprovalSystem';
import './AISmartApprovalDemo.css';

// 模拟文档数据
const mockDocumentData = {
  id: 'doc_2024_001',
  title: '新能源SUV车型开发项目技术规格书',
  content: '本文档详细描述了新能源SUV车型的开发技术规格，包括动力系统设计、车身结构、安全配置、测试验证和项目计划等内容...',
  type: 'vehicle_development',
  category: '车型研发',
  createTime: '2024-01-15T09:30:00Z',
  author: {
    id: 'user_001',
    name: '张工程师',
    role: '车型项目经理',
    avatar: '👨‍�'
  },
  metadata: {
    budget: 1500000000, // 15亿元
    duration: '36个月',
    targetMarket: '中高端新能源SUV市场',
    vehicleType: ['纯电动', 'SUV', '中大型'],
    expectedSOP: '2025年12月'
  },
  sections: [
    { id: 'overview', title: '项目概述', status: 'completed' },
    { id: 'powertrain', title: '动力系统设计', status: 'completed' },
    { id: 'structure', title: '车身结构规划', status: 'in_review' },
    { id: 'timeline', title: '开发时间线', status: 'completed' },
    { id: 'testing', title: '测试验证计划', status: 'in_review' },
    { id: 'quality', title: '质量保证标准', status: 'pending' }
  ]
};

// 模拟当前用户
const mockCurrentUser = {
  id: 'user_002',
  name: '李总工',
  role: '技术总监',
  avatar: '�‍�',
  permissions: ['approve', 'comment', 'edit']
};

// 模拟审批流程数据
const mockApprovalFlow = {
  id: 'flow_001',
  documentId: 'doc_2024_001',
  steps: [
    {
      id: 'step_1',
      name: '技术评审',
      assignee: {
        id: 'user_002',
        name: '李总工',
        role: '技术总监',
        avatar: '�‍�'
      },
      status: 'pending',
      dueDate: '2024-01-20T18:00:00Z',
      description: '审核技术方案可行性和规格合理性'
    },
    {
      id: 'step_2', 
      name: '质量标准审核',
      assignee: {
        id: 'user_003',
        name: '王质量',
        role: '质量经理',
        avatar: '�'
      },
      status: 'pending',
      dueDate: '2024-01-22T18:00:00Z',
      description: '审核车型质量标准和测试计划'
    },
    {
      id: 'step_3',
      name: '项目投资决策',
      assignee: {
        id: 'user_004',
        name: '赵总裁',
        role: '公司总裁',
        avatar: '👔'
      },
      status: 'pending',
      dueDate: '2024-01-25T18:00:00Z',
      description: '最终投资决策和项目启动批准'
    }
  ],
  currentStep: 0,
  startTime: '2024-01-15T10:00:00Z'
};

const AISmartApprovalDemo = () => {
  const [selectedView, setSelectedView] = useState('document');
  const [showAIInsights, setShowAIInsights] = useState(false);

  const handleApprovalAction = (stepId, action, comment) => {
    console.log('Approval action:', { stepId, action, comment });
    // 这里可以处理实际的审批逻辑
  };

  const toggleAIInsights = () => {
    setShowAIInsights(!showAIInsights);
  };

  return (
    <div className="ai-smart-approval-demo">
      {/* 页面头部 */}
      <div className="demo-header">
        <div className="header-content">
          <div className="header-info">
            <h1>AI智能审批助手演示</h1>
            <p>体验基于人工智能的车型研发项目智能协作与审批建议功能</p>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <TrendingUp size={20} />
              <div className="stat-content">
                <span className="stat-value">85%</span>
                <span className="stat-label">审批效率提升</span>
              </div>
            </div>
            <div className="stat-item">
              <Clock size={20} />
              <div className="stat-content">
                <span className="stat-value">24h</span>
                <span className="stat-label">平均处理时间</span>
              </div>
            </div>
            <div className="stat-item">
              <Users size={20} />
              <div className="stat-content">
                <span className="stat-value">3</span>
                <span className="stat-label">协作成员</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="demo-content">
        {/* 侧边栏导航 */}
        <div className="sidebar">
          <div className="sidebar-section">
            <h3>视图切换</h3>
            <div className="view-options">
              <button 
                className={`view-option ${selectedView === 'document' ? 'active' : ''}`}
                onClick={() => setSelectedView('document')}
              >
                <FileText size={16} />
                文档概览
              </button>
              <button 
                className={`view-option ${selectedView === 'approval' ? 'active' : ''}`}
                onClick={() => setSelectedView('approval')}
              >
                <CheckCircle size={16} />
                审批流程
              </button>
              <button 
                className={`view-option ${selectedView === 'insights' ? 'active' : ''}`}
                onClick={() => setSelectedView('insights')}
              >
                <TrendingUp size={16} />
                AI洞察
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>文档信息</h3>
            <div className="document-meta">
              <div className="meta-item">
                <span className="meta-label">文档类型:</span>
                <span className="meta-value">{mockDocumentData.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">创建时间:</span>
                <span className="meta-value">
                  {new Date(mockDocumentData.createTime).toLocaleDateString()}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">项目预算:</span>
                <span className="meta-value">¥{(mockDocumentData.metadata.budget / 100000000).toFixed(1)}亿元</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">开发周期:</span>
                <span className="meta-value">{mockDocumentData.metadata.duration}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">目标市场:</span>
                <span className="meta-value">{mockDocumentData.metadata.targetMarket}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">预计SOP:</span>
                <span className="meta-value">{mockDocumentData.metadata.expectedSOP}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>快速操作</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <Eye size={16} />
                预览文档
              </button>
              <button className="quick-action-btn">
                <MessageSquare size={16} />
                添加评论
              </button>
              <button 
                className="quick-action-btn ai-btn"
                onClick={toggleAIInsights}
              >
                <TrendingUp size={16} />
                AI分析
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容面板 */}
        <div className="main-panel">
          {selectedView === 'document' && (
            <div className="document-view">
              <div className="document-header">
                <h2>{mockDocumentData.title}</h2>
                <div className="document-actions">
                  <button className="action-btn secondary">
                    <Settings size={16} />
                    设置
                  </button>
                  <button className="action-btn primary">
                    <CheckCircle size={16} />
                    开始审批
                  </button>
                </div>
              </div>

              <div className="document-content">
                <div className="content-sections">
                  <h3>文档章节</h3>
                  <div className="sections-grid">
                    {mockDocumentData.sections.map((section) => (
                      <div key={section.id} className={`section-card ${section.status}`}>
                        <div className="section-header">
                          <h4>{section.title}</h4>
                          <span className={`status-badge ${section.status}`}>
                            {section.status === 'completed' && '已完成'}
                            {section.status === 'in_review' && '审核中'}
                            {section.status === 'pending' && '待处理'}
                          </span>
                        </div>
                        <div className="section-progress">
                          <div 
                            className="progress-bar"
                            style={{
                              width: section.status === 'completed' ? '100%' : 
                                     section.status === 'in_review' ? '60%' : '0%'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="content-summary">
                  <h3>项目摘要</h3>
                  <div className="summary-cards">
                    <div className="summary-card">
                      <div className="summary-icon">🚗</div>
                      <div className="summary-content">
                        <h4>车型定位</h4>
                        <p>{mockDocumentData.metadata.targetMarket}</p>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon">⚡</div>
                      <div className="summary-content">
                        <h4>产品类型</h4>
                        <p>{mockDocumentData.metadata.vehicleType.join(' + ')}</p>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon">�</div>
                      <div className="summary-content">
                        <h4>预计SOP</h4>
                        <p>{mockDocumentData.metadata.expectedSOP}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'approval' && (
            <div className="approval-view">
              <div className="approval-header">
                <h2>审批流程管理</h2>
                <div className="flow-status">
                  <span className="status-text">当前状态: 等待技术总监审批</span>
                  <div className="progress-indicator">
                    <div className="progress-step completed"></div>
                    <div className="progress-step active"></div>
                    <div className="progress-step"></div>
                  </div>
                </div>
              </div>

              <ApprovalWorkflow
                approval={mockApprovalFlow}
                currentUser={mockCurrentUser}
                onApprove={handleApprovalAction}
                onReject={handleApprovalAction}
                onAddComment={handleApprovalAction}
              />
            </div>
          )}

          {selectedView === 'insights' && (
            <div className="insights-view">
              <div className="insights-header">
                <h2>AI协作洞察</h2>
                <p>基于文档内容和历史数据的智能分析</p>
              </div>

              <div className="insights-content">
                <div className="insight-cards">
                  <div className="insight-card prediction">
                    <div className="card-icon">🎯</div>
                    <div className="card-content">
                      <h3>审批预测</h3>
                      <div className="prediction-score">
                        <span className="score">87%</span>
                        <span className="score-label">通过概率</span>
                      </div>
                      <p>基于相似文档分析，预计24小时内通过审批</p>
                    </div>
                  </div>

                  <div className="insight-card risks">
                    <div className="card-icon">⚠️</div>
                    <div className="card-content">
                      <h3>风险识别</h3>
                      <div className="risk-summary">
                        <span className="risk-count">2个</span>
                        <span className="risk-label">潜在风险</span>
                      </div>
                      <ul className="risk-list">
                        <li>项目预算较同类车型高20%</li>
                        <li>技术方案需进一步验证</li>
                      </ul>
                    </div>
                  </div>

                  <div className="insight-card suggestions">
                    <div className="card-icon">💡</div>
                    <div className="card-content">
                      <h3>优化建议</h3>
                      <div className="suggestions-count">
                        <span className="count">4条</span>
                        <span className="count-label">智能建议</span>
                      </div>
                      <p>AI为您生成了个性化的审批意见和流程优化建议</p>
                    </div>
                  </div>

                  <div className="insight-card collaboration">
                    <div className="card-icon">👥</div>
                    <div className="card-content">
                      <h3>协作效率</h3>
                      <div className="efficiency-score">
                        <span className="score">92%</span>
                        <span className="score-label">团队效率</span>
                      </div>
                      <p>当前协作效率良好，平均响应时间2.3小时</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI助手触发器 */}
      <AIAssistantTrigger
        documentId={mockDocumentData.id}
        documentData={mockDocumentData}
        currentUser={mockCurrentUser}
        className="floating"
      />

      {/* 功能说明弹窗 */}
      {showAIInsights && (
        <div className="feature-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>AI智能审批功能说明</h3>
              <button className="close-btn" onClick={() => setShowAIInsights(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <div className="feature-desc">
                    <h4>智能预测</h4>
                    <p>基于历史数据预测审批结果和处理时间</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚠️</div>
                  <div className="feature-desc">
                    <h4>风险识别</h4>
                    <p>自动识别文档中的潜在风险点</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💬</div>
                  <div className="feature-desc">
                    <h4>意见生成</h4>
                    <p>智能生成个性化的审批意见模板</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <div className="feature-desc">
                    <h4>相似参考</h4>
                    <p>提供相似文档的审批历史参考</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowAIInsights(false)}></div>
        </div>
      )}
    </div>
  );
};

export default AISmartApprovalDemo;
