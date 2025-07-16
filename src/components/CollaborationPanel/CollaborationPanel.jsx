import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, FileCheck, Users, Bell, 
  Settings, Filter, Search, Plus, X 
} from 'lucide-react';
import { DocumentComments, BlockComments, BlockCommentBubble } from '../CommentSystem/CommentSystem';
import { ApprovalWorkflow, ApprovalHistory, StartApprovalDialog } from '../ApprovalSystem/ApprovalSystem';
import './CollaborationPanel.css';

// 协作面板主组件
export const CollaborationPanel = ({ 
  documentId,
  documentTitle = '文档',
  currentUser,
  isOpen = false,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('comments'); // comments | approval | history
  const [comments, setComments] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [showStartApproval, setShowStartApproval] = useState(false);
  const [selectedBlockComments, setSelectedBlockComments] = useState(null);

  // 模拟数据
  const mockUsers = [
    { id: 1, name: '张三', avatar: '👨', department: '产品部', role: 'manager' },
    { id: 2, name: '李四', avatar: '👩', department: '技术部', role: 'developer' },
    { id: 3, name: '王五', avatar: '👨', department: '设计部', role: 'designer' },
    { id: 4, name: '赵六', avatar: '👩', department: '运营部', role: 'admin' }
  ];

  const mockComments = [
    {
      id: 'comment-1',
      content: '这个方案看起来不错，但是需要考虑技术实现的复杂度。',
      author: mockUsers[1],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      mentions: [],
      replies: [
        {
          id: 'reply-1',
          content: '确实，我们可以分阶段实施，先做MVP版本。',
          author: mockUsers[0],
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          parentId: 'comment-1'
        }
      ]
    },
    {
      id: 'comment-2',
      content: '界面设计需要和用户研究团队确认一下交互流程。',
      author: mockUsers[2],
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
      mentions: [mockUsers[0]]
    }
  ];

  const mockApproval = {
    id: 'approval-1',
    title: `${documentTitle} - 产品方案审批`,
    description: '请各位领导审阅产品设计方案，确认后可进入开发阶段。',
    createdBy: mockUsers[0],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    steps: [
      {
        id: 'step-1',
        title: '产品经理审批',
        description: '确认产品需求和设计方案',
        assignee: mockUsers[0],
        status: 'approved',
        comment: '方案整体可行，建议优化用户体验细节。',
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'step-2',
        title: '技术负责人审批',
        description: '评估技术实现方案和资源需求',
        assignee: mockUsers[1],
        status: 'pending'
      },
      {
        id: 'step-3',
        title: '项目总监审批',
        description: '最终确认项目启动',
        assignee: mockUsers[3],
        status: 'pending'
      }
    ]
  };

  useEffect(() => {
    // 模拟加载数据
    setComments(mockComments);
    setApprovals([mockApproval]);
    setApprovalHistory([
      {
        id: 'history-1',
        title: '需求文档审批',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        finalStatus: 'approved',
        participants: [mockUsers[0], mockUsers[1]]
      }
    ]);
  }, [documentId]);

  // 评论相关处理函数
  const handleAddComment = (commentData) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      ...commentData,
      author: currentUser,
      createdAt: new Date().toISOString(),
      status: 'open',
      replies: []
    };

    if (commentData.parentId) {
      setComments(prev => prev.map(comment => 
        comment.id === commentData.parentId 
          ? { ...comment, replies: [...(comment.replies || []), newComment] }
          : comment
      ));
    } else {
      setComments(prev => [newComment, ...prev]);
    }
  };

  const handleEditComment = (commentId, newContent) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, content: newContent }
        : comment
    ));
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const handleResolveComment = (commentId) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: 'resolved' }
        : comment
    ));
  };

  // 审批相关处理函数
  const handleStartApproval = (approvalData) => {
    const newApproval = {
      id: `approval-${Date.now()}`,
      ...approvalData,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
      status: 'pending',
      steps: approvalData.approvers.map((approver, index) => ({
        id: `step-${Date.now()}-${index}`,
        title: `${approver.role} 审批`,
        description: `由 ${approver.name} 进行审批`,
        assignee: approver,
        status: approvalData.workflowType === 'parallel' || index === 0 ? 'pending' : 'waiting'
      }))
    };

    setApprovals(prev => [newApproval, ...prev]);
  };

  const handleApproveStep = (stepId, comment) => {
    setApprovals(prev => prev.map(approval => ({
      ...approval,
      steps: approval.steps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              status: 'approved', 
              comment, 
              completedAt: new Date().toISOString() 
            }
          : step
      )
    })));
  };

  const handleRejectStep = (stepId, comment) => {
    setApprovals(prev => prev.map(approval => ({
      ...approval,
      steps: approval.steps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              status: 'rejected', 
              comment, 
              completedAt: new Date().toISOString() 
            }
          : step
      )
    })));
  };

  const getTabCounts = () => {
    const unreadComments = comments.filter(c => c.status === 'open').length;
    const pendingApprovals = approvals.filter(a => 
      a.steps.some(s => s.status === 'pending' && s.assignee.id === currentUser.id)
    ).length;

    return { comments: unreadComments, approvals: pendingApprovals };
  };

  const tabCounts = getTabCounts();

  if (!isOpen) return null;

  return (
    <div className="collaboration-panel-overlay">
      <div className="collaboration-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Users size={20} />
            <span>协作面板</span>
          </div>
          <button className="close-panel-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="panel-tabs">
          <button 
            className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            <MessageCircle size={16} />
            <span>评论</span>
            {tabCounts.comments > 0 && (
              <span className="tab-badge">{tabCounts.comments}</span>
            )}
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'approval' ? 'active' : ''}`}
            onClick={() => setActiveTab('approval')}
          >
            <FileCheck size={16} />
            <span>审批</span>
            {tabCounts.approvals > 0 && (
              <span className="tab-badge">{tabCounts.approvals}</span>
            )}
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Bell size={16} />
            <span>历史</span>
          </button>
        </div>

        <div className="panel-content">
          {activeTab === 'comments' && (
            <div className="comments-tab">
              <DocumentComments
                documentId={documentId}
                comments={comments}
                onAddComment={handleAddComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                onResolveComment={handleResolveComment}
                currentUser={currentUser}
                availableUsers={mockUsers}
              />
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="approval-tab">
              <div className="tab-header">
                <h3>审批流程</h3>
                <button 
                  className="start-approval-btn"
                  onClick={() => setShowStartApproval(true)}
                >
                  <Plus size={16} />
                  发起审批
                </button>
              </div>
              
              {approvals.length > 0 ? (
                approvals.map(approval => (
                  <ApprovalWorkflow
                    key={approval.id}
                    workflow={approval}
                    currentUser={currentUser}
                    onApprove={handleApproveStep}
                    onReject={handleRejectStep}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <FileCheck size={48} />
                  <h3>暂无审批流程</h3>
                  <p>点击上方按钮发起审批</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab">
              <ApprovalHistory approvals={approvalHistory} />
            </div>
          )}
        </div>

        {/* 发起审批对话框 */}
        <StartApprovalDialog
          isOpen={showStartApproval}
          onClose={() => setShowStartApproval(false)}
          onSubmit={handleStartApproval}
          availableApprovers={mockUsers}
          documentTitle={documentTitle}
        />

        {/* 块评论面板 */}
        {selectedBlockComments && (
          <BlockComments
            blockId={selectedBlockComments.blockId}
            blockType={selectedBlockComments.blockType}
            comments={selectedBlockComments.comments}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onResolveComment={handleResolveComment}
            onClose={() => setSelectedBlockComments(null)}
            currentUser={currentUser}
            availableUsers={mockUsers}
          />
        )}
      </div>
    </div>
  );
};

// 协作工具栏 - 集成到编辑器中
export const CollaborationToolbar = ({ 
  documentId,
  documentTitle,
  currentUser,
  onOpenPanel 
}) => {
  const [notifications, setNotifications] = useState(3); // 模拟通知数

  return (
    <div className="collaboration-toolbar">
      <button 
        className="collab-btn"
        onClick={onOpenPanel}
        title="打开协作面板"
      >
        <Users size={18} />
        <span>协作</span>
        {notifications > 0 && (
          <span className="notification-badge">{notifications}</span>
        )}
      </button>
    </div>
  );
};

export default CollaborationPanel;
