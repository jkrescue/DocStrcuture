import React, { useState } from 'react';
import EditorDemo from './pages/EditorDemo';
import VersionComparisonTest from './pages/VersionComparisonTest';
import VersionComparisonDemo from './pages/VersionComparisonDemo';
import AISmartApprovalDemo from './pages/AISmartApprovalDemo';
import TestComponent from './pages/TestComponent';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('test'); // 'editor', 'comparison-demo', 'ai-approval', 'test'

  try {
    return (
      <div className="App">
        {/* 页面切换按钮 */}
        <div className="page-switcher">
          <button
            onClick={() => setCurrentPage('editor')}
            className="page-switcher-button"
            style={{
              backgroundColor: currentPage === 'editor' ? '#4f46e5' : 'white',
              color: currentPage === 'editor' ? 'white' : '#374151'
            }}
          >
            主应用
          </button>
          <button
            onClick={() => setCurrentPage('comparison-demo')}
            className="page-switcher-button"
            style={{
              backgroundColor: currentPage === 'comparison-demo' ? '#059669' : 'white',
              color: currentPage === 'comparison-demo' ? 'white' : '#374151'
            }}
          >
            版本对比演示
          </button>
          <button
            onClick={() => setCurrentPage('ai-approval')}
            className="page-switcher-button"
            style={{
              backgroundColor: currentPage === 'ai-approval' ? '#667eea' : 'white',
              color: currentPage === 'ai-approval' ? 'white' : '#374151'
            }}
          >
            AI智能审批
          </button>
          <button
            onClick={() => setCurrentPage('test')}
            className="page-switcher-button"
            style={{
              backgroundColor: currentPage === 'test' ? '#10b981' : 'white',
              color: currentPage === 'test' ? 'white' : '#374151'
            }}
          >
            测试页面
          </button>
        </div>

        {/* 页面内容 */}
        {currentPage === 'editor' && <EditorDemo />}
        {currentPage === 'comparison-demo' && <VersionComparisonDemo />}
        {currentPage === 'ai-approval' && <AISmartApprovalDemo />}
        {currentPage === 'test' && <TestComponent />}
      </div>
    );
  } catch (error) {
    console.error('App渲染错误:', error);
    return (
      <div style={{ padding: '20px', color: 'red', background: 'white' }}>
        <h1>应用渲染错误</h1>
        <p>错误信息: {error.message}</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {error.stack}
        </pre>
      </div>
    );
  }
}

export default App;