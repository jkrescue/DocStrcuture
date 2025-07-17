import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  TrendingUp,
  Bell,
  Zap
} from 'lucide-react';
import AICollaborationAssistant from './AICollaborationAssistant';
import './AIAssistantTrigger.css';

const AIAssistantTrigger = ({ 
  documentId,
  documentData,
  currentUser,
  className = '' 
}) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [hasNewSuggestions, setHasNewSuggestions] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // 模拟AI通知系统
  useEffect(() => {
    const checkForSuggestions = () => {
      // 模拟检查新的AI建议
      const hasNew = Math.random() > 0.7; // 30%概率有新建议
      setHasNewSuggestions(hasNew);
      
      if (hasNew) {
        const newNotification = {
          id: Date.now(),
          type: 'suggestion',
          message: '检测到新的智能审批建议',
          timestamp: new Date()
        };
        setNotifications(prev => [...prev.slice(-4), newNotification]); // 保留最近5条
      }
    };

    // 初始检查
    checkForSuggestions();
    
    // 定期检查（模拟实时AI分析）
    const interval = setInterval(checkForSuggestions, 30000); // 30秒检查一次
    
    return () => clearInterval(interval);
  }, [documentId]);

  const handleToggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
    if (!isAssistantOpen) {
      setHasNewSuggestions(false); // 打开助手时清除新建议标记
    }
  };

  const handleCloseAssistant = () => {
    setIsAssistantOpen(false);
  };

  return (
    <>
      {/* AI助手触发按钮 */}
      <div className={`ai-assistant-trigger ${className}`}>
        {/* 主触发按钮 */}
        <button 
          className={`trigger-button ${hasNewSuggestions ? 'has-suggestions' : ''}`}
          onClick={handleToggleAssistant}
          title="AI协作助手"
        >
          <div className="button-icon">
            <Brain size={20} />
            <Sparkles className="sparkle-overlay" size={14} />
          </div>
          
          {hasNewSuggestions && (
            <div className="notification-badge">
              <span>{notifications.length}</span>
            </div>
          )}
          
          <div className="pulse-ring"></div>
        </button>

        {/* 快速操作面板（悬停显示） */}
        <div className="quick-actions-panel">
          <div className="quick-action" title="智能审批建议">
            <TrendingUp size={16} />
            <span>审批建议</span>
          </div>
          <div className="quick-action" title="协作分析">
            <MessageSquare size={16} />
            <span>协作分析</span>
          </div>
          <div className="quick-action" title="优化建议">
            <Zap size={16} />
            <span>优化建议</span>
          </div>
        </div>

        {/* 通知提示气泡 */}
        {hasNewSuggestions && notifications.length > 0 && (
          <div className="notification-bubble">
            <div className="bubble-header">
              <Bell size={14} />
              <span>AI助手提醒</span>
            </div>
            <div className="bubble-content">
              <div className="latest-notification">
                {notifications[notifications.length - 1]?.message}
              </div>
              <button 
                className="view-all-btn"
                onClick={handleToggleAssistant}
              >
                查看详情
              </button>
            </div>
            <div className="bubble-arrow"></div>
          </div>
        )}
      </div>

      {/* AI协作助手主面板 */}
      <AICollaborationAssistant
        documentId={documentId}
        documentData={documentData}
        currentUser={currentUser}
        isOpen={isAssistantOpen}
        onToggle={handleToggleAssistant}
        onClose={handleCloseAssistant}
      />
    </>
  );
};

export default AIAssistantTrigger;