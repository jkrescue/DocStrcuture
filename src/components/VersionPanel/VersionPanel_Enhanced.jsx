import React, { useState, useEffect } from 'react';
import { 
  Clock, GitBranch, User, Download, RotateCcw, Eye, Plus, Minus, Archive, 
  ChevronDown, X, Search, Filter, GitCommit, GitMerge, Tag, Calendar,
  CheckCircle, AlertCircle, Info, Zap, Star, Copy, Share2, FileText,
  Settings, Trash2, Edit, MessageSquare, Activity, TrendingUp, Code,
  History, BarChart3, Database, RefreshCw, PlayCircle, PauseCircle
} from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const VersionPanelEnhanced = ({ onClose, document }) => {
  const { versions, blocks, saveVersion, loadVersion } = useDocStore();
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState([]);
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, major, minor, auto, manual
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name, changes
  const [viewMode, setViewMode] = useState('timeline'); // timeline, tree, table
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);

  // 增强的版本数据
  const [enhancedVersions, setEnhancedVersions] = useState([
    {
      id: 'v1.0.0',
      description: '初始版本发布',
      timestamp: Date.now() - 2592000000, // 30天前
      author: '张三',
      authorAvatar: '👨‍💼',
      type: 'major',
      branch: 'main',
      size: '2.4 MB',
      changeCount: 156,
      tags: ['发布', '稳定版'],
      status: 'published',
      changes: {
        added: 85,
        modified: 0,
        deleted: 0,
        blocksChanged: 45,
        filesChanged: 12
      },
      content: {
        blockCount: 45,
        wordCount: 2840,
        imageCount: 8,
        tableCount: 6
      },
      collaborators: ['张三', '李四'],
      reviewStatus: 'approved',
      deployStatus: 'deployed',
      performance: {
        loadTime: '1.2s',
        bundleSize: '2.4MB',
        optimizationScore: 85
      },
      commits: [
        { hash: 'a1b2c3d', message: '添加项目概述部分', author: '张三', time: Date.now() - 2592000000 },
        { hash: 'e4f5g6h', message: '完善需求分析模块', author: '李四', time: Date.now() - 2591000000 },
        { hash: 'i7j8k9l', message: '优化表格样式', author: '张三', time: Date.now() - 2590000000 }
      ]
    },
    {
      id: 'v1.1.0',
      description: '功能增强版本',
      timestamp: Date.now() - 1296000000, // 15天前
      author: '李四',
      authorAvatar: '👩‍💻',
      type: 'minor',
      branch: 'feature/enhancements',
      size: '2.6 MB',
      changeCount: 89,
      tags: ['功能增强', '优化'],
      status: 'stable',
      changes: {
        added: 23,
        modified: 45,
        deleted: 8,
        blocksChanged: 28,
        filesChanged: 8
      },
      content: {
        blockCount: 52,
        wordCount: 3240,
        imageCount: 12,
        tableCount: 8
      },
      collaborators: ['李四', '王五'],
      reviewStatus: 'approved',
      deployStatus: 'deployed',
      performance: {
        loadTime: '1.1s',
        bundleSize: '2.6MB',
        optimizationScore: 88
      },
      commits: [
        { hash: 'm1n2o3p', message: '添加新的字段类型', author: '李四', time: Date.now() - 1296000000 },
        { hash: 'q4r5s6t', message: '改进搜索功能', author: '王五', time: Date.now() - 1295000000 },
        { hash: 'u7v8w9x', message: '修复已知问题', author: '李四', time: Date.now() - 1294000000 }
      ]
    },
    {
      id: 'v1.1.1',
      description: '紧急修复版本',
      timestamp: Date.now() - 604800000, // 7天前
      author: '王五',
      authorAvatar: '🔧',
      type: 'patch',
      branch: 'hotfix/critical-fixes',
      size: '2.7 MB',
      changeCount: 12,
      tags: ['修复', '紧急'],
      status: 'hotfix',
      changes: {
        added: 2,
        modified: 8,
        deleted: 2,
        blocksChanged: 5,
        filesChanged: 3
      },
      content: {
        blockCount: 52,
        wordCount: 3280,
        imageCount: 12,
        tableCount: 8
      },
      collaborators: ['王五'],
      reviewStatus: 'emergency',
      deployStatus: 'deployed',
      performance: {
        loadTime: '1.0s',
        bundleSize: '2.7MB',
        optimizationScore: 90
      },
      commits: [
        { hash: 'y1z2a3b', message: '修复数据同步问题', author: '王五', time: Date.now() - 604800000 },
        { hash: 'c4d5e6f', message: '优化性能瓶颈', author: '王五', time: Date.now() - 604700000 }
      ]
    },
    {
      id: 'v1.2.0-beta',
      description: '测试版本 - 新UI设计',
      timestamp: Date.now() - 259200000, // 3天前
      author: '赵六',
      authorAvatar: '🎨',
      type: 'beta',
      branch: 'feature/ui-redesign',
      size: '3.1 MB',
      changeCount: 234,
      tags: ['测试版', 'UI重设计', '实验性'],
      status: 'beta',
      changes: {
        added: 156,
        modified: 67,
        deleted: 11,
        blocksChanged: 89,
        filesChanged: 24
      },
      content: {
        blockCount: 78,
        wordCount: 4120,
        imageCount: 18,
        tableCount: 12
      },
      collaborators: ['赵六', '孙七', '周八'],
      reviewStatus: 'in_review',
      deployStatus: 'staging',
      performance: {
        loadTime: '1.3s',
        bundleSize: '3.1MB',
        optimizationScore: 82
      },
      commits: [
        { hash: 'g7h8i9j', message: '重构用户界面', author: '赵六', time: Date.now() - 259200000 },
        { hash: 'k1l2m3n', message: '添加新的交互组件', author: '孙七', time: Date.now() - 259100000 },
        { hash: 'o4p5q6r', message: '优化响应式布局', author: '周八', time: Date.now() - 259000000 }
      ]
    },
    {
      id: 'current',
      description: '当前工作版本',
      timestamp: Date.now() - 3600000, // 1小时前
      author: '当前用户',
      authorAvatar: '👤',
      type: 'auto',
      branch: 'main',
      size: '3.2 MB',
      changeCount: 45,
      tags: ['工作中', '未发布'],
      status: 'draft',
      changes: {
        added: 23,
        modified: 18,
        deleted: 4,
        blocksChanged: 12,
        filesChanged: 6
      },
      content: {
        blockCount: 82,
        wordCount: 4380,
        imageCount: 20,
        tableCount: 14
      },
      collaborators: ['当前用户'],
      reviewStatus: 'draft',
      deployStatus: 'local',
      performance: {
        loadTime: '1.1s',
        bundleSize: '3.2MB',
        optimizationScore: 85
      },
      commits: [
        { hash: 's7t8u9v', message: '更新模板中心功能', author: '当前用户', time: Date.now() - 7200000 },
        { hash: 'w1x2y3z', message: '改进搜索算法', author: '当前用户', time: Date.now() - 3600000 }
      ]
    }
  ]);

  const branches = [
    { name: 'main', color: '#10b981', commits: 45, lastUpdate: Date.now() - 3600000 },
    { name: 'feature/enhancements', color: '#3b82f6', commits: 23, lastUpdate: Date.now() - 1296000000 },
    { name: 'hotfix/critical-fixes', color: '#ef4444', commits: 8, lastUpdate: Date.now() - 604800000 },
    { name: 'feature/ui-redesign', color: '#8b5cf6', commits: 34, lastUpdate: Date.now() - 259200000 }
  ];

  const availableTags = [
    '发布', '稳定版', '功能增强', '优化', '修复', '紧急', '测试版', 'UI重设计', '实验性', '工作中', '未发布'
  ];

  // 筛选和排序版本
  const filteredAndSortedVersions = enhancedVersions
    .filter(version => {
      const matchesSearch = version.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           version.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           version.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filterBy === 'all' || version.type === filterBy;
      const matchesBranch = version.branch === selectedBranch || selectedBranch === 'all';
      const matchesTag = !selectedTag || version.tags.includes(selectedTag);
      
      return matchesSearch && matchesFilter && matchesBranch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'name':
          return a.description.localeCompare(b.description);
        case 'changes':
          return b.changeCount - a.changeCount;
        default: // newest
          return b.timestamp - a.timestamp;
      }
    });

  const getVersionTypeColor = (type) => {
    switch (type) {
      case 'major': return '#ef4444';
      case 'minor': return '#3b82f6';
      case 'patch': return '#10b981';
      case 'beta': return '#8b5cf6';
      case 'auto': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#10b981';
      case 'stable': return '#3b82f6';
      case 'hotfix': return '#ef4444';
      case 'beta': return '#8b5cf6';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getReviewStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={14} style={{ color: '#10b981' }} />;
      case 'in_review': return <AlertCircle size={14} style={{ color: '#f59e0b' }} />;
      case 'emergency': return <Zap size={14} style={{ color: '#ef4444' }} />;
      case 'draft': return <Edit size={14} style={{ color: '#6b7280' }} />;
      default: return <Info size={14} style={{ color: '#6b7280' }} />;
    }
  };

  const handleCreateVersion = () => {
    const newVersion = {
      id: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      description: newVersionDescription || '手动保存',
      timestamp: Date.now(),
      author: '当前用户',
      authorAvatar: '👤',
      type: 'manual',
      branch: selectedBranch,
      size: '3.3 MB',
      changeCount: Math.floor(Math.random() * 50) + 10,
      tags: ['手动保存'],
      status: 'draft',
      changes: {
        added: Math.floor(Math.random() * 20),
        modified: Math.floor(Math.random() * 30),
        deleted: Math.floor(Math.random() * 10),
        blocksChanged: Math.floor(Math.random() * 15),
        filesChanged: Math.floor(Math.random() * 8)
      },
      content: {
        blockCount: 85,
        wordCount: 4500,
        imageCount: 22,
        tableCount: 16
      },
      collaborators: ['当前用户'],
      reviewStatus: 'draft',
      deployStatus: 'local',
      performance: {
        loadTime: '1.2s',
        bundleSize: '3.3MB',
        optimizationScore: 83
      },
      commits: []
    };

    setEnhancedVersions(prev => [newVersion, ...prev]);
    setNewVersionDescription('');
    setShowCreateForm(false);
  };

  const handleRestoreVersion = (version) => {
    loadVersion(version.id);
    setSelectedVersion(version);
  };

  const toggleCompareVersion = (version) => {
    if (compareVersions.includes(version.id)) {
      setCompareVersions(prev => prev.filter(id => id !== version.id));
    } else if (compareVersions.length < 2) {
      setCompareVersions(prev => [...prev, version.id]);
    }
  };

  const renderVersionCard = (version, index) => {
    const isSelected = selectedVersion?.id === version.id;
    const isCompareSelected = compareVersions.includes(version.id);
    const isLatest = index === 0;

    return (
      <div
        key={version.id}
        onClick={() => setSelectedVersion(version)}
        style={{
          position: 'relative',
          padding: '20px',
          border: isSelected 
            ? `2px solid ${getVersionTypeColor(version.type)}` 
            : isCompareSelected 
              ? '2px solid #8b5cf6'
              : '1px solid #e5e7eb',
          borderRadius: '12px',
          cursor: 'pointer',
          marginBottom: '16px',
          backgroundColor: isSelected 
            ? '#fef7f7' 
            : isCompareSelected 
              ? '#faf5ff'
              : '#ffffff',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          if (!isSelected && !isCompareSelected) {
            e.target.style.borderColor = '#cbd5e1';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected && !isCompareSelected) {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        {/* 最新版本标记 */}
        {isLatest && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#10b981',
            color: 'white',
            fontSize: '10px',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: '600'
          }}>
            最新
          </div>
        )}

        {/* 版本头部 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              backgroundColor: '#f3f4f6',
              border: `2px solid ${getVersionTypeColor(version.type)}`
            }}>
              {version.authorAvatar}
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  margin: 0
                }}>
                  {version.id}
                </h3>
                <span style={{
                  backgroundColor: getVersionTypeColor(version.type),
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  textTransform: 'uppercase'
                }}>
                  {version.type}
                </span>
                <span style={{
                  backgroundColor: getStatusColor(version.status),
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}>
                  {version.status}
                </span>
              </div>
              
              <p style={{ 
                fontSize: '16px', 
                color: '#374151', 
                margin: '0 0 6px 0',
                fontWeight: '500'
              }}>
                {version.description}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#6b7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} />
                  {version.author}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  {new Date(version.timestamp).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GitBranch size={12} />
                  {version.branch}
                </span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {compareMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompareVersion(version);
                }}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isCompareSelected ? '#8b5cf6' : '#f3f4f6',
                  color: isCompareSelected ? 'white' : '#6b7280'
                }}
                disabled={!isCompareSelected && compareVersions.length >= 2}
              >
                {isCompareSelected ? <CheckCircle size={14} /> : <Plus size={14} />}
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestoreVersion(version);
              }}
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#f3f4f6',
                color: '#6b7280'
              }}
              title="恢复到此版本"
            >
              <RotateCcw size={14} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(version.id);
              }}
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#f3f4f6',
                color: '#6b7280'
              }}
              title="复制版本ID"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* 标签 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {version.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '12px',
                fontWeight: '500'
              }}
            >
              #{tag}
            </span>
          ))}
          {version.tags.length > 3 && (
            <span style={{ color: '#9ca3af', fontSize: '11px' }}>
              +{version.tags.length - 3}
            </span>
          )}
        </div>

        {/* 变更统计 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '12px', 
          marginBottom: '12px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
              +{version.changes.added}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>新增</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>
              ~{version.changes.modified}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>修改</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>
              -{version.changes.deleted}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>删除</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#6b7280' }}>
              {version.changeCount}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>总计</div>
          </div>
        </div>

        {/* 状态信息 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#6b7280',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getReviewStatusIcon(version.reviewStatus)}
            <span>审核状态: {version.reviewStatus}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={12} />
            <span>{version.size}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={12} />
            <span>{version.performance.optimizationScore}分</span>
          </div>
        </div>
      </div>
    );
  };

  const renderVersionDetail = () => {
    if (!selectedVersion) {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <div>
            <History size={64} style={{ 
              margin: '0 auto 20px', 
              opacity: 0.5,
              display: 'block'
            }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>选择版本查看详情</h3>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>
              点击左侧任意版本<br />查看详细信息和变更记录
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* 版本详情头部 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              backgroundColor: '#ffffff',
              border: `3px solid ${getVersionTypeColor(selectedVersion.type)}`
            }}>
              {selectedVersion.authorAvatar}
            </div>
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                {selectedVersion.id}
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: '#6b7280', 
                margin: 0
              }}>
                {selectedVersion.description}
              </p>
            </div>
          </div>

          {/* 快速操作 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button
              onClick={() => handleRestoreVersion(selectedVersion)}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={16} />
              恢复版本
            </button>
            
            <button
              onClick={() => navigator.clipboard.writeText(selectedVersion.id)}
              style={{
                padding: '10px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Copy size={16} />
            </button>
            
            <button
              onClick={() => {/* 下载功能 */}}
              style={{
                padding: '10px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* 版本统计 */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BarChart3 size={18} />
            版本统计
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>内容块数量</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                {selectedVersion.content.blockCount}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>总字数</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                {selectedVersion.content.wordCount.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>图片数量</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                {selectedVersion.content.imageCount}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>表格数量</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                {selectedVersion.content.tableCount}
              </div>
            </div>
          </div>

          {/* 变更详情 */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              变更详情
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
              <span style={{ color: '#10b981' }}>+{selectedVersion.changes.added} 新增</span>
              <span style={{ color: '#3b82f6' }}>~{selectedVersion.changes.modified} 修改</span>
              <span style={{ color: '#ef4444' }}>-{selectedVersion.changes.deleted} 删除</span>
            </div>
          </div>
        </div>

        {/* 协作信息 */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <User size={18} />
            协作信息
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>参与者</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedVersion.collaborators.map((collaborator, index) => (
                <div
                  key={index}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#eff6ff',
                    color: '#1e40af',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {collaborator}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>审核状态</div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: selectedVersion.reviewStatus === 'approved' ? '#10b981' : 
                       selectedVersion.reviewStatus === 'in_review' ? '#f59e0b' : '#6b7280'
              }}>
                {getReviewStatusIcon(selectedVersion.reviewStatus)}
                {selectedVersion.reviewStatus}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>部署状态</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {selectedVersion.deployStatus}
              </div>
            </div>
          </div>
        </div>

        {/* 性能指标 */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Activity size={18} />
            性能指标
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>加载时间</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{selectedVersion.performance.loadTime}</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>包大小</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{selectedVersion.performance.bundleSize}</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>优化评分</span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: selectedVersion.performance.optimizationScore >= 85 ? '#10b981' : 
                         selectedVersion.performance.optimizationScore >= 70 ? '#f59e0b' : '#ef4444'
                }}>
                  {selectedVersion.performance.optimizationScore}/100
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: '#f1f5f9', 
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${selectedVersion.performance.optimizationScore}%`, 
                  height: '100%', 
                  backgroundColor: selectedVersion.performance.optimizationScore >= 85 ? '#10b981' : 
                                   selectedVersion.performance.optimizationScore >= 70 ? '#f59e0b' : '#ef4444',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 提交记录 */}
        {selectedVersion.commits && selectedVersion.commits.length > 0 && (
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '20px', 
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <GitCommit size={18} />
              提交记录
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedVersion.commits.map((commit, index) => (
                <div
                  key={commit.hash}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    borderLeft: '3px solid #3b82f6'
                  }}
                >
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '4px'
                  }}>
                    {commit.message}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <code style={{ 
                      backgroundColor: '#e5e7eb', 
                      padding: '2px 4px', 
                      borderRadius: '3px',
                      fontSize: '11px'
                    }}>
                      {commit.hash}
                    </code>
                    <span>{commit.author}</span>
                    <span>•</span>
                    <span>{new Date(commit.time).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#ffffff' 
    }}>
      {/* 顶部工具栏 */}
      <div style={{ 
        padding: '20px 24px', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#111827', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <History size={28} />
              版本历史
            </h2>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCompareMode(!compareMode)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: compareMode ? '#8b5cf6' : '#f3f4f6',
                  color: compareMode ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <GitMerge size={16} />
                {compareMode ? '退出对比' : '版本对比'}
              </button>
              
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                创建版本
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              color: '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '8px',
              borderRadius: '6px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={24} />
          </button>
        </div>

        {/* 搜索和筛选 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search 
              size={16} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}
            />
            <input
              type="text"
              placeholder="搜索版本描述、作者或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '12px',
                paddingTop: '10px',
                paddingBottom: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">所有类型</option>
            <option value="major">主版本</option>
            <option value="minor">次版本</option>
            <option value="patch">补丁版本</option>
            <option value="beta">测试版本</option>
            <option value="auto">自动保存</option>
          </select>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">所有分支</option>
            {branches.map(branch => (
              <option key={branch.name} value={branch.name}>{branch.name}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="newest">最新优先</option>
            <option value="oldest">最旧优先</option>
            <option value="name">按名称</option>
            <option value="changes">按变更数</option>
          </select>
        </div>

        {/* 创建版本表单 */}
        {showCreateForm && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '6px' 
                }}>
                  版本描述
                </label>
                <input
                  type="text"
                  placeholder="输入版本描述..."
                  value={newVersionDescription}
                  onChange={(e) => setNewVersionDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <button
                onClick={handleCreateVersion}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                创建
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 统计信息 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span>显示 {filteredAndSortedVersions.length} 个版本</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>当前分支: {selectedBranch}</span>
            {compareMode && (
              <span style={{ color: '#8b5cf6', fontWeight: '500' }}>
                对比模式 ({compareVersions.length}/2)
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧版本列表 */}
        <div style={{ 
          width: '60%', 
          padding: '24px', 
          overflowY: 'auto',
          backgroundColor: '#fafbfc'
        }}>
          {filteredAndSortedVersions.length > 0 ? (
            filteredAndSortedVersions.map((version, index) => renderVersionCard(version, index))
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '14px',
              marginTop: '60px'
            }}>
              <History size={48} style={{ 
                color: '#d1d5db', 
                margin: '0 auto 16px',
                display: 'block'
              }} />
              <p>没有找到匹配的版本</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>
                尝试调整搜索关键词或筛选条件
              </p>
            </div>
          )}

          {/* 对比模式提示 */}
          {compareMode && compareVersions.length === 2 && (
            <div style={{
              position: 'sticky',
              bottom: '20px',
              padding: '16px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                已选择 2 个版本进行对比
              </div>
              <button
                onClick={() => setShowVersionComparison(true)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: 'white',
                  color: '#8b5cf6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  marginRight: '8px'
                }}
              >
                查看对比结果
              </button>
              <button
                onClick={() => setCompareVersions([])}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                清除选择
              </button>
            </div>
          )}
        </div>

        {/* 右侧详情面板 */}
        <div style={{ 
          width: '40%', 
          borderLeft: '1px solid #e5e7eb', 
          backgroundColor: '#fafbfc',
          padding: '24px',
          overflowY: 'auto'
        }}>
          {renderVersionDetail()}
        </div>
      </div>
    </div>
  );
};

export default VersionPanelEnhanced;
