const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// 配置 CORS
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000", "http://127.0.0.1:3001"],
  credentials: true
}));

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3000", "http://127.0.0.1:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 存储在线用户和文档状态
const onlineUsers = new Map();
const documentSessions = new Map();
const typingUsers = new Map();
const comments = new Map();
const notifications = new Map();

// 用户连接管理
class CollaborationManager {
  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.rooms = new Map();
  }

  // 用户加入协作
  addUser(socketId, userInfo) {
    const user = {
      id: userInfo.id || uuidv4(),
      socketId,
      name: userInfo.name || '匿名用户',
      avatar: userInfo.avatar || null,
      department: userInfo.department || null,
      joinedAt: new Date(),
      lastActivity: new Date()
    };
    
    this.users.set(socketId, user);
    onlineUsers.set(user.id, user);
    
    return user;
  }

  // 用户离开协作
  removeUser(socketId) {
    const user = this.users.get(socketId);
    if (user) {
      this.users.delete(socketId);
      onlineUsers.delete(user.id);
      
      // 清理输入状态
      typingUsers.delete(user.id);
      
      return user;
    }
    return null;
  }

  // 加入文档协作
  joinDocument(socketId, documentId) {
    const user = this.users.get(socketId);
    if (!user) return null;

    // 创建或获取文档会话
    if (!documentSessions.has(documentId)) {
      documentSessions.set(documentId, {
        id: documentId,
        users: new Set(),
        comments: [],
        activities: [],
        createdAt: new Date()
      });
    }

    const session = documentSessions.get(documentId);
    session.users.add(user.id);
    user.currentDocument = documentId;

    return session;
  }

  // 离开文档协作
  leaveDocument(socketId, documentId) {
    const user = this.users.get(socketId);
    if (!user) return;

    const session = documentSessions.get(documentId);
    if (session) {
      session.users.delete(user.id);
      if (session.users.size === 0) {
        // 如果没有用户，保留会话30分钟
        setTimeout(() => {
          if (session.users.size === 0) {
            documentSessions.delete(documentId);
          }
        }, 30 * 60 * 1000);
      }
    }

    user.currentDocument = null;
  }

  // 获取文档的在线用户
  getDocumentUsers(documentId) {
    const session = documentSessions.get(documentId);
    if (!session) return [];

    return Array.from(session.users).map(userId => 
      Array.from(onlineUsers.values()).find(user => user.id === userId)
    ).filter(Boolean);
  }

  // 更新用户活动时间
  updateUserActivity(socketId) {
    const user = this.users.get(socketId);
    if (user) {
      user.lastActivity = new Date();
    }
  }
}

const manager = new CollaborationManager();

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log(`新用户连接: ${socket.id}`);

  // 用户加入协作
  socket.on('join_collaboration', (userInfo) => {
    const user = manager.addUser(socket.id, userInfo);
    
    socket.emit('collaboration_joined', {
      user,
      onlineUsers: Array.from(onlineUsers.values())
    });

    // 通知其他用户有新用户加入
    socket.broadcast.emit('user_joined', user);

    console.log(`用户 ${user.name} 加入协作`);
  });

  // 加入文档协作
  socket.on('join_document', (data) => {
    const { documentId } = data;
    const session = manager.joinDocument(socket.id, documentId);
    
    if (session) {
      socket.join(`doc_${documentId}`);
      
      const documentUsers = manager.getDocumentUsers(documentId);
      
      socket.emit('document_joined', {
        documentId,
        users: documentUsers,
        comments: session.comments,
        activities: session.activities
      });

      // 通知文档中的其他用户
      socket.to(`doc_${documentId}`).emit('user_joined_document', {
        documentId,
        user: manager.users.get(socket.id),
        users: documentUsers
      });

      console.log(`用户加入文档 ${documentId}`);
    }
  });

  // 离开文档协作
  socket.on('leave_document', (data) => {
    const { documentId } = data;
    const user = manager.users.get(socket.id);
    
    if (user) {
      socket.leave(`doc_${documentId}`);
      manager.leaveDocument(socket.id, documentId);
      
      socket.to(`doc_${documentId}`).emit('user_left_document', {
        documentId,
        userId: user.id,
        users: manager.getDocumentUsers(documentId)
      });

      console.log(`用户离开文档 ${documentId}`);
    }
  });

  // 实时评论
  socket.on('add_comment', (data) => {
    const { documentId, content, parentId = null } = data;
    const user = manager.users.get(socket.id);
    
    if (user && documentId) {
      const comment = {
        id: uuidv4(),
        documentId,
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        },
        content,
        parentId,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        readBy: [user.id],
        replies: [],
        isEdited: false
      };

      // 存储评论
      const session = documentSessions.get(documentId);
      if (session) {
        if (parentId) {
          // 查找父评论并添加回复
          const findAndAddReply = (comments) => {
            for (let c of comments) {
              if (c.id === parentId) {
                c.replies = c.replies || [];
                c.replies.push(comment);
                return true;
              }
              if (c.replies && findAndAddReply(c.replies)) {
                return true;
              }
            }
            return false;
          };
          findAndAddReply(session.comments);
        } else {
          session.comments.push(comment);
        }

        // 添加活动记录
        session.activities.push({
          id: uuidv4(),
          type: 'comment',
          userId: user.id,
          userName: user.name,
          documentId,
          commentId: comment.id,
          createdAt: new Date()
        });
      }

      // 实时广播给文档中的所有用户
      io.to(`doc_${documentId}`).emit('comment_added', comment);

      // 发送通知给其他用户
      socket.to(`doc_${documentId}`).emit('activity_notification', {
        type: 'comment',
        title: '新评论',
        message: `${user.name} 添加了新评论`,
        documentId,
        commentId: comment.id,
        timestamp: new Date()
      });

      console.log(`评论添加到文档 ${documentId}: ${content.substring(0, 50)}...`);
    }
  });

  // 点赞评论
  socket.on('like_comment', (data) => {
    const { documentId, commentId } = data;
    const user = manager.users.get(socket.id);
    
    if (user && documentId) {
      const session = documentSessions.get(documentId);
      if (session) {
        // 查找并更新评论点赞状态
        const findAndLikeComment = (comments) => {
          for (let comment of comments) {
            if (comment.id === commentId) {
              comment.likes = (comment.likes || 0) + 1;
              comment.likedBy = comment.likedBy || [];
              if (!comment.likedBy.includes(user.id)) {
                comment.likedBy.push(user.id);
              }
              return comment;
            }
            if (comment.replies) {
              const found = findAndLikeComment(comment.replies);
              if (found) return found;
            }
          }
          return null;
        };

        const updatedComment = findAndLikeComment(session.comments);
        if (updatedComment) {
          io.to(`doc_${documentId}`).emit('comment_liked', {
            commentId,
            likes: updatedComment.likes,
            likedBy: updatedComment.likedBy
          });
        }
      }
    }
  });

  // 标记评论为已读
  socket.on('mark_comment_read', (data) => {
    const { documentId, commentId } = data;
    const user = manager.users.get(socket.id);
    
    if (user && documentId) {
      const session = documentSessions.get(documentId);
      if (session) {
        const findAndMarkRead = (comments) => {
          for (let comment of comments) {
            if (comment.id === commentId) {
              comment.readBy = comment.readBy || [];
              if (!comment.readBy.includes(user.id)) {
                comment.readBy.push(user.id);
              }
              return comment;
            }
            if (comment.replies) {
              const found = findAndMarkRead(comment.replies);
              if (found) return found;
            }
          }
          return null;
        };

        const updatedComment = findAndMarkRead(session.comments);
        if (updatedComment) {
          io.to(`doc_${documentId}`).emit('comment_read', {
            commentId,
            readBy: updatedComment.readBy
          });
        }
      }
    }
  });

  // 输入状态
  socket.on('typing_start', (data) => {
    const { documentId } = data;
    const user = manager.users.get(socket.id);
    
    if (user && documentId) {
      typingUsers.set(user.id, {
        ...user,
        documentId,
        startedAt: new Date()
      });

      socket.to(`doc_${documentId}`).emit('user_typing', {
        userId: user.id,
        userName: user.name,
        documentId
      });

      // 30秒后自动清除输入状态
      setTimeout(() => {
        if (typingUsers.has(user.id)) {
          typingUsers.delete(user.id);
          socket.to(`doc_${documentId}`).emit('user_stopped_typing', {
            userId: user.id,
            documentId
          });
        }
      }, 30000);
    }
  });

  socket.on('typing_stop', (data) => {
    const { documentId } = data;
    const user = manager.users.get(socket.id);
    
    if (user) {
      typingUsers.delete(user.id);
      socket.to(`doc_${documentId}`).emit('user_stopped_typing', {
        userId: user.id,
        documentId
      });
    }
  });

  // 实时光标位置
  socket.on('cursor_position', (data) => {
    const { documentId, position, selection } = data;
    const user = manager.users.get(socket.id);
    
    if (user && documentId) {
      socket.to(`doc_${documentId}`).emit('user_cursor', {
        userId: user.id,
        userName: user.name,
        position,
        selection,
        documentId
      });
    }
  });

  // 文档版本同步
  socket.on('document_change', (data) => {
    const { documentId, changes, version } = data;
    const user = manager.users.get(socket.id);
    
    if (user && documentId) {
      manager.updateUserActivity(socket.id);
      
      socket.to(`doc_${documentId}`).emit('document_updated', {
        changes,
        version,
        userId: user.id,
        userName: user.name,
        timestamp: new Date()
      });
    }
  });

  // 审批流程
  socket.on('approval_request', (data) => {
    const { documentId, approvers, message } = data;
    const user = manager.users.get(socket.id);
    
    if (user && documentId) {
      const approvalRequest = {
        id: uuidv4(),
        documentId,
        requesterId: user.id,
        requesterName: user.name,
        approvers,
        message,
        status: 'pending',
        createdAt: new Date()
      };

      // 通知指定的审批人
      approvers.forEach(approverId => {
        const approverUser = Array.from(onlineUsers.values()).find(u => u.id === approverId);
        if (approverUser) {
          io.to(approverUser.socketId).emit('approval_notification', {
            type: 'approval_request',
            title: '审批请求',
            message: `${user.name} 请求您审批文档`,
            documentId,
            approvalId: approvalRequest.id,
            timestamp: new Date()
          });
        }
      });

      io.to(`doc_${documentId}`).emit('approval_requested', approvalRequest);
    }
  });

  // 处理审批
  socket.on('approval_response', (data) => {
    const { documentId, approvalId, action, comment } = data;
    const user = manager.users.get(socket.id);
    
    if (user && documentId) {
      const response = {
        approvalId,
        approverId: user.id,
        approverName: user.name,
        action, // 'approve' | 'reject'
        comment,
        timestamp: new Date()
      };

      io.to(`doc_${documentId}`).emit('approval_response', response);

      // 通知文档协作者
      socket.to(`doc_${documentId}`).emit('activity_notification', {
        type: 'approval',
        title: action === 'approve' ? '审批通过' : '审批拒绝',
        message: `${user.name} ${action === 'approve' ? '通过了' : '拒绝了'}审批请求`,
        documentId,
        approvalId,
        timestamp: new Date()
      });
    }
  });

  // 获取在线用户
  socket.on('get_online_users', () => {
    socket.emit('online_users', Array.from(onlineUsers.values()));
  });

  // 获取文档协作用户
  socket.on('get_document_users', (data) => {
    const { documentId } = data;
    const users = manager.getDocumentUsers(documentId);
    socket.emit('document_users', { documentId, users });
  });

  // 断开连接处理
  socket.on('disconnect', () => {
    const user = manager.removeUser(socket.id);
    if (user) {
      // 通知其他用户
      socket.broadcast.emit('user_left', {
        userId: user.id,
        userName: user.name
      });

      // 如果用户在文档中，通知文档协作者
      if (user.currentDocument) {
        socket.to(`doc_${user.currentDocument}`).emit('user_left_document', {
          documentId: user.currentDocument,
          userId: user.id,
          users: manager.getDocumentUsers(user.currentDocument)
        });
      }

      console.log(`用户 ${user.name} 断开连接`);
    }
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    onlineUsers: onlineUsers.size,
    activeSessions: documentSessions.size
  });
});

// 获取协作统计
app.get('/stats', (req, res) => {
  res.json({
    onlineUsers: Array.from(onlineUsers.values()).map(user => ({
      id: user.id,
      name: user.name,
      joinedAt: user.joinedAt,
      lastActivity: user.lastActivity,
      currentDocument: user.currentDocument
    })),
    documentSessions: Array.from(documentSessions.entries()).map(([id, session]) => ({
      documentId: id,
      userCount: session.users.size,
      commentCount: session.comments.length,
      activityCount: session.activities.length,
      createdAt: session.createdAt
    })),
    typingUsers: Array.from(typingUsers.values())
  });
});

// 清理过期数据的定时任务
setInterval(() => {
  const now = new Date();
  const timeout = 30 * 60 * 1000; // 30分钟超时

  // 清理非活跃用户
  for (const [userId, user] of onlineUsers) {
    if (now - user.lastActivity > timeout) {
      onlineUsers.delete(userId);
      console.log(`清理非活跃用户: ${user.name}`);
    }
  }

  // 清理输入状态
  for (const [userId, typingUser] of typingUsers) {
    if (now - typingUser.startedAt > 60000) { // 1分钟超时
      typingUsers.delete(userId);
    }
  }
}, 5 * 60 * 1000); // 每5分钟清理一次

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`📡 协作服务器启动成功，端口: ${PORT}`);
  console.log(`🌐 CORS 已配置支持: http://localhost:3001`);
  console.log(`📊 统计接口: http://localhost:${PORT}/stats`);
  console.log(`❤️  健康检查: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('正在关闭协作服务器...');
  server.close(() => {
    console.log('协作服务器已关闭');
    process.exit(0);
  });
});

module.exports = { app, server, io };
