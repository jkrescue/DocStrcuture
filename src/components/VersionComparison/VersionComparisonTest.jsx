import React from 'react';

const VersionComparisonTest = ({ 
  leftVersion, 
  rightVersion, 
  onClose,
  document 
}) => {
  console.log('VersionComparisonTest rendered with:', { leftVersion, rightVersion });

  if (!leftVersion || !rightVersion) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>无法加载版本对比</h2>
          <p style={{ marginBottom: '20px', color: '#6c757d' }}>
            缺少版本数据。leftVersion: {leftVersion ? '✓' : '✗'}, rightVersion: {rightVersion ? '✓' : '✗'}
          </p>
          <button 
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '90%',
        height: '90%',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 头部 */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e1e5e9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>版本对比</h2>
          <button 
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            关闭
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflow: 'auto'
        }}>
          {/* 版本信息对比 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '20px',
            marginBottom: '30px',
            alignItems: 'center'
          }}>
            <div style={{
              padding: '20px',
              border: '1px solid #dc3545',
              borderRadius: '8px',
              backgroundColor: '#fff5f5'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>
                旧版本: {leftVersion.description || leftVersion.id}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>
                作者: {leftVersion.author}<br/>
                时间: {leftVersion.timestamp ? new Date(leftVersion.timestamp).toLocaleString() : '未知'}<br/>
                块数量: {(leftVersion.blocks || []).length}
              </p>
            </div>
            
            <div style={{
              fontSize: '24px',
              color: '#007bff',
              textAlign: 'center'
            }}>
              →
            </div>
            
            <div style={{
              padding: '20px',
              border: '1px solid #28a745',
              borderRadius: '8px',
              backgroundColor: '#f0fff4'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>
                新版本: {rightVersion.description || rightVersion.id}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>
                作者: {rightVersion.author}<br/>
                时间: {rightVersion.timestamp ? new Date(rightVersion.timestamp).toLocaleString() : '未知'}<br/>
                块数量: {(rightVersion.blocks || []).length}
              </p>
            </div>
          </div>

          {/* 简单的块对比 */}
          <div style={{
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e1e5e9',
              fontWeight: 'bold'
            }}>
              内容对比
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              minHeight: '300px'
            }}>
              <div style={{
                padding: '20px',
                borderRight: '1px solid #e1e5e9',
                backgroundColor: '#fff8f8'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#dc3545' }}>旧版本内容</h4>
                {leftVersion.blocks && leftVersion.blocks.length > 0 ? (
                  leftVersion.blocks.map((block, index) => (
                    <div key={block.id || index} style={{
                      marginBottom: '15px',
                      padding: '10px',
                      border: '1px solid #f1b0b7',
                      borderRadius: '4px',
                      backgroundColor: 'white'
                    }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>
                        {block.type} - {block.id}
                      </div>
                      <div>
                        {block.type === 'text' && block.content?.text}
                        {block.type === 'field' && `${block.content?.label}: ${block.content?.value}`}
                        {block.type === 'table' && '表格数据'}
                        {block.type === 'reference' && `引用: ${block.content?.title}`}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#6c757d' }}>无内容块</p>
                )}
              </div>
              
              <div style={{
                padding: '20px',
                backgroundColor: '#f8fff8'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#28a745' }}>新版本内容</h4>
                {rightVersion.blocks && rightVersion.blocks.length > 0 ? (
                  rightVersion.blocks.map((block, index) => (
                    <div key={block.id || index} style={{
                      marginBottom: '15px',
                      padding: '10px',
                      border: '1px solid #c6f6d5',
                      borderRadius: '4px',
                      backgroundColor: 'white'
                    }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>
                        {block.type} - {block.id}
                      </div>
                      <div>
                        {block.type === 'text' && block.content?.text}
                        {block.type === 'field' && `${block.content?.label}: ${block.content?.value}`}
                        {block.type === 'table' && '表格数据'}
                        {block.type === 'reference' && `引用: ${block.content?.title}`}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#6c757d' }}>无内容块</p>
                )}
              </div>
            </div>
          </div>

          {/* 调试信息 */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e1e5e9',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            <strong>调试信息:</strong><br/>
            leftVersion ID: {leftVersion.id}<br/>
            rightVersion ID: {rightVersion.id}<br/>
            leftVersion blocks count: {(leftVersion.blocks || []).length}<br/>
            rightVersion blocks count: {(rightVersion.blocks || []).length}<br/>
            组件渲染时间: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionComparisonTest;
