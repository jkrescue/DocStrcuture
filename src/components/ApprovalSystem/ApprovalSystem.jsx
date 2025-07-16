import React, { useState, useRef } from 'react';
import { 
  CheckCircle, XCircle, Clock, User, FileText, 
  ChevronRight, AlertTriangle, Send, MessageSquare,
  Users, Calendar, ArrowRight, RotateCcw, Eye
} from 'lucide-react';
import './ApprovalSystem.css';

// 审批状态枚举
export const ApprovalStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

// 审批步骤组件
export const ApprovalStep = ({ 
  step, 
  isActive, 
  isCompleted, 
  currentUser,
  onApprove,
  onReject,
  onAddComment 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [comment, setComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const canApprove = step.assignee.id === currentUser.id && step.status === ApprovalStatus.PENDING;

  const handleApprove = () => {
    onApprove(step.id, comment);
    setComment('');
    setShowActions(false);
    setShowCommentForm(false);
  };

  const handleReject = () => {
    onReject(step.id, comment);
    setComment('');
    setShowActions(false);
    setShowCommentForm(false);
  };

  const getStatusIcon = () => {
    switch (step.status) {
      case ApprovalStatus.APPROVED:
        return <CheckCircle className="status-icon approved" size={20} />;
      case ApprovalStatus.REJECTED:
        return <XCircle className="status-icon rejected" size={20} />;
      case ApprovalStatus.CANCELLED:
        return <RotateCcw className="status-icon cancelled" size={20} />;
      default:
        return <Clock className="status-icon pending" size={20} />;
    }
  };

  const getStatusText = () => {
    switch (step.status) {
      case ApprovalStatus.APPROVED:
        return '已通过';
      case ApprovalStatus.REJECTED:
        return '已拒绝';
      case ApprovalStatus.CANCELLED:
        return '已取消';
      default:
        return isActive ? '待审批' : '等待中';
    }
  };

  return (
    <div className={`approval-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
      <div className="step-indicator">
        {getStatusIcon()}
        <div className="step-line" />
      </div>
      
      <div className="step-content">
        <div className="step-header">
          <div className="assignee-info">
            <div className="assignee-avatar">{step.assignee.avatar}</div>
            <div className="assignee-details">
              <div className="assignee-name">{step.assignee.name}</div>
              <div className="assignee-role">{step.assignee.role}</div>
            </div>
          </div>
          
          <div className="step-status">
            <span className={`status-badge ${step.status}`}>
              {getStatusText()}
            </span>
            {step.completedAt && (
              <div className="completion-time">
                <Calendar size={12} />
                {new Date(step.completedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="step-description">
          <h4>{step.title}</h4>
          {step.description && <p>{step.description}</p>}
        </div>

        {step.comment && (
          <div className="step-comment">
            <MessageSquare size={14} />
            <span>审批意见：{step.comment}</span>
          </div>
        )}

        {canApprove && (
          <div className="step-actions">
            {!showActions ? (
              <button 
                className="show-actions-btn"
                onClick={() => setShowActions(true)}
              >
                开始审批
              </button>
            ) : (
              <div className="approval-actions">
                <div className="action-buttons">
                  <button 
                    className="approve-btn"
                    onClick={showCommentForm ? handleApprove : () => setShowCommentForm(true)}
                  >
                    <CheckCircle size={16} />
                    通过
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={showCommentForm ? handleReject : () => setShowCommentForm(true)}
                  >
                    <XCircle size={16} />
                    拒绝
                  </button>
                </div>
                
                {showCommentForm && (
                  <div className="comment-form">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="请添加审批意见（可选）..."
                      className="comment-textarea"
                      rows={3}
                    />
                  </div>
                )}
                
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowActions(false);
                    setShowCommentForm(false);
                    setComment('');
                  }}
                >
                  取消
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 审批流程组件
export const ApprovalWorkflow = ({ 
  workflow, 
  currentUser,
  onApprove,
  onReject,
  onCancel,
  onRestart
}) => {
  const { steps, status, createdBy, createdAt, title, description } = workflow;
  
  const currentStepIndex = steps.findIndex(step => step.status === ApprovalStatus.PENDING);
  const completedSteps = steps.filter(step => 
    step.status === ApprovalStatus.APPROVED || step.status === ApprovalStatus.REJECTED
  ).length;

  const getWorkflowStatus = () => {
    if (steps.every(step => step.status === ApprovalStatus.APPROVED)) {
      return { status: 'approved', text: '审批通过', color: 'green' };
    }
    if (steps.some(step => step.status === ApprovalStatus.REJECTED)) {
      return { status: 'rejected', text: '审批拒绝', color: 'red' };
    }
    if (status === 'cancelled') {
      return { status: 'cancelled', text: '已取消', color: 'gray' };
    }
    return { status: 'pending', text: '审批中', color: 'blue' };
  };

  const workflowStatus = getWorkflowStatus();

  return (
    <div className="approval-workflow">
      <div className="workflow-header">
        <div className="workflow-info">
          <h3>
            <FileText size={20} />
            {title}
          </h3>
          <p className="workflow-description">{description}</p>
          
          <div className="workflow-meta">
            <div className="creator-info">
              <User size={14} />
              <span>发起人：{createdBy.name}</span>
            </div>
            <div className="creation-time">
              <Calendar size={14} />
              <span>{new Date(createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="workflow-status">
          <div className={`status-indicator ${workflowStatus.status}`}>
            {workflowStatus.status === 'approved' && <CheckCircle size={20} />}
            {workflowStatus.status === 'rejected' && <XCircle size={20} />}
            {workflowStatus.status === 'pending' && <Clock size={20} />}
            {workflowStatus.status === 'cancelled' && <RotateCcw size={20} />}
            <span>{workflowStatus.text}</span>
          </div>
          
          <div className="progress-info">
            {completedSteps} / {steps.length} 已完成
          </div>
        </div>
      </div>

      <div className="workflow-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(completedSteps / steps.length) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          进度：{Math.round((completedSteps / steps.length) * 100)}%
        </div>
      </div>

      <div className="workflow-steps">
        {steps.map((step, index) => (
          <ApprovalStep
            key={step.id}
            step={step}
            isActive={index === currentStepIndex}
            isCompleted={index < currentStepIndex || step.status === ApprovalStatus.APPROVED}
            currentUser={currentUser}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </div>

      <div className="workflow-actions">
        {(currentUser.id === createdBy.id || currentUser.role === 'admin') && (
          <>
            {workflowStatus.status === 'pending' && (
              <button 
                className="cancel-workflow-btn"
                onClick={() => onCancel(workflow.id)}
              >
                <XCircle size={16} />
                取消审批
              </button>
            )}
            
            {(workflowStatus.status === 'rejected' || workflowStatus.status === 'cancelled') && (
              <button 
                className="restart-workflow-btn"
                onClick={() => onRestart(workflow.id)}
              >
                <RotateCcw size={16} />
                重新发起
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// 审批历史组件
export const ApprovalHistory = ({ approvals = [] }) => {
  if (approvals.length === 0) {
    return (
      <div className="approval-history empty">
        <FileText size={48} />
        <h3>暂无审批记录</h3>
        <p>该文档还没有发起过审批流程</p>
      </div>
    );
  }

  return (
    <div className="approval-history">
      <h3>
        <FileText size={20} />
        审批历史 ({approvals.length})
      </h3>
      
      <div className="history-list">
        {approvals.map(approval => (
          <div key={approval.id} className="history-item">
            <div className="history-header">
              <div className="approval-title">{approval.title}</div>
              <div className="approval-date">
                {new Date(approval.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="history-status">
              <div className={`status-badge ${approval.finalStatus}`}>
                {approval.finalStatus === 'approved' && <CheckCircle size={14} />}
                {approval.finalStatus === 'rejected' && <XCircle size={14} />}
                {approval.finalStatus === 'cancelled' && <RotateCcw size={14} />}
                <span>
                  {approval.finalStatus === 'approved' && '已通过'}
                  {approval.finalStatus === 'rejected' && '已拒绝'}
                  {approval.finalStatus === 'cancelled' && '已取消'}
                </span>
              </div>
              
              <div className="approver-list">
                <Users size={14} />
                <span>
                  参与人：{approval.participants.map(p => p.name).join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 发起审批对话框
export const StartApprovalDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  availableApprovers = [],
  documentTitle = ''
}) => {
  const [title, setTitle] = useState(`${documentTitle} - 审批申请`);
  const [description, setDescription] = useState('');
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  const [workflowType, setWorkflowType] = useState('sequential'); // sequential | parallel

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedApprovers.length === 0) {
      alert('请至少选择一位审批人');
      return;
    }

    onSubmit({
      title,
      description,
      approvers: selectedApprovers,
      workflowType
    });

    // 重置表单
    setTitle(`${documentTitle} - 审批申请`);
    setDescription('');
    setSelectedApprovers([]);
    onClose();
  };

  const toggleApprover = (approver) => {
    setSelectedApprovers(prev => {
      const exists = prev.find(a => a.id === approver.id);
      if (exists) {
        return prev.filter(a => a.id !== approver.id);
      }
      return [...prev, approver];
    });
  };

  if (!isOpen) return null;

  return (
    <div className="approval-dialog-overlay">
      <div className="approval-dialog">
        <div className="dialog-header">
          <h3>发起审批流程</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="approval-form">
          <div className="form-group">
            <label>审批标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>审批说明</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请说明此次审批的目的和要求..."
              className="form-textarea"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>审批方式</label>
            <div className="workflow-type-options">
              <label className="radio-option">
                <input
                  type="radio"
                  value="sequential"
                  checked={workflowType === 'sequential'}
                  onChange={(e) => setWorkflowType(e.target.value)}
                />
                <span>顺序审批</span>
                <small>审批人按顺序逐一审批</small>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="parallel"
                  checked={workflowType === 'parallel'}
                  onChange={(e) => setWorkflowType(e.target.value)}
                />
                <span>并行审批</span>
                <small>所有审批人同时审批</small>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>选择审批人 ({selectedApprovers.length})</label>
            <div className="approver-list">
              {availableApprovers.map(approver => (
                <div
                  key={approver.id}
                  className={`approver-option ${selectedApprovers.find(a => a.id === approver.id) ? 'selected' : ''}`}
                  onClick={() => toggleApprover(approver)}
                >
                  <div className="approver-avatar">{approver.avatar}</div>
                  <div className="approver-info">
                    <div className="approver-name">{approver.name}</div>
                    <div className="approver-role">{approver.role}</div>
                  </div>
                  {selectedApprovers.find(a => a.id === approver.id) && (
                    <CheckCircle className="selected-icon" size={16} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="dialog-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              取消
            </button>
            <button type="submit" className="submit-btn">
              <Send size={16} />
              发起审批
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
