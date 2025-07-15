import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Filter, Calendar, User, Tag, Clock, FileText, ChevronDown, X, Star, Archive, Eye, MessageSquare, ArrowUpRight, Copy, Share2, BookOpen } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState('relevance');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [savedSearches, setSavedSearches] = useState([
    { id: 1, name: '重要文档', query: '重要|紧急', filters: { tags: ['重要'] } },
    { id: 2, name: '本周更新', query: '', filters: { dateRange: 'week' } },
    { id: 3, name: '我的表格', query: '', filters: { blockType: 'table', author: 'me' } }
  ]);
  const searchInputRef = useRef(null);

  const [searchHistory, setSearchHistory] = useState([
    { query: '项目需求', timestamp: Date.now() - 86400000, resultCount: 15 },
    { query: '会议纪要', timestamp: Date.now() - 172800000, resultCount: 8 },
    { query: '用户反馈', timestamp: Date.now() - 259200000, resultCount: 23 },
    { query: '技术文档', timestamp: Date.now() - 345600000, resultCount: 42 }
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

  // 智能搜索建议生成
  const generateSuggestions = (query) => {
    if (!query.trim()) return [];
    
    const allContent = blocks.flatMap(block => {
      const words = JSON.stringify(block.content).match(/[\u4e00-\u9fff\w]+/g) || [];
      return words.filter(word => word.length > 1);
    });
    
    const uniqueWords = [...new Set(allContent)];
    return uniqueWords
      .filter(word => word.toLowerCase().includes(query.toLowerCase()) && word !== query)
      .slice(0, 8);
  };

  // 高级搜索逻辑
  const performAdvancedSearch = useMemo(() => {
    let results = searchBlocks(searchQuery);
    
    // 应用过滤器
    if (filters.blockType !== 'all') {
      results = results.filter(block => block.type === filters.blockType);
    }
    
    if (filters.author !== 'all') {
      results = results.filter(block => {
        if (filters.author === 'me') return block.metadata.author === '当前用户';
        return true;
      });
    }
    
    if (filters.dateRange !== 'all') {
      const now = new Date();
      results = results.filter(block => {
        const blockDate = new Date(block.metadata.updatedAt);
        switch (filters.dateRange) {
          case 'today': return blockDate.toDateString() === now.toDateString();
          case 'week': return (now - blockDate) < 7 * 24 * 60 * 60 * 1000;
          case 'month': return (now - blockDate) < 30 * 24 * 60 * 60 * 1000;
          case 'quarter': return (now - blockDate) < 90 * 24 * 60 * 60 * 1000;
          default: return true;
        }
      });
    }
    
    // 增强结果信息
    const enhancedResults = results.map(block => ({
      ...block,
      highlight: getHighlight(block, searchQuery),
      lastModified: new Date(block.metadata.updatedAt).toLocaleDateString(),
      author: block.metadata.author || '当前用户',
      tags: getBlockTags(block),
      relevanceScore: calculateRelevance(block, searchQuery)
    }));
    
    // 排序
    return enhancedResults.sort((a, b) => {
      switch (sortBy) {
        case 'date': return new Date(b.metadata.updatedAt) - new Date(a.metadata.updatedAt);
        case 'type': return a.type.localeCompare(b.type);
        default: return b.relevanceScore - a.relevanceScore;
      }
    });
  }, [searchQuery, filters, sortBy, blocks, searchBlocks]);

  // 计算相关性得分
  const calculateRelevance = (block, query) => {
    if (!query) return 0;
    const content = JSON.stringify(block.content).toLowerCase();
    const queryLower = query.toLowerCase();
    
    let score = 0;
    const queryWords = queryLower.split(/\s+/);
    
    queryWords.forEach(word => {
      const occurrences = (content.match(new RegExp(word, 'g')) || []).length;
      score += occurrences * 10;
      
      if (block.type === 'text' && block.content.text && 
          block.content.text.toLowerCase().includes(word)) {
        score += 50;
      }
      
      if (block.type === 'field' && block.content.label && 
          block.content.label.toLowerCase().includes(word)) {
        score += 30;
      }
    });
    
    return score;
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(performAdvancedSearch);
      setSuggestions(generateSuggestions(searchQuery));
    } else {
      setSearchResults([]);
      setSuggestions([]);
    }
  }, [searchQuery, performAdvancedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setSuggestions(generateSuggestions(searchQuery));
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    if (query && !searchHistory.find(item => item.query === query)) {
      const newHistoryItem = {
        query,
        timestamp: Date.now(),
        resultCount: 0
      };
      setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
    }
    setShowSuggestions(false);
  };

  const handleSelectBlock = (block) => {
    onSelectBlock?.(block);
    onClose?.();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleQuickFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSaveSearch = () => {
    if (searchQuery.trim()) {
      const newSavedSearch = {
        id: Date.now(),
        name: searchQuery,
        query: searchQuery,
        filters: { ...filters }
      };
      setSavedSearches(prev => [newSavedSearch, ...prev]);
    }
  };

  const loadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
  };

  const removeFromHistory = (queryToRemove) => {
    setSearchHistory(prev => prev.filter(item => item.query !== queryToRemove));
  };

  const copyBlockContent = (block) => {
    const content = JSON.stringify(block.content, null, 2);
    navigator.clipboard.writeText(content);
  };

  const shareBlock = (block) => {
    const shareUrl = `${window.location.origin}#block=${block.id}`;
    navigator.clipboard.writeText(shareUrl);
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
            ref={searchInputRef}
            type="text"
            placeholder="搜索文档内容、标题、字段..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            onFocus={() => {
              setSearchFocus(true);
              if (searchQuery.trim()) setShowSuggestions(true);
            }}
            onBlur={() => {
              setSearchFocus(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: searchQuery ? '80px' : '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              border: `1px solid ${searchFocus ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '8px',
              outline: 'none',
              fontSize: '16px',
              transition: 'border-color 0.2s ease'
            }}
          />
          
          {/* 搜索操作按钮 */}
          {searchQuery && (
            <div style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: '4px'
            }}>
              <button
                onClick={handleSaveSearch}
                title="保存搜索"
                style={{
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <Star size={16} />
              </button>
              <button
                onClick={() => setSearchQuery('')}
                title="清除搜索"
                style={{
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* 搜索建议下拉 */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              marginTop: '4px'
            }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Search size={14} style={{ color: '#9ca3af' }} />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 高级筛选和工具栏 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            
            {/* 快速过滤按钮 */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { key: 'text', label: '文本', icon: '📄' },
                { key: 'table', label: '表格', icon: '📊' },
                { key: 'field', label: '字段', icon: '📝' }
              ].map(type => (
                <button
                  key={type.key}
                  onClick={() => handleQuickFilter('blockType', filters.blockType === type.key ? 'all' : type.key)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: filters.blockType === type.key ? '#3b82f6' : 'white',
                    color: filters.blockType === type.key ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 排序选项 */}
            {searchQuery && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: 'white'
                }}
              >
                <option value="relevance">相关性</option>
                <option value="date">最新修改</option>
                <option value="type">类型</option>
              </select>
            )}
            
            {searchQuery && (
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                找到 {searchResults.length} 个结果
              </div>
            )}
          </div>
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
              {/* 已保存的搜索 */}
              {savedSearches.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Star size={16} />
                    已保存的搜索
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {savedSearches.map(savedSearch => (
                      <div
                        key={savedSearch.id}
                        onClick={() => loadSavedSearch(savedSearch)}
                        style={{
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: '1px solid transparent',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e2e8f0';
                          e.target.style.borderColor = '#cbd5e1';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f8fafc';
                          e.target.style.borderColor = 'transparent';
                        }}
                      >
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          {savedSearch.name}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6b7280'
                        }}>
                          {savedSearch.query || '筛选条件搜索'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 搜索历史 */}
              {searchHistory.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Clock size={16} />
                    最近搜索
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {searchHistory.slice(0, 6).map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => handleSearch(item.query)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Search size={14} style={{ color: '#9ca3af' }} />
                          <span style={{ fontSize: '14px', color: '#374151' }}>
                            {item.query}
                          </span>
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#9ca3af',
                            backgroundColor: '#f1f5f9',
                            padding: '2px 6px',
                            borderRadius: '10px'
                          }}>
                            {item.resultCount} 个结果
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(item.query);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#9ca3af',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 快速开始提示 */}
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px',
                marginTop: '40px'
              }}>
                <BookOpen size={48} style={{ 
                  color: '#d1d5db', 
                  margin: '0 auto 16px',
                  display: 'block'
                }} />
                <p>输入关键词开始搜索</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>
                  支持文本内容、字段标签、表格数据搜索
                </p>
              </div>
            </div>
          ) : (
            /* 搜索结果 */
            <div>
              {searchResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {searchResults.map(block => (
                    <div
                      key={block.id}
                      onClick={() => handleSelectBlock(block)}
                      style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {/* 搜索结果头部 */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>{getBlockIcon(block.type)}</span>
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#6b7280',
                            backgroundColor: '#f1f5f9',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {block.type === 'text' ? '文本块' : 
                             block.type === 'field' ? '字段块' : 
                             block.type === 'table' ? '表格块' : 
                             block.type === 'reference' ? '引用块' : '未知'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                            相关性: {Math.round(block.relevanceScore || 0)}%
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyBlockContent(block);
                            }}
                            title="复制内容"
                            style={{
                              padding: '4px',
                              background: 'none',
                              border: 'none',
                              color: '#6b7280',
                              cursor: 'pointer',
                              borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              shareBlock(block);
                            }}
                            title="分享"
                            style={{
                              padding: '4px',
                              background: 'none',
                              border: 'none',
                              color: '#6b7280',
                              cursor: 'pointer',
                              borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <Share2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* 搜索结果内容 */}
                      <div style={{ marginBottom: '8px' }}>
                        {block.type === 'text' && (
                          <div style={{ 
                            fontSize: '14px', 
                            color: '#374151',
                            lineHeight: '1.5'
                          }}>
                            {block.content.text ? 
                              block.content.text.substring(0, 200) + (block.content.text.length > 200 ? '...' : '') 
                              : '空文本块'
                            }
                          </div>
                        )}
                        
                        {block.type === 'field' && (
                          <div style={{ fontSize: '14px', color: '#374151' }}>
                            <strong>{block.content.label}:</strong> {block.content.value || '未填写'}
                          </div>
                        )}
                        
                        {block.type === 'table' && (
                          <div style={{ fontSize: '14px', color: '#374151' }}>
                            <strong>{block.content.title}</strong>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                              {block.content.data ? `${block.content.data.length - 1} 行数据` : '空表格'}
                            </div>
                          </div>
                        )}
                        
                        {block.type === 'reference' && (
                          <div style={{ fontSize: '14px', color: '#374151' }}>
                            引用: {block.content.sourceType} 块
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                              同步状态: {block.content.syncStatus === 'synced' ? '已同步' : '待同步'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 搜索结果元信息 */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span>修改时间: {block.lastModified}</span>
                          <span>作者: {block.author}</span>
                        </div>
                        
                        {block.tags && block.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {block.tags.slice(0, 3).map(tag => (
                              <span 
                                key={tag}
                                style={{
                                  backgroundColor: '#dbeafe',
                                  color: '#1e40af',
                                  padding: '2px 6px',
                                  borderRadius: '10px',
                                  fontSize: '10px'
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '14px',
                  marginTop: '40px'
                }}>
                  <Search size={48} style={{ 
                    color: '#d1d5db', 
                    margin: '0 auto 16px',
                    display: 'block'
                  }} />
                  <p>未找到匹配的内容</p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>
                    尝试使用不同的关键词或调整筛选条件
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
