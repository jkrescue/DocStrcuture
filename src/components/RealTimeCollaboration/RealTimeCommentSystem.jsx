import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, Send, Reply, ThumbsUp, Eye, 
  User, Clock, MoreHorizontal, Edit, Trash2,
  CheckCircle, AlertCircle, Hash
} from 'lucide-react';

// 评论项组件
const CommentItem = ({ 
  comment, 
  currentUser, 
  onReply, 
  onLike, 
  onEdit, 
  onDelete,
  onMarkAsRead,
  depth = 0 
}) => {
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  
  const isOwner = comment.userId === currentUser.id;
  const isUnread = !comment.readBy?.includes(currentUser.id);
  
  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const handleMarkAsRead = () => {
    if (isUnread) {
      onMarkAsRead(comment.id);
    }
  };

  useEffect(() => {
    if (isUnread) {
      const timer = setTimeout(handleMarkAsRead, 2000); // 2秒后自动标记为已读
      return () => clearTimeout(timer);
    }
  }, [isUnread]);

  return (
    <div 
      style={{
        marginLeft: `${depth * 20}px`,
        marginBottom: '16px',
        position: 'relative'
      }}
      onClick={handleMarkAsRead}
    >
      <div style={{
        background: isUnread ? '#f0f9ff' : 'white',
        border: `1px solid ${isUnread ? '#0ea5e9' : '#e5e7eb'}`,
        borderRadius: '8px',
        padding: '12px',
        position: 'relative'
      }}>
        {/* 未读指示器 */}
        {isUnread && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '8px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#0ea5e9',
            boxShadow: '0 0 4px rgba(14, 165, 233, 0.5)'
          }} />
        )}

        {/* 评论头部 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: comment.user.avatar ? 'none' : '#4ECDC4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: 'white'
            }}>
              {comment.user.avatar || <User size={12} />}
            </div>
            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#111827'
              }}>
                {comment.user.name}
                {isOwner && (
                  <span style={{
                    marginLeft: '6px',
                    fontSize: '11px',
                    color: '#6b7280'
                  }}>
                    (您)
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Clock size={10} />
                {new Date(comment.createdAt).toLocaleString()}
                {comment.isEdited && (
                  <span style={{ fontStyle: 'italic' }}>已编辑</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <MoreHorizontal size={14} />
            </button>

            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e5e7eb',
                zIndex: 100,
                minWidth: '120px'
              }}>
                <button
                  onClick={() => {
                    setShowReplyInput(true);
                    setShowMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Reply size={12} />
                  回复
                </button>
                {isOwner && (
                  <>
                    <button
                      onClick={() => {
                        onEdit(comment.id);
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Edit size={12} />
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        onDelete(comment.id);
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trash2 size={12} />
                      删除
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 评论内容 */}
        <div style={{
          fontSize: '14px',
          color: '#374151',
          lineHeight: '1.5',
          marginBottom: '12px'
        }}>
          {comment.content}
        </div>

        {/* 评论附件 */}
        {comment.attachments && comment.attachments.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
            {comment.attachments.map((attachment, index) => (
              <div key={index} style={{
                background: '#f3f4f6',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                📎 {attachment.name}
              </div>
            ))}
          </div>
        )}

        {/* 评论操作 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <button
            onClick={() => onLike(comment.id)}
            style={{
              background: 'none',
              border: 'none',
              color: comment.liked ? '#4ECDC4' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ThumbsUp size={12} fill={comment.liked ? 'currentColor' : 'none'} />
            {comment.likes || 0}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Eye size={12} />
            {comment.readBy?.length || 0} 人已读
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4ECDC4',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {showReplies ? '隐藏' : '显示'} {comment.replies.length} 条回复
            </button>
          )}
        </div>

        {/* 回复输入框 */}
        {showReplyInput && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            background: '#f9fafb',
            borderRadius: '6px'
          }}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="输入回复..."
              style={{
                width: '100%',
                minHeight: '60px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '13px',
                resize: 'vertical'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '8px'
            }}>
              <button
                onClick={() => setShowReplyInput(false)}
                style={{
                  padding: '6px 12px',
                  background: 'none',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                style={{
                  padding: '6px 12px',
                  background: replyText.trim() ? '#4ECDC4' : '#e5e7eb',
                  color: replyText.trim() ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                回复
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 回复列表 */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              onMarkAsRead={onMarkAsRead}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 实时评论系统主组件
export const RealTimeCommentSystem = ({ 
  documentId,
  comments = [],
  currentUser,
  onAddComment,
  onReplyComment,
  onLikeComment,
  onEditComment,
  onDeleteComment,
  onMarkAsRead,
  typingUsers = [],
  isConnected = true
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const commentInputRef = useRef(null);

  const unreadCount = comments.filter(
    comment => !comment.readBy?.includes(currentUser.id)
  ).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      right: showComments ? '0' : '-400px',
      top: '0',
      bottom: '0',
      width: '400px',
      background: 'white',
      borderLeft: '1px solid #e5e7eb',
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      transition: 'right 0.3s ease-in-out',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 头部 */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <MessageCircle size={18} color="#4ECDC4" />
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827'
            }}>
              评论讨论
            </h3>
            {unreadCount > 0 && (
              <span style={{
                background: '#ef4444',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            {showComments ? '→' : '←'}
          </button>
        </div>

        {/* 连接状态 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: isConnected ? '#10b981' : '#ef4444'
        }}>
          {isConnected ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {isConnected ? '实时同步已开启' : '连接已断开'}
        </div>

        {/* 正在输入提示 */}
        {typingUsers.length > 0 && (
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#6b7280',
            fontStyle: 'italic'
          }}>
            {typingUsers.map(user => user.name).join(', ')} 正在输入...
          </div>
        )}
      </div>

      {/* 评论列表 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {comments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            marginTop: '40px'
          }}>
            <MessageCircle size={32} style={{ marginBottom: '8px' }} />
            <div>还没有评论</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              开始第一个讨论吧
            </div>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={onReplyComment}
              onLike={onLikeComment}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>

      {/* 新评论输入 */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: 1 }}>
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="添加评论... (Ctrl+Enter 发送)"
                style={{
                  width: '100%',
                  minHeight: '60px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                disabled={!isConnected}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px',
                fontSize: '11px',
                color: '#6b7280'
              }}>
                <span>Ctrl+Enter 快速发送</span>
                <span>{newComment.length}/1000</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting || !isConnected}
              style={{
                padding: '12px',
                background: newComment.trim() && !isSubmitting && isConnected ? '#4ECDC4' : '#e5e7eb',
                color: newComment.trim() && !isSubmitting && isConnected ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '6px',
                cursor: newComment.trim() && !isSubmitting && isConnected ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* 切换按钮（当面板关闭时） */}
    {!showComments && (
      <button
        onClick={() => setShowComments(true)}
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '12px',
          background: '#4ECDC4',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 1001,
          boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MessageCircle size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </button>
    )}
  </div>
  );
};

export default RealTimeCommentSystem;
