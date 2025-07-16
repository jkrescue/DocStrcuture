import React, { useState } from 'react';
import EditorDemo from './pages/EditorDemo';
import VersionComparisonTest from './pages/VersionComparisonTest';
import VersionComparisonDemo from './pages/VersionComparisonDemo';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('editor'); // 'editor', 'comparison-demo'

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
        </div>

        {/* 页面内容 */}
        {currentPage === 'editor' ? <EditorDemo /> : <VersionComparisonDemo />}
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