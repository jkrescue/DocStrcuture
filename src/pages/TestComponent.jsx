import React from 'react';

const TestComponent = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1>测试页面</h1>
      <p>如果您看到这个页面，说明React已经正常工作</p>
      <button onClick={() => alert('按钮可以正常工作!')}>点击测试</button>
    </div>
  );
};

export default TestComponent;
