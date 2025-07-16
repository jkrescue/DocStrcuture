import React, { useState } from 'react';
import { X, MessageCircle, FileCheck, Bell } from 'lucide-react';

// 简化的协作面板，用于调试
export const SimpleCollaborationPanel = ({ 
  documentId,
  documentTitle = '文档',
  currentUser,
  isOpen = false,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('comments');

  console.log('SimpleCollaborationPanel props:', { documentId, documentTitle, currentUser, isOpen });

  if (!isOpen) {
    console.log('Panel not open, returning null');
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.3)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 1500
    }}>
      <div style={{
        width: '500px',
        height: '100%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.15)'
      }}>
        {/* 头部 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            color: '#111827',
            fontSize: '18px'
          }}>
            <MessageCircle size={20} />
            <span>协作面板</span>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderRadius: '6px',
              color: '#6b7280'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 标签页 */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          background: 'white'
        }}>
          <button
            onClick={() => setActiveTab('comments')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'comments' ? '#f0fdfc' : 'none',
              cursor: 'pointer',
              color: activeTab === 'comments' ? '#4ECDC4' : '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              borderBottom: activeTab === 'comments' ? '2px solid #4ECDC4' : 'none'
            }}
          >
            <MessageCircle size={16} />
            <span>评论</span>
          </button>
          
          <button
            onClick={() => setActiveTab('approval')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'approval' ? '#f0fdfc' : 'none',
              cursor: 'pointer',
              color: activeTab === 'approval' ? '#4ECDC4' : '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              borderBottom: activeTab === 'approval' ? '2px solid #4ECDC4' : 'none'
            }}
          >
            <FileCheck size={16} />
            <span>审批</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'history' ? '#f0fdfc' : 'none',
              cursor: 'pointer',
              color: activeTab === 'history' ? '#4ECDC4' : '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              borderBottom: activeTab === 'history' ? '2px solid #4ECDC4' : 'none'
            }}
          >
            <Bell size={16} />
            <span>历史</span>
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px'
        }}>
          {activeTab === 'comments' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: '#111827' }}>文档评论</h3>
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <MessageCircle size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>暂无评论</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>开始添加评论来协作讨论文档内容</p>
              </div>
            </div>
          )}

          {activeTab === 'approval' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: '#111827' }}>审批流程</h3>
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <FileCheck size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>暂无审批流程</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>点击发起审批开始流程</p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', color: '#111827' }}>协作历史</h3>
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <Bell size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>暂无历史记录</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>协作活动将在此处显示</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCollaborationPanel;
