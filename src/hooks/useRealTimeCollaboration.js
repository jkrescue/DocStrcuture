import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// WebSocket协作管理器
class CollaborationManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.documentId = null;
    this.currentUser = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // 连接到协作服务器
  connect(documentId, user) {
    if (this.socket && this.isConnected) {
      this.disconnect();
    }

    this.documentId = documentId;
    this.currentUser = user;

    // 在生产环境中，这里应该是实际的WebSocket服务器地址
    this.socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3002', {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000
    });

    this.setupEventHandlers();
    this.joinDocument(documentId);
  }

  // 设置事件处理器
  setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('Connected to collaboration server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('collaboration:connected', { user: this.currentUser });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from collaboration server:', reason);
      this.isConnected = false;
      this.emit('collaboration:disconnected', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      this.emit('collaboration:error', { error, attempts: this.reconnectAttempts });
    });

    // 用户相关事件
    this.socket.on('user:joined', (data) => {
      this.emit('user:joined', data);
    });

    this.socket.on('user:left', (data) => {
      this.emit('user:left', data);
    });

    this.socket.on('user:online', (data) => {
      this.emit('user:online', data);
    });

    this.socket.on('user:typing', (data) => {
      this.emit('user:typing', data);
    });

    // 评论相关事件
    this.socket.on('comment:added', (data) => {
      this.emit('comment:added', data);
    });

    this.socket.on('comment:updated', (data) => {
      this.emit('comment:updated', data);
    });

    this.socket.on('comment:deleted', (data) => {
      this.emit('comment:deleted', data);
    });

    this.socket.on('comment:resolved', (data) => {
      this.emit('comment:resolved', data);
    });

    // 审批相关事件
    this.socket.on('approval:created', (data) => {
      this.emit('approval:created', data);
    });

    this.socket.on('approval:updated', (data) => {
      this.emit('approval:updated', data);
    });

    this.socket.on('approval:completed', (data) => {
      this.emit('approval:completed', data);
    });

    // 文档编辑事件
    this.socket.on('document:changed', (data) => {
      this.emit('document:changed', data);
    });

    this.socket.on('cursor:moved', (data) => {
      this.emit('cursor:moved', data);
    });
  }

  // 加入文档协作房间
  joinDocument(documentId) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('document:join', {
      documentId,
      user: this.currentUser,
      timestamp: Date.now()
    });
  }

  // 离开文档协作房间
  leaveDocument() {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('document:leave', {
      documentId: this.documentId,
      user: this.currentUser,
      timestamp: Date.now()
    });
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.leaveDocument();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 发送评论事件
  sendComment(comment) {
    if (!this.socket || !this.isConnected) return false;

    this.socket.emit('comment:add', {
      documentId: this.documentId,
      comment: {
        ...comment,
        author: this.currentUser,
        timestamp: Date.now()
      }
    });
    return true;
  }

  // 更新评论
  updateComment(commentId, updates) {
    if (!this.socket || !this.isConnected) return false;

    this.socket.emit('comment:update', {
      documentId: this.documentId,
      commentId,
      updates,
      user: this.currentUser,
      timestamp: Date.now()
    });
    return true;
  }

  // 删除评论
  deleteComment(commentId) {
    if (!this.socket || !this.isConnected) return false;

    this.socket.emit('comment:delete', {
      documentId: this.documentId,
      commentId,
      user: this.currentUser,
      timestamp: Date.now()
    });
    return true;
  }

  // 解决评论
  resolveComment(commentId) {
    if (!this.socket || !this.isConnected) return false;

    this.socket.emit('comment:resolve', {
      documentId: this.documentId,
      commentId,
      user: this.currentUser,
      timestamp: Date.now()
    });
    return true;
  }

  // 发送正在输入状态
  sendTypingStatus(isTyping, location = null) {
    if (!this.socket || !this.isConnected) return false;

    this.socket.emit('user:typing', {
      documentId: this.documentId,
      user: this.currentUser,
      isTyping,
      location,
      timestamp: Date.now()
    });
    return true;
  }

  // 发送光标位置
  sendCursorPosition(position) {
    if (!this.socket || !this.isConnected) return false;

    this.socket.emit('cursor:move', {
      documentId: this.documentId,
      user: this.currentUser,
      position,
      timestamp: Date.now()
    });
    return true;
  }

  // 发送审批事件
  sendApprovalAction(approvalId, action, comment = '') {
    if (!this.socket || !this.isConnected) return false;

    this.socket.emit('approval:action', {
      documentId: this.documentId,
      approvalId,
      action, // 'approve', 'reject', 'request_changes'
      comment,
      user: this.currentUser,
      timestamp: Date.now()
    });
    return true;
  }

  // 事件监听器管理
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // 获取连接状态
  getStatus() {
    return {
      isConnected: this.isConnected,
      documentId: this.documentId,
      currentUser: this.currentUser,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// 创建全局协作管理器实例
const collaborationManager = new CollaborationManager();

// React Hook for real-time collaboration
export const useRealTimeCollaboration = (documentId, currentUser) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connectionError, setConnectionError] = useState(null);
  const managerRef = useRef(collaborationManager);

  useEffect(() => {
    if (!documentId || !currentUser) return;

    const manager = managerRef.current;

    // 设置事件监听器
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
    };

    const handleError = ({ error, attempts }) => {
      setConnectionError(`连接失败 (尝试 ${attempts}/${manager.maxReconnectAttempts}): ${error.message}`);
    };

    const handleUserJoined = ({ user }) => {
      setOnlineUsers(prev => {
        if (prev.some(u => u.id === user.id)) return prev;
        return [...prev, user];
      });
    };

    const handleUserLeft = ({ user }) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
      setTypingUsers(prev => prev.filter(u => u.id !== user.id));
    };

    const handleUserTyping = ({ user, isTyping }) => {
      if (user.id === currentUser.id) return; // 忽略自己的输入状态
      
      setTypingUsers(prev => {
        const filtered = prev.filter(u => u.id !== user.id);
        return isTyping ? [...filtered, user] : filtered;
      });
    };

    // 注册事件监听器
    manager.on('collaboration:connected', handleConnected);
    manager.on('collaboration:disconnected', handleDisconnected);
    manager.on('collaboration:error', handleError);
    manager.on('user:joined', handleUserJoined);
    manager.on('user:left', handleUserLeft);
    manager.on('user:typing', handleUserTyping);

    // 连接到协作服务器
    manager.connect(documentId, currentUser);

    // 清理函数
    return () => {
      manager.off('collaboration:connected', handleConnected);
      manager.off('collaboration:disconnected', handleDisconnected);
      manager.off('collaboration:error', handleError);
      manager.off('user:joined', handleUserJoined);
      manager.off('user:left', handleUserLeft);
      manager.off('user:typing', handleUserTyping);
    };
  }, [documentId, currentUser]);

  // 组件卸载时断开连接
  useEffect(() => {
    return () => {
      managerRef.current.disconnect();
    };
  }, []);

  return {
    isConnected,
    onlineUsers,
    typingUsers,
    connectionError,
    collaborationManager: managerRef.current
  };
};

// React Hook for real-time comments
export const useRealTimeComments = (documentId, initialComments = []) => {
  const [comments, setComments] = useState(initialComments);
  const managerRef = useRef(collaborationManager);

  useEffect(() => {
    const manager = managerRef.current;

    const handleCommentAdded = ({ comment }) => {
      setComments(prev => {
        // 避免重复添加
        if (prev.some(c => c.id === comment.id)) return prev;
        return [comment, ...prev];
      });
    };

    const handleCommentUpdated = ({ commentId, updates }) => {
      setComments(prev => prev.map(comment =>
        comment.id === commentId 
          ? { ...comment, ...updates, updatedAt: new Date().toISOString() }
          : comment
      ));
    };

    const handleCommentDeleted = ({ commentId }) => {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    };

    const handleCommentResolved = ({ commentId }) => {
      setComments(prev => prev.map(comment =>
        comment.id === commentId 
          ? { ...comment, status: 'resolved', resolvedAt: new Date().toISOString() }
          : comment
      ));
    };

    // 注册事件监听器
    manager.on('comment:added', handleCommentAdded);
    manager.on('comment:updated', handleCommentUpdated);
    manager.on('comment:deleted', handleCommentDeleted);
    manager.on('comment:resolved', handleCommentResolved);

    return () => {
      manager.off('comment:added', handleCommentAdded);
      manager.off('comment:updated', handleCommentUpdated);
      manager.off('comment:deleted', handleCommentDeleted);
      manager.off('comment:resolved', handleCommentResolved);
    };
  }, [documentId]);

  const addComment = (comment) => {
    return managerRef.current.sendComment(comment);
  };

  const updateComment = (commentId, updates) => {
    return managerRef.current.updateComment(commentId, updates);
  };

  const deleteComment = (commentId) => {
    return managerRef.current.deleteComment(commentId);
  };

  const resolveComment = (commentId) => {
    return managerRef.current.resolveComment(commentId);
  };

  return {
    comments,
    addComment,
    updateComment,
    deleteComment,
    resolveComment
  };
};

export default collaborationManager;
