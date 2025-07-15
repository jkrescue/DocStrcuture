import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, Tag, Clock, FileText, ChevronDown, X } from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const SearchPanel = ({ onClose, onSelectBlock }) => {
  const { blocks, searchBlocks } = useDocStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    blockType: 'all',
    dateRange: 'all',
    author: 'all',
    tags: []
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 模拟搜索结果数据
  const [searchHistory, setSearchHistory] = useState([
    '项目需求', '会议纪要', '用户反馈', '技术文档'
  ]);

  const blockTypes = [
    { id: 'all', name: '全部类型' },
    { id: 'text', name: '文本块' },
    { id: 'field', name: '字段块' },
    { id: 'table', name: '表格块' },
    { id: 'reference', name: '引用块' }
  ];

  const dateRanges = [
    { id: 'all', name: '全部时间' },
    { id: 'today', name: '今天' },
    { id: 'week', name: '本周' },
    { id: 'month', name: '本月' },
    { id: 'quarter', name: '本季度' }
  ];

  const authors = [
    { id: 'all', name: '全部作者' },
    { id: 'me', name: '我创建的' },
    { id: 'zhangsan', name: '张三' },
    { id: 'lisi', name: '李四' },
    { id: 'wangwu', name: '王五' }
  ];

  const availableTags = [
    '重要', '紧急', '待审核', '已完成', '进行中', '已暂停'
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchBlocks(searchQuery);
      // 模拟更丰富的搜索结果
      const enhancedResults = results.map(block => ({
        ...block,
        highlight: getHighlight(block, searchQuery),
        lastModified: new Date(block.metadata.updatedAt).toLocaleDateString(),
        author: '当前用户',
        tags: getBlockTags(block)
      }));
      setSearchResults(enhancedResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, blocks, searchBlocks]);

  const getHighlight = (block, query) => {
    const content = JSON.stringify(block.content).toLowerCase();
    const queryLower = query.toLowerCase();
    const index = content.indexOf(queryLower);
    if (index !== -1) {
      const start = Math.max(0, index - 20);
      const end = Math.min(content.length, index + query.length + 20);
      return content.substring(start, end);
    }
    return '';
  };

  const getBlockTags = (block) => {
    // 根据块类型和内容生成标签
    const tags = [block.type];
    if (block.content.value) tags.push('有数据');
    if (block.metadata.locked) tags.push('已锁定');
    return tags;
  };

  const getBlockIcon = (type) => {
    switch (type) {
      case 'text': return '📄';
      case 'field': return '📝';
      case 'table': return '📊';
      case 'reference': return '🔗';
      default: return '📄';
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
    }
  };

  const handleSelectBlock = (block) => {
    onSelectBlock?.(block);
    onClose?.();
  };

  const addToSearchHistory = (query) => {
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
    }
  };

  const removeFromHistory = (query) => {
    setSearchHistory(prev => prev.filter(item => item !== query));
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'white'
    }}>
      {/* 头部搜索区域 */}
      <div style={{ 
        padding: '20px 40px', 
        borderBottom: '1px solid #f1f5f9',
        backgroundColor: 'white'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#1f2937',
            margin: 0 
          }}>
            全局搜索
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            margin: '4px 0 0 0' 
          }}>
            在所有文档和内容块中搜索
          </p>
        </div>

        {/* 主搜索框 */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} 
            size={20} 
          />
          <input
            type="text"
            placeholder="搜索文档内容、标题、字段..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              fontSize: '16px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* 高级筛选 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            <Filter size={16} />
            <span>高级筛选</span>
            <ChevronDown 
              size={16} 
              style={{
                transform: showAdvancedFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </button>
          
          {searchQuery && (
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              找到 {searchResults.length} 个结果
            </div>
          )}
        </div>

        {/* 高级筛选面板 */}
        {showAdvancedFilters && (
          <div style={{ 
            marginTop: '16px', 
            padding: '16px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px' 
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '4px' 
                }}>
                  块类型
                </label>
                <select
                  value={filters.blockType}
                  onChange={(e) => setFilters(prev => ({ ...prev, blockType: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  {blockTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '4px' 
                }}>
                  时间范围
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  {dateRanges.map(range => (
                    <option key={range.id} value={range.id}>{range.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '4px' 
                }}>
                  作者
                </label>
                <select
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  {authors.map(author => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '4px' 
                }}>
                  标签
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {availableTags.slice(0, 3).map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        const newTags = filters.tags.includes(tag)
                          ? filters.tags.filter(t => t !== tag)
                          : [...filters.tags, tag];
                        setFilters(prev => ({ ...prev, tags: newTags }));
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: filters.tags.includes(tag) ? '#eff6ff' : '#f3f4f6',
                        color: filters.tags.includes(tag) ? '#1d4ed8' : '#6b7280'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 主内容区域 */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧搜索结果 */}
        <div style={{ flex: 1, padding: '20px 40px', overflow: 'auto' }}>
          {!searchQuery ? (
            <div>
              {/* 搜索建议 */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  fontWeight: '500', 
                  color: '#1f2937', 
                  marginBottom: '12px', 
                  fontSize: '16px' 
                }}>
                  搜索建议
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '12px' 
                }}>
                  <button style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    textAlign: 'left',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = '#93c5fd'}
                  onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>📄 最近的文档</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>查看最近编辑的内容</div>
                  </button>
                  <button style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    textAlign: 'left',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = '#93c5fd'}
                  onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>📝 待处理项目</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>查看需要完成的任务</div>
                  </button>
                  <button style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    textAlign: 'left',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = '#93c5fd'}
                  onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>🔗 引用关系</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>探索文档间的联系</div>
                  </button>
                  <button style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    textAlign: 'left',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = '#93c5fd'}
                  onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>📊 数据统计</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>查看表格和数据分析</div>
                  </button>
                </div>
              </div>

              {/* 搜索历史 */}
              {searchHistory.length > 0 && (
                <div>
                  <h3 style={{ 
                    fontWeight: '500', 
                    color: '#1f2937', 
                    marginBottom: '12px', 
                    fontSize: '16px' 
                  }}>
                    最近搜索
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {searchHistory.map((query, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <button
                          onClick={() => handleSearch(query)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#6b7280',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <Clock size={14} />
                          <span>{query}</span>
                        </button>
                        <button
                          onClick={() => removeFromHistory(query)}
                          style={{
                            color: '#9ca3af',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* 搜索结果 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {searchResults.map((block, index) => (
                  <div
                    key={block.id}
                    onClick={() => handleSelectBlock(block)}
                    style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#93c5fd';
                      e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      justifyContent: 'space-between', 
                      marginBottom: '8px' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{getBlockIcon(block.type)}</span>
                        <div>
                          <div style={{ fontWeight: '500', color: '#1f2937' }}>
                            {block.type === 'text' && block.content.text?.split('\n')[0]}
                            {block.type === 'field' && block.content.label}
                            {block.type === 'table' && block.content.title}
                            {block.type === 'reference' && '引用块'}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {block.type} • {block.lastModified} • {block.author}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {block.tags.map(tag => (
                          <span
                            key={tag}
                            style={{
                              padding: '2px 8px',
                              fontSize: '12px',
                              backgroundColor: '#f3f4f6',
                              color: '#6b7280',
                              borderRadius: '4px'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {block.highlight && (
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        backgroundColor: '#fefce8',
                        padding: '8px',
                        borderRadius: '4px'
                      }}>
                        ...{block.highlight}...
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {searchResults.length === 0 && searchQuery && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '48px 20px', 
                  color: '#6b7280' 
                }}>
                  <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '18px', marginBottom: '8px' }}>未找到相关内容</p>
                  <p>尝试调整搜索关键词或使用高级筛选</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右侧快捷操作 */}
        <div style={{ 
          width: '320px', 
          borderLeft: '1px solid #e5e7eb', 
          backgroundColor: '#f8fafc', 
          padding: '20px' 
        }}>
          <h3 style={{ 
            fontWeight: '500', 
            color: '#1f2937', 
            marginBottom: '16px', 
            fontSize: '16px' 
          }}>
            快捷操作
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#93c5fd'}
            onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: '#2563eb' }} />
                <span style={{ fontWeight: '500' }}>新建文档</span>
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                创建一个新的文档
              </div>
            </button>

            <button style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#93c5fd'}
            onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={16} style={{ color: '#059669' }} />
                <span style={{ fontWeight: '500' }}>管理标签</span>
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                添加或编辑标签
              </div>
            </button>

            <button style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#93c5fd'}
            onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: '#7c3aed' }} />
                <span style={{ fontWeight: '500' }}>查看日历</span>
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                按时间查看文档
              </div>
            </button>
          </div>

          {/* 统计信息 */}
          <div style={{ marginTop: '32px' }}>
            <h4 style={{ 
              fontWeight: '500', 
              color: '#1f2937', 
              marginBottom: '12px', 
              fontSize: '16px' 
            }}>
              文档统计
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>总文档数:</span>
                <span style={{ color: '#374151' }}>{blocks.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>本周新增:</span>
                <span style={{ color: '#374151' }}>12</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>待处理:</span>
                <span style={{ color: '#374151' }}>5</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>我的收藏:</span>
                <span style={{ color: '#374151' }}>8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;