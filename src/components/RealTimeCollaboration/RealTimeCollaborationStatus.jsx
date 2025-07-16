import React, { useState, useEffect } from 'react';
import { 
  Users, Wifi, WifiOff, User, MessageCircle, 
  Typing, CheckCircle, AlertCircle, Clock
} from 'lucide-react';

// 在线用户列表组件
const OnlineUsersList = ({ users, currentUser, typingUsers }) => {
  const [showFullList, setShowFullList] = useState(false);
  const displayUsers = showFullList ? users : users.slice(0, 5);
  const hasMore = users.length > 5;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      minWidth: '280px',
      maxWidth: '320px',
      zIndex: 1200,
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <Users size={16} color="#4ECDC4" />
        <span style={{ fontWeight: '600', color: '#111827' }}>
          在线协作 ({users.length})
        </span>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {displayUsers.map(user => {
          const isCurrentUser = user.id === currentUser.id;
          const isTyping = typingUsers.some(tu => tu.id === user.id);
          
          return (
            <div key={user.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 0',
              borderBottom: '1px solid #f8fafc'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isCurrentUser ? '#4ECDC4' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: isCurrentUser ? 'white' : '#6b7280',
                position: 'relative'
              }}>
                {user.avatar || <User size={16} />}
                {/* 在线状态指示器 */}
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid white'
                }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#111827'
                }}>
                  {user.name}
                  {isCurrentUser && (
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      (您)
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {user.department || '协作中'}
                </div>
              </div>
              
              {isTyping && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: '#4ECDC4'
                }}>
                  <Typing size={12} />
                  <span>输入中...</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowFullList(!showFullList)}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '6px',
            background: 'none',
            border: 'none',
            color: '#4ECDC4',
            fontSize: '12px',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          {showFullList ? '收起' : `查看全部 ${users.length} 人`}
        </button>
      )}
    </div>
  );
};

// 连接状态指示器
const ConnectionStatus = ({ isConnected, error, onlineCount }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1300
    }}>
      <div
        onClick={() => setShowDetails(!showDetails)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: isConnected ? '#dcfce7' : '#fef2f2',
          color: isConnected ? '#166534' : '#dc2626',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          border: `1px solid ${isConnected ? '#bbf7d0' : '#fecaca'}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {isConnected ? (
          <>
            <Wifi size={14} />
            <span>实时协作已开启</span>
            {onlineCount > 0 && (
              <span style={{
                background: '#4ECDC4',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '11px',
                marginLeft: '4px'
              }}>
                {onlineCount}
              </span>
            )}
          </>
        ) : (
          <>
            <WifiOff size={14} />
            <span>协作连接中断</span>
          </>
        )}
      </div>

      {showDetails && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          padding: '12px',
          minWidth: '200px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '13px', color: '#374151' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>连接状态:</strong> {isConnected ? '已连接' : '已断开'}
            </div>
            {onlineCount > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <strong>在线用户:</strong> {onlineCount} 人
              </div>
            )}
            {error && (
              <div style={{ color: '#dc2626', fontSize: '12px' }}>
                <strong>错误:</strong> {error}
              </div>
            )}
            <div style={{
              marginTop: '8px',
              fontSize: '11px',
              color: '#6b7280'
            }}>
              点击查看在线用户列表
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 实时活动通知
const ActivityNotification = ({ activity, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000); // 5秒后自动消失
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment': return <MessageCircle size={16} />;
      case 'approval': return <CheckCircle size={16} />;
      case 'user_joined': return <User size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'comment': return '#4ECDC4';
      case 'approval': return '#10b981';
      case 'user_joined': return '#6366f1';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      padding: '12px 16px',
      maxWidth: '300px',
      zIndex: 1400,
      border: '1px solid #e5e7eb',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px'
      }}>
        <div style={{ color: getActivityColor(activity.type) }}>
          {getActivityIcon(activity.type)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {activity.title}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            lineHeight: '1.4'
          }}>
            {activity.message}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#9ca3af',
            marginTop: '4px'
          }}>
            刚刚
          </div>
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '2px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

// 主要的实时协作状态组件
export const RealTimeCollaborationStatus = ({ 
  isConnected, 
  onlineUsers, 
  typingUsers, 
  currentUser, 
  connectionError,
  activities = [] 
}) => {
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // 处理活动通知
  useEffect(() => {
    if (activities.length > 0) {
      const latestActivity = activities[activities.length - 1];
      const notification = {
        id: Date.now(),
        ...latestActivity
      };
      setNotifications(prev => [...prev, notification]);
    }
  }, [activities]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {/* 连接状态指示器 */}
      <ConnectionStatus 
        isConnected={isConnected}
        error={connectionError}
        onlineCount={onlineUsers.length}
      />

      {/* 在线用户按钮 */}
      {isConnected && onlineUsers.length > 0 && (
        <button
          onClick={() => setShowOnlineUsers(!showOnlineUsers)}
          style={{
            position: 'fixed',
            top: '120px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: '#4ECDC4',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            zIndex: 1100,
            boxShadow: '0 2px 8px rgba(78, 205, 196, 0.3)'
          }}
        >
          <Users size={14} />
          <span>{onlineUsers.length}</span>
        </button>
      )}

      {/* 在线用户列表 */}
      {showOnlineUsers && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.1)',
              zIndex: 1150
            }}
            onClick={() => setShowOnlineUsers(false)}
          />
          <OnlineUsersList 
            users={onlineUsers}
            currentUser={currentUser}
            typingUsers={typingUsers}
          />
        </>
      )}

      {/* 活动通知 */}
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            position: 'fixed',
            bottom: `${100 + index * 80}px`,
            right: '20px',
            zIndex: 1400
          }}
        >
          <ActivityNotification 
            activity={notification}
            onDismiss={() => dismissNotification(notification.id)}
          />
        </div>
      ))}

      {/* CSS动画 */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default RealTimeCollaborationStatus;
