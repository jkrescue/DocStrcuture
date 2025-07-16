import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, Send, User, Clock, Check, X, 
  MoreHorizontal, Edit3, Trash2, Reply, AtSign,
  CheckCircle, AlertCircle, Eye, ThumbsUp, ThumbsDown
} from 'lucide-react';
import './CommentSystem.css';

// 评论组件
export const Comment = ({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  onResolve, 
  currentUser,
  showResolveButton = true,
  level = 0 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);

  const handleEdit = () => {
    onEdit(comment.id, editText);
    setIsEditing(false);
  };

  const canEdit = currentUser.id === comment.author.id;
  const canDelete = currentUser.id === comment.author.id || currentUser.role === 'admin';

  return (
    <div className={`comment ${level > 0 ? 'comment-reply' : ''}`}>
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar">{comment.author.avatar}</div>
          <div className="author-info">
            <span className="author-name">{comment.author.name}</span>
            <span className="comment-time">
              <Clock size={12} />
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="comment-actions">
          {comment.status === 'resolved' && (
            <span className="status-badge resolved">
              <CheckCircle size={14} />
              已解决
            </span>
          )}
          
          <button 
            className="action-btn"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showActions && (
            <div className="actions-dropdown">
              <button onClick={() => onReply(comment.id)}>
                <Reply size={14} />
                回复
              </button>
              {canEdit && (
                <button onClick={() => setIsEditing(true)}>
                  <Edit3 size={14} />
                  编辑
                </button>
              )}
              {canDelete && (
                <button onClick={() => onDelete(comment.id)} className="delete-action">
                  <Trash2 size={14} />
                  删除
                </button>
              )}
              {showResolveButton && comment.status !== 'resolved' && (
                <button onClick={() => onResolve(comment.id)}>
                  <CheckCircle size={14} />
                  标记为已解决
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="comment-content">
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-textarea"
            />
            <div className="edit-actions">
              <button onClick={handleEdit} className="save-btn">保存</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">取消</button>
            </div>
          </div>
        ) : (
          <div className="comment-text">
            {comment.content}
            {comment.mentions && comment.mentions.length > 0 && (
              <div className="mentions">
                提及: {comment.mentions.map(user => `@${user.name}`).join(', ')}
              </div>
            )}
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onResolve={onResolve}
              currentUser={currentUser}
              showResolveButton={false}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 新建评论表单
export const CommentForm = ({ 
  onSubmit, 
  placeholder = "添加评论...", 
  parentId = null,
  availableUsers = [],
  autoFocus = false 
}) => {
  const [content, setContent] = useState('');
  const [mentions, setMentions] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({
        content: content.trim(),
        mentions,
        parentId
      });
      setContent('');
      setMentions([]);
    }
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    
    // 检测 @ 符号并显示用户列表
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1 && atIndex === value.length - 1) {
      setShowUserList(true);
      setUserSearchTerm('');
    } else if (atIndex !== -1) {
      const searchTerm = value.substring(atIndex + 1);
      if (searchTerm.includes(' ')) {
        setShowUserList(false);
      } else {
        setUserSearchTerm(searchTerm);
        setShowUserList(true);
      }
    } else {
      setShowUserList(false);
    }
  };

  const selectUser = (user) => {
    const atIndex = content.lastIndexOf('@');
    const newContent = content.substring(0, atIndex) + `@${user.name} `;
    setContent(newContent);
    setMentions([...mentions, user]);
    setShowUserList(false);
    textareaRef.current.focus();
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-content">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="comment-textarea"
          rows={3}
        />
        
        {showUserList && (
          <div className="user-mentions-dropdown">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="user-mention-option"
                onClick={() => selectUser(user)}
              >
                <span className="user-avatar">{user.avatar}</span>
                <span className="user-name">{user.name}</span>
                <span className="user-department">{user.department}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <div className="form-hint">
          <AtSign size={14} />
          输入 @ 提及用户
        </div>
        <button type="submit" disabled={!content.trim()} className="submit-btn">
          <Send size={16} />
          发送
        </button>
      </div>
    </form>
  );
};

// 文档级评论面板
export const DocumentComments = ({ 
  documentId, 
  comments = [], 
  onAddComment, 
  onEditComment,
  onDeleteComment,
  onResolveComment,
  currentUser,
  availableUsers = []
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const handleAddComment = (commentData) => {
    onAddComment({
      ...commentData,
      documentId,
      type: 'document'
    });
    setShowAddForm(false);
  };

  const handleReply = (parentId) => {
    setReplyingTo(parentId);
  };

  const handleReplySubmit = (commentData) => {
    onAddComment({
      ...commentData,
      documentId,
      type: 'document',
      parentId: replyingTo
    });
    setReplyingTo(null);
  };

  const rootComments = comments.filter(comment => !comment.parentId);

  return (
    <div className="document-comments">
      <div className="comments-header">
        <h3>
          <MessageCircle size={20} />
          文档评论 ({comments.length})
        </h3>
        <button 
          className="add-comment-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          添加评论
        </button>
      </div>

      {showAddForm && (
        <CommentForm
          onSubmit={handleAddComment}
          placeholder="对整个文档添加评论..."
          availableUsers={availableUsers}
          autoFocus={true}
        />
      )}

      <div className="comments-list">
        {rootComments.map(comment => (
          <div key={comment.id}>
            <Comment
              comment={comment}
              onReply={handleReply}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onResolve={onResolveComment}
              currentUser={currentUser}
            />
            
            {replyingTo === comment.id && (
              <div className="reply-form">
                <CommentForm
                  onSubmit={handleReplySubmit}
                  placeholder={`回复 ${comment.author.name}...`}
                  parentId={comment.id}
                  availableUsers={availableUsers}
                  autoFocus={true}
                />
                <button 
                  className="cancel-reply"
                  onClick={() => setReplyingTo(null)}
                >
                  取消回复
                </button>
              </div>
            )}
          </div>
        ))}
        
        {rootComments.length === 0 && (
          <div className="no-comments">
            <MessageCircle size={48} />
            <p>暂无评论</p>
            <p>成为第一个评论者</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 块级评论气泡
export const BlockCommentBubble = ({ 
  blockId, 
  commentCount, 
  hasUnresolved,
  onClick,
  position = 'right' 
}) => {
  if (commentCount === 0) return null;

  return (
    <div 
      className={`block-comment-bubble ${position} ${hasUnresolved ? 'has-unresolved' : ''}`}
      onClick={onClick}
      title={`${commentCount} 条评论${hasUnresolved ? '，有未解决的评论' : ''}`}
    >
      <MessageCircle size={16} />
      <span className="comment-count">{commentCount}</span>
      {hasUnresolved && <div className="unresolved-indicator" />}
    </div>
  );
};

// 块级评论面板
export const BlockComments = ({ 
  blockId, 
  blockType,
  comments = [], 
  onAddComment, 
  onEditComment,
  onDeleteComment,
  onResolveComment,
  onClose,
  currentUser,
  availableUsers = []
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddComment = (commentData) => {
    onAddComment({
      ...commentData,
      blockId,
      type: 'block'
    });
    setShowAddForm(false);
  };

  return (
    <div className="block-comments-panel">
      <div className="panel-header">
        <h4>
          <MessageCircle size={18} />
          块评论 ({comments.length})
        </h4>
        <button className="close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="block-info">
        <span className="block-type-indicator">{blockType}</span>
        <span className="block-id">ID: {blockId.slice(-8)}</span>
      </div>

      {!showAddForm && (
        <button 
          className="add-comment-btn"
          onClick={() => setShowAddForm(true)}
        >
          <MessageCircle size={16} />
          添加评论
        </button>
      )}

      {showAddForm && (
        <CommentForm
          onSubmit={handleAddComment}
          placeholder="对此块添加评论..."
          availableUsers={availableUsers}
          autoFocus={true}
        />
      )}

      <div className="comments-list">
        {comments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onResolve={onResolveComment}
            currentUser={currentUser}
            showResolveButton={true}
          />
        ))}
        
        {comments.length === 0 && (
          <div className="no-comments">
            <p>暂无评论</p>
          </div>
        )}
      </div>
    </div>
  );
};
