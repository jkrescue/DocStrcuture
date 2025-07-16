import React, { useState } from 'react';
import EditorDemo from './pages/EditorDemo';
import VersionComparisonTest from './pages/VersionComparisonTest';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('editor'); // 'editor' 或 'comparison-test'

  try {
    return (
      <div className="App">
        {/* 页面切换按钮 */}
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setCurrentPage('editor')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === 'editor' ? '#007bff' : 'white',
              color: currentPage === 'editor' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            主应用
          </button>
          <button
            onClick={() => setCurrentPage('comparison-test')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === 'comparison-test' ? '#007bff' : 'white',
              color: currentPage === 'comparison-test' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            版本对比测试
          </button>
        </div>

        {/* 页面内容 */}
        {currentPage === 'editor' ? <EditorDemo /> : <VersionComparisonTest />}
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