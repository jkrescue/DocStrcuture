import React, { useState } from 'react';
import VersionComparison from '../components/VersionComparison/VersionComparison';

const VersionComparisonTest = () => {
  const [showComparison, setShowComparison] = useState(false);
  
  // 测试数据
  const leftVersion = {
    id: 'v_1',
    version: '1.0.0',
    description: '初始版本',
    author: '张三',
    timestamp: new Date('2024-01-15 10:30:00').getTime(),
    blocks: [
      {
        id: 'block_v1_1',
        type: 'text',
        content: { text: '# 文档管理系统\n\n## 项目概述\n\n这是一个全新的文档管理系统项目。' }
      },
      {
        id: 'block_v1_2',
        type: 'field',
        content: {
          fieldType: 'text',
          label: '项目名称',
          value: '文档管理系统V1',
          required: true
        }
      }
    ]
  };

  const rightVersion = {
    id: 'v_2',
    version: '1.1.0',
    description: '需求补充',
    author: '李四',
    timestamp: new Date('2024-01-16 14:20:00').getTime(),
    blocks: [
      {
        id: 'block_v1_1',
        type: 'text',
        content: { text: '# 文档管理系统\n\n## 项目概述\n\n这是一个全新的文档管理系统项目，旨在提供高效的文档管理能力。' }
      },
      {
        id: 'block_v1_2',
        type: 'field',
        content: {
          fieldType: 'text',
          label: '项目名称',
          value: '文档管理系统V1.1',
          required: true
        }
      },
      {
        id: 'block_v2_1',
        type: 'text',
        content: { text: '## 需求分析\n\n### 功能需求\n\n1. 文档创建和编辑\n2. 版本控制\n3. 协作功能' }
      }
    ]
  };

  if (showComparison) {
    return (
      <VersionComparison
        leftVersion={leftVersion}
        rightVersion={rightVersion}
        onClose={() => setShowComparison(false)}
        document={null}
      />
    );
  }

  return (
    <div style={{
      padding: '40px',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>版本对比功能测试</h1>
      <p style={{ marginBottom: '30px', color: '#666', textAlign: 'center' }}>
        点击下面的按钮来测试版本对比组件
      </p>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>测试版本信息：</h3>
        <div style={{ display: 'flex', gap: '30px', marginTop: '15px' }}>
          <div>
            <h4>左侧版本 (v1.0.0):</h4>
            <ul>
              <li>作者: 张三</li>
              <li>时间: 2024-01-15</li>
              <li>包含 2 个块</li>
            </ul>
          </div>
          <div>
            <h4>右侧版本 (v1.1.0):</h4>
            <ul>
              <li>作者: 李四</li>
              <li>时间: 2024-01-16</li>
              <li>包含 3 个块</li>
            </ul>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setShowComparison(true)}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        开始版本对比测试
      </button>
    </div>
  );
};

export default VersionComparisonTest;
