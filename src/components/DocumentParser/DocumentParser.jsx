import React, { useState, useCallback } from 'react';
import { 
  Upload, FileUp, Scan, Brain, Network, CheckCircle, 
  AlertCircle, FileText, Hash, List, Quote, Table,
  Link2, Eye, Edit3, Download, Trash2, Plus
} from 'lucide-react';

const DocumentParser = ({ onParseComplete, onCancel }) => {
  const [step, setStep] = useState('upload'); // upload, parsing, preview, relationships
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [parsedContent, setParsedContent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [relationships, setRelationships] = useState([]);

  // 模拟文档解析功能
  const simulateDocumentParse = (file) => {
    return new Promise((resolve) => {
      // 模拟解析进度
      const updateProgress = (progress) => {
        setParseProgress(progress);
      };

      updateProgress(10);
      setTimeout(() => updateProgress(30), 300);
      setTimeout(() => updateProgress(60), 600);
      setTimeout(() => updateProgress(85), 900);
      setTimeout(() => {
        updateProgress(100);
        
        // 模拟解析结果
        const mockParsedContent = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          metadata: {
            originalFileName: file.name,
            fileSize: file.size,
            parseTime: new Date().toISOString(),
            language: 'zh-CN',
            pageCount: Math.floor(Math.random() * 20) + 5
          },
          blocks: [
            {
              id: 'parsed_1',
              type: 'heading',
              level: 1,
              content: { text: '项目管理系统需求分析' },
              metadata: { 
                source: 'page_1', 
                confidence: 0.95,
                originalText: '项目管理系统需求分析'
              }
            },
            {
              id: 'parsed_2',
              type: 'heading',
              level: 2,
              content: { text: '1. 系统概述' },
              metadata: { 
                source: 'page_1', 
                confidence: 0.92,
                originalText: '1. 系统概述'
              }
            },
            {
              id: 'parsed_3',
              type: 'paragraph',
              content: { 
                text: '本项目旨在开发一个现代化的项目管理系统，支持团队协作、任务跟踪、进度管理等核心功能。系统将采用前后端分离的架构，确保高性能和良好的用户体验。' 
              },
              metadata: { 
                source: 'page_1', 
                confidence: 0.88,
                originalText: '本项目旨在开发一个现代化的项目管理系统...'
              }
            },
            {
              id: 'parsed_4',
              type: 'heading',
              level: 2,
              content: { text: '2. 功能需求' },
              metadata: { 
                source: 'page_2', 
                confidence: 0.94,
                originalText: '2. 功能需求'
              }
            },
            {
              id: 'parsed_5',
              type: 'list',
              content: { 
                items: [
                  '用户管理：注册、登录、权限控制',
                  '项目管理：创建项目、编辑项目信息、项目归档',
                  '任务管理：任务创建、分配、状态跟踪',
                  '团队协作：评论、通知、文件共享',
                  '报表统计：进度报表、工作量统计、时间分析'
                ]
              },
              metadata: { 
                source: 'page_2', 
                confidence: 0.90,
                originalText: '• 用户管理：注册、登录、权限控制...'
              }
            },
            {
              id: 'parsed_6',
              type: 'heading',
              level: 2,
              content: { text: '3. 技术架构' },
              metadata: { 
                source: 'page_3', 
                confidence: 0.93,
                originalText: '3. 技术架构'
              }
            },
            {
              id: 'parsed_7',
              type: 'table',
              content: {
                title: '技术选型',
                headers: ['层级', '技术栈', '说明'],
                rows: [
                  ['前端', 'React + TypeScript', '现代化前端框架'],
                  ['后端', 'Node.js + Express', '高性能后端服务'],
                  ['数据库', 'PostgreSQL', '关系型数据库'],
                  ['缓存', 'Redis', '内存缓存系统']
                ]
              },
              metadata: { 
                source: 'page_3', 
                confidence: 0.85,
                originalText: '技术选型表格内容...'
              }
            },
            {
              id: 'parsed_8',
              type: 'heading',
              level: 2,
              content: { text: '4. 实施计划' },
              metadata: { 
                source: 'page_4', 
                confidence: 0.91,
                originalText: '4. 实施计划'
              }
            },
            {
              id: 'parsed_9',
              type: 'paragraph',
              content: { 
                text: '项目计划分为四个阶段：需求分析阶段（2周）、系统设计阶段（3周）、开发实施阶段（8周）、测试部署阶段（2周）。总计15周完成整个项目。' 
              },
              metadata: { 
                source: 'page_4', 
                confidence: 0.87,
                originalText: '项目计划分为四个阶段...'
              }
            }
          ]
        };
        
        resolve(mockParsedContent);
      }, 1200);
    });
  };

  // 处理文件上传
  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    setStep('parsing');

    try {
      const parsed = await simulateDocumentParse(file);
      setParsedContent(parsed);
      setStep('preview');
    } catch (error) {
      console.error('文档解析失败:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // 拖拽上传处理
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      const fakeEvent = { target: { files: [file] } };
      handleFileUpload(fakeEvent);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  // 切换块选择
  const toggleBlockSelection = (blockId) => {
    setSelectedBlocks(prev => 
      prev.includes(blockId) 
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    );
  };

  // 添加关系
  const addRelationship = (sourceBlockId, targetBlockId, relationType) => {
    const newRelation = {
      id: `rel_${Date.now()}`,
      source: sourceBlockId,
      target: targetBlockId,
      type: relationType,
      createdAt: new Date().toISOString()
    };
    setRelationships(prev => [...prev, newRelation]);
  };

  // 完成解析
  const handleComplete = () => {
    if (parsedContent) {
      const document = {
        id: `doc_${Date.now()}`,
        title: parsedContent.title,
        content: parsedContent.blocks,
        metadata: {
          ...parsedContent.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'current_user',
          editorType: 'blocknote',
          isParsed: true,
          relationships: relationships
        },
        blocks: parsedContent.blocks
      };
      onParseComplete(document);
    }
  };

  // 渲染上传步骤
  const renderUploadStep = () => (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '700', 
        color: '#111827', 
        marginBottom: '16px' 
      }}>
        上传文档进行解析
      </h2>
      <p style={{ 
        fontSize: '16px', 
        color: '#6b7280', 
        marginBottom: '32px' 
      }}>
        支持PDF文档，将自动解析为结构化内容
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #d1d5db',
          borderRadius: '12px',
          padding: '48px 24px',
          backgroundColor: '#fafbfc',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#8b5cf6';
          e.currentTarget.style.backgroundColor = '#f5f3ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.backgroundColor = '#fafbfc';
        }}
      >
        <FileUp size={48} color="#8b5cf6" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          拖拽文件到此处
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          或者点击选择文件
        </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          选择PDF文件
        </label>
      </div>

      <div style={{ 
        marginTop: '24px', 
        fontSize: '14px', 
        color: '#6b7280' 
      }}>
        支持的格式：PDF（最大50MB）
      </div>
    </div>
  );

  // 渲染解析进度步骤
  const renderParsingStep = () => (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <Brain size={48} color="#8b5cf6" style={{ margin: '0 auto 24px' }} />
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '700', 
        color: '#111827', 
        marginBottom: '16px' 
      }}>
        正在解析文档...
      </h2>
      
      {uploadedFile && (
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280', 
          marginBottom: '32px' 
        }}>
          {uploadedFile.name}
        </p>
      )}

      <div style={{ 
        width: '100%', 
        backgroundColor: '#e5e7eb', 
        borderRadius: '8px', 
        height: '8px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: `${parseProgress}%`,
          backgroundColor: '#8b5cf6',
          height: '100%',
          borderRadius: '8px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        {parseProgress}% 完成
      </p>

      <div style={{ marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
        正在识别文档结构、提取内容并分析段落关系...
      </div>
    </div>
  );

  // 渲染预览步骤
  const renderPreviewStep = () => (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '24px', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#111827', 
          marginBottom: '8px' 
        }}>
          解析结果预览
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          检查解析结果，选择需要的内容块，然后建立关系
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧内容预览 */}
        <div style={{ 
          flex: 1, 
          padding: '24px', 
          overflowY: 'auto',
          borderRight: '1px solid #e5e7eb'
        }}>
          {parsedContent?.blocks.map(block => (
            <div
              key={block.id}
              onClick={() => toggleBlockSelection(block.id)}
              style={{
                padding: '16px',
                marginBottom: '12px',
                border: selectedBlocks.includes(block.id) 
                  ? '2px solid #8b5cf6' 
                  : '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedBlocks.includes(block.id) 
                  ? '#f5f3ff' 
                  : '#ffffff',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '8px'
              }}>
                {block.type === 'heading' && <Hash size={16} color="#8b5cf6" />}
                {block.type === 'paragraph' && <FileText size={16} color="#6b7280" />}
                {block.type === 'list' && <List size={16} color="#10b981" />}
                {block.type === 'table' && <Table size={16} color="#f59e0b" />}
                
                <span style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  fontWeight: '500'
                }}>
                  {block.type}
                  {block.level && ` H${block.level}`}
                </span>
                
                <span style={{ 
                  fontSize: '12px', 
                  color: '#8b5cf6',
                  marginLeft: 'auto'
                }}>
                  {Math.round(block.metadata.confidence * 100)}%
                </span>
              </div>
              
              <div style={{ 
                fontSize: block.type === 'heading' && block.level === 1 ? '18px' : 
                         block.type === 'heading' && block.level === 2 ? '16px' : '14px',
                fontWeight: block.type === 'heading' ? '600' : '400',
                color: '#1f2937',
                lineHeight: '1.5'
              }}>
                {block.type === 'list' ? (
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {block.content.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : block.type === 'table' ? (
                  <div>
                    <strong>{block.content.title}</strong>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {block.content.headers.length} 列 × {block.content.rows.length} 行
                    </div>
                  </div>
                ) : (
                  block.content.text
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧关系面板 */}
        <div style={{ 
          width: '300px', 
          padding: '24px',
          backgroundColor: '#fafbfc'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Network size={16} />
            内容关系
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              已选择 {selectedBlocks.length} 个内容块
            </p>
            {selectedBlocks.length >= 2 && (
              <button
                onClick={() => {
                  // 简单的关系建立逻辑
                  for (let i = 0; i < selectedBlocks.length - 1; i++) {
                    addRelationship(
                      selectedBlocks[i], 
                      selectedBlocks[i + 1], 
                      'follows'
                    );
                  }
                  setSelectedBlocks([]);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                建立顺序关系
              </button>
            )}
          </div>

          <div>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              marginBottom: '12px',
              color: '#374151'
            }}>
              已建立的关系 ({relationships.length})
            </h4>
            
            {relationships.map(rel => (
              <div
                key={rel.id}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                  {rel.type === 'follows' ? '顺序关系' : rel.type}
                </div>
                <div style={{ color: '#6b7280' }}>
                  {rel.source} → {rel.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div style={{ 
        padding: '16px 24px', 
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setStep('upload')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          重新上传
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            取消
          </button>
          
          <button
            onClick={handleComplete}
            style={{
              padding: '8px 16px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            创建文档
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      maxWidth: '1000px', 
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {step === 'upload' && renderUploadStep()}
      {step === 'parsing' && renderParsingStep()}
      {step === 'preview' && renderPreviewStep()}
    </div>
  );
};

export default DocumentParser;
