import React from 'react';
import EditorDemo from './pages/EditorDemo';
import './styles/App.css';

function App() {
  try {
    return (
      <div className="App">
        <EditorDemo />
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