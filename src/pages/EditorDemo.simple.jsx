import React, { useState } from 'react';
import { useDocStore } from '../stores/docStore';

const EditorDemo = () => {
  try {
    const { blocks } = useDocStore();
    
    return (
      <div style={{ padding: '20px', background: 'white', minHeight: '100vh' }}>
        <h1>文档结构化编辑器 - 简化版</h1>
        <p>当前有 {blocks.length} 个文档块</p>
        
        <div style={{ marginTop: '20px' }}>
          {blocks.map((block, index) => (
            <div key={block.id} style={{
              border: '1px solid #ddd',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '4px',
              background: '#f9f9f9'
            }}>
              <strong>块 {index + 1}: {block.type}</strong>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                ID: {block.id}
              </div>
              {block.content && (
                <div style={{ marginTop: '5px' }}>
                  内容: {JSON.stringify(block.content).substring(0, 100)}...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>EditorDemo 错误</h1>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
};

export default EditorDemo;
