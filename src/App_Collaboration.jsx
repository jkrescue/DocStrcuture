import React, { useState, useEffect } from 'react';
import './App.css';

// 页面组件导入
import EditorDemo from './pages/EditorDemo.jsx';
import EditorDemoEnhanced from './pages/EditorDemo_Enhanced.jsx';

// 实时协作组件导入
import RealTimeCollaborationStatus from './components/RealTimeCollaboration/RealTimeCollaborationStatus.jsx';
import RealTimeCommentSystem from './components/RealTimeCollaboration/RealTimeCommentSystem.jsx';
import { useRealTimeCollaboration } from './hooks/useRealTimeCollaboration.js';

// 模拟用户数据（在实际应用中应该从认证系统获取）
const getCurrentUser = () => ({
  id: 'user_' + Math.random().toString(36).substr(2, 9),
  name: '当前用户',
  avatar: null,
  department: '产品部'
});

function App() {
  const [currentPage, setCurrentPage] = useState('EditorDemo');
  const [currentUser] = useState(getCurrentUser);
  const [currentDocumentId, setCurrentDocumentId] = useState('doc_main');

  // 实时协作hooks
  const {
    isConnected,
    onlineUsers,
    typingUsers,
    connectionError,
    activities,
    connect,
    disconnect,
    joinDocument,
    leaveDocument,
    addComment,
    replyComment,
    likeComment,
    markCommentAsRead,
    comments
  } = useRealTimeCollaboration();

  // 页面切换时更新文档ID
  useEffect(() => {
    const documentMapping = {
      'EditorDemo': 'doc_editor_demo',
      'EditorDemoEnhanced': 'doc_editor_enhanced'
    };
    
    const newDocumentId = documentMapping[currentPage] || 'doc_main';
    if (newDocumentId !== currentDocumentId) {
      if (currentDocumentId) {
        leaveDocument(currentDocumentId);
      }
      setCurrentDocumentId(newDocumentId);
      joinDocument(newDocumentId);
    }
  }, [currentPage, currentDocumentId, joinDocument, leaveDocument]);

  // 组件加载时连接协作服务
  useEffect(() => {
    connect(currentUser);
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect, currentUser]);

  // 页面组件映射
  const pageComponents = {
    EditorDemo: <EditorDemo />,
    EditorDemoEnhanced: <EditorDemoEnhanced />
  };

  const currentComponent = pageComponents[currentPage] || pageComponents.EditorDemo;

  // 评论系统处理函数
  const handleAddComment = async (content) => {
    try {
      await addComment(currentDocumentId, content);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleReplyComment = async (parentId, content) => {
    try {
      await replyComment(currentDocumentId, parentId, content);
    } catch (error) {
      console.error('Failed to reply comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(currentDocumentId, commentId);
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleMarkAsRead = async (commentId) => {
    try {
      await markCommentAsRead(currentDocumentId, commentId);
    } catch (error) {
      console.error('Failed to mark comment as read:', error);
    }
  };

  return (
    <div className="App">
      {/* 实时协作状态指示器 */}
      <RealTimeCollaborationStatus
        isConnected={isConnected}
        onlineUsers={onlineUsers}
        typingUsers={typingUsers}
        currentUser={currentUser}
        connectionError={connectionError}
        activities={activities}
      />

      {/* 主要内容区域 */}
      <div style={{ 
        minHeight: '100vh',
        paddingRight: isConnected ? '0' : '0' // 为评论面板预留空间
      }}>
        {currentComponent}
      </div>

      {/* 实时评论系统 */}
      <RealTimeCommentSystem
        documentId={currentDocumentId}
        comments={comments}
        currentUser={currentUser}
        onAddComment={handleAddComment}
        onReplyComment={handleReplyComment}
        onLikeComment={handleLikeComment}
        onEditComment={(commentId) => console.log('Edit comment:', commentId)}
        onDeleteComment={(commentId) => console.log('Delete comment:', commentId)}
        onMarkAsRead={handleMarkAsRead}
        typingUsers={typingUsers}
        isConnected={isConnected}
      />

      {/* 页面切换按钮 */}
      <div className="page-switcher" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 900
      }}>
        <button
          onClick={() => setCurrentPage('EditorDemo')}
          className={`page-switch-btn ${currentPage === 'EditorDemo' ? 'active' : ''}`}
          style={{
            padding: '12px 16px',
            background: currentPage === 'EditorDemo' ? '#4ECDC4' : 'white',
            color: currentPage === 'EditorDemo' ? 'white' : '#333',
            border: '1px solid #4ECDC4',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            minWidth: '120px'
          }}
        >
          基础编辑器
        </button>
        
        <button
          onClick={() => setCurrentPage('EditorDemoEnhanced')}
          className={`page-switch-btn ${currentPage === 'EditorDemoEnhanced' ? 'active' : ''}`}
          style={{
            padding: '12px 16px',
            background: currentPage === 'EditorDemoEnhanced' ? '#4ECDC4' : 'white',
            color: currentPage === 'EditorDemoEnhanced' ? 'white' : '#333',
            border: '1px solid #4ECDC4',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            minWidth: '120px'
          }}
        >
          增强编辑器
        </button>
      </div>

      {/* 协作状态调试信息（开发环境） */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          maxWidth: '300px',
          zIndex: 2000
        }}>
          <div><strong>协作调试信息:</strong></div>
          <div>连接状态: {isConnected ? '✅ 已连接' : '❌ 已断开'}</div>
          <div>在线用户: {onlineUsers.length}</div>
          <div>当前文档: {currentDocumentId}</div>
          <div>评论数量: {comments.length}</div>
          <div>输入用户: {typingUsers.length}</div>
          {connectionError && (
            <div style={{ color: '#ff6b6b' }}>错误: {connectionError}</div>
          )}
        </div>
      )}

      {/* 样式定义 */}
      <style>{`
        .page-switch-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        .page-switch-btn.active {
          transform: scale(1.05);
        }

        .page-switch-btn:active {
          transform: translateY(0);
        }

        /* 响应式调整 */
        @media (max-width: 768px) {
          .page-switcher {
            bottom: 10px;
            right: 10px;
            flex-direction: row;
            flex-wrap: wrap;
          }
          
          .page-switch-btn {
            min-width: 100px;
            padding: 10px 12px;
            font-size: 13px;
          }
        }

        /* 为协作功能留出空间 */
        .App {
          position: relative;
          min-height: 100vh;
        }

        /* 确保主内容不被协作组件遮挡 */
        @media (min-width: 1200px) {
          .App > div:first-child {
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
