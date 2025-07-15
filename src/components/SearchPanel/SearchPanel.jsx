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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* 头部搜索区域 */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">搜索文档</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* 主搜索框 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索文档内容、标题、字段..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          {/* 高级筛选 */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <Filter size={16} />
              <span>高级筛选</span>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
              />
            </button>
            
            {searchQuery && (
              <div className="text-sm text-gray-500">
                找到 {searchResults.length} 个结果
              </div>
            )}
          </div>

          {/* 高级筛选面板 */}
          {showAdvancedFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">块类型</label>
                  <select
                    value={filters.blockType}
                    onChange={(e) => setFilters(prev => ({ ...prev, blockType: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {blockTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">时间范围</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {dateRanges.map(range => (
                      <option key={range.id} value={range.id}>{range.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                  <select
                    value={filters.author}
                    onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {authors.map(author => (
                      <option key={author.id} value={author.id}>{author.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                  <div className="flex flex-wrap gap-1">
                    {availableTags.slice(0, 3).map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          const newTags = filters.tags.includes(tag)
                            ? filters.tags.filter(t => t !== tag)
                            : [...filters.tags, tag];
                          setFilters(prev => ({ ...prev, tags: newTags }));
                        }}
                        className={`px-2 py-1 text-xs rounded ${
                          filters.tags.includes(tag)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
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
        <div className="flex-1 flex">
          {/* 左侧搜索结果 */}
          <div className="flex-1 p-6">
            {!searchQuery ? (
              <div>
                {/* 搜索建议 */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">搜索建议</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 border border-gray-200 rounded-lg text-left hover:border-blue-300 transition-colors">
                      <div className="font-medium text-gray-800">📄 最近的文档</div>
                      <div className="text-sm text-gray-500">查看最近编辑的内容</div>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg text-left hover:border-blue-300 transition-colors">
                      <div className="font-medium text-gray-800">📝 待处理项目</div>
                      <div className="text-sm text-gray-500">查看需要完成的任务</div>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg text-left hover:border-blue-300 transition-colors">
                      <div className="font-medium text-gray-800">🔗 引用关系</div>
                      <div className="text-sm text-gray-500">探索文档间的联系</div>
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg text-left hover:border-blue-300 transition-colors">
                      <div className="font-medium text-gray-800">📊 数据统计</div>
                      <div className="text-sm text-gray-500">查看表格和数据分析</div>
                    </button>
                  </div>
                </div>

                {/* 搜索历史 */}
                {searchHistory.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">最近搜索</h3>
                    <div className="space-y-2">
                      {searchHistory.map((query, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded group"
                        >
                          <button
                            onClick={() => handleSearch(query)}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                          >
                            <Clock size={14} />
                            <span>{query}</span>
                          </button>
                          <button
                            onClick={() => removeFromHistory(query)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
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
                <div className="space-y-4">
                  {searchResults.map((block, index) => (
                    <div
                      key={block.id}
                      onClick={() => handleSelectBlock(block)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getBlockIcon(block.type)}</span>
                          <div>
                            <div className="font-medium text-gray-800">
                              {block.type === 'text' && block.content.text?.split('\n')[0]}
                              {block.type === 'field' && block.content.label}
                              {block.type === 'table' && block.content.title}
                              {block.type === 'reference' && '引用块'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {block.type} • {block.lastModified} • {block.author}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {block.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {block.highlight && (
                        <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                          ...{block.highlight}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {searchResults.length === 0 && searchQuery && (
                  <div className="text-center py-12 text-gray-500">
                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">未找到相关内容</p>
                    <p>尝试调整搜索关键词或使用高级筛选</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 右侧快捷操作 */}
          <div className="w-1/3 border-l bg-gray-50 p-6">
            <h3 className="font-medium text-gray-800 mb-4">快捷操作</h3>
            
            <div className="space-y-3">
              <button className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-2">
                  <FileText size={16} className="text-blue-600" />
                  <span className="font-medium">新建文档</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">创建一个新的文档</div>
              </button>

              <button className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-2">
                  <Tag size={16} className="text-green-600" />
                  <span className="font-medium">管理标签</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">添加或编辑标签</div>
              </button>

              <button className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-purple-600" />
                  <span className="font-medium">查看日历</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">按时间查看文档</div>
              </button>
            </div>

            {/* 统计信息 */}
            <div className="mt-8">
              <h4 className="font-medium text-gray-800 mb-3">文档统计</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">总文档数:</span>
                  <span className="text-gray-700">{blocks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">本周新增:</span>
                  <span className="text-gray-700">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">待处理:</span>
                  <span className="text-gray-700">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">我的收藏:</span>
                  <span className="text-gray-700">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;