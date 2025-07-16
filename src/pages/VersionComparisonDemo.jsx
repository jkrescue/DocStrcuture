import React, { useState } from 'react';
import VersionComparisonTest from '../components/VersionComparison/VersionComparisonTest';
import { useDocStore } from '../stores/docStore';

const VersionComparisonDemoPage = () => {
  const { versions } = useDocStore();
  const [showComparison, setShowComparison] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState([]);

  const handleVersionSelect = (versionId) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const startComparison = () => {
    if (selectedVersions.length === 2) {
      setShowComparison(true);
    }
  };

  const leftVersion = versions.find(v => v.id === selectedVersions[0]);
  const rightVersion = versions.find(v => v.id === selectedVersions[1]);

  if (showComparison && leftVersion && rightVersion) {
    return (
      <VersionComparisonTest
        leftVersion={leftVersion}
        rightVersion={rightVersion}
        onClose={() => {
          setShowComparison(false);
          setSelectedVersions([]);
        }}
      />
    );
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <h1 style={{ marginBottom: '30px' }}>版本对比演示</h1>
      
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #0ea5e9',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0, color: '#0369a1' }}>
          请选择两个版本进行对比 ({selectedVersions.length}/2)
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {versions.map(version => (
          <div
            key={version.id}
            onClick={() => handleVersionSelect(version.id)}
            style={{
              padding: '20px',
              border: selectedVersions.includes(version.id) 
                ? '2px solid #0ea5e9' 
                : '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedVersions.includes(version.id) 
                ? '#f0f9ff' 
                : 'white',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>
                {version.version}
              </h3>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: version.status === 'published' ? '#d1fae5' : '#fef3c7',
                color: version.status === 'published' ? '#065f46' : '#92400e'
              }}>
                {version.status}
              </span>
            </div>
            
            <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>
              {version.name}
            </h4>
            
            <p style={{ 
              margin: '0 0 12px 0', 
              color: '#6b7280', 
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {version.description}
            </p>
            
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              <div>作者: {version.author}</div>
              <div>时间: {new Date(version.timestamp).toLocaleString()}</div>
              <div>块数量: {version.blocks?.length || 0}</div>
            </div>
            
            {selectedVersions.includes(version.id) && (
              <div style={{
                marginTop: '10px',
                padding: '6px 12px',
                backgroundColor: '#0ea5e9',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                已选择 #{selectedVersions.indexOf(version.id) + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={startComparison}
          disabled={selectedVersions.length !== 2}
          style={{
            padding: '12px 24px',
            backgroundColor: selectedVersions.length === 2 ? '#0ea5e9' : '#d1d5db',
            color: selectedVersions.length === 2 ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: selectedVersions.length === 2 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
        >
          开始版本对比
        </button>
      </div>

      {selectedVersions.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>已选择的版本:</h4>
          {selectedVersions.map((versionId, index) => {
            const version = versions.find(v => v.id === versionId);
            return (
              <div key={versionId} style={{ fontSize: '14px', color: '#6b7280' }}>
                {index + 1}. {version?.version} - {version?.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VersionComparisonDemoPage;
