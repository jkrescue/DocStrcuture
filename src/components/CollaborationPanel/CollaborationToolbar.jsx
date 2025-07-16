import React from 'react';
import { MessageSquare, CheckCircle, Eye, Users } from 'lucide-react';
import '../CollaborationPanel/CollaborationPanel.css';

const CollaborationToolbar = ({ 
  onOpenPanel, 
  commentCount = 0, 
  pendingApprovals = 0,
  onlineUsers = 0,
  className = '' 
}) => {
  return (
    <div className={`collaboration-toolbar ${className}`}>
      <button
        className="collab-btn"
        onClick={onOpenPanel}
        title="打开协作面板"
      >
        <MessageSquare size={16} />
        <span>协作</span>
        {(commentCount > 0 || pendingApprovals > 0) && (
          <span className="notification-badge">
            {commentCount + pendingApprovals}
          </span>
        )}
      </button>
      
      {onlineUsers > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 10px',
          background: '#f0fdfc',
          color: '#4ECDC4',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          <Users size={14} />
          {onlineUsers} 在线
        </div>
      )}
    </div>
  );
};

export default CollaborationToolbar;
