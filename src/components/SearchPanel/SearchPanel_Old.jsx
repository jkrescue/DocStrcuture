import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, Tag, Clock, FileText, ChevronDown, X, Zap, Star, TrendingUp } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'recent', 'suggestions'

  // 模拟搜索结果数据
  const [searchHistory, setSearchHistory] = useState([
    '项目需求', '会议纪要', '用户反馈', '技术文档'
  ]);

  const blockTypes = [
    { id: 'all', name: '全部类型', icon: '📄' },
    { id: 'text', name: '文本块', icon: '📝' },
    { id: 'field', name: '字段块', icon: '🏷️' },
    { id: 'table', name: '表格块', icon: '📊' },
    { id: 'reference', name: '引用块', icon: '🔗' }
  ];

  const quickActions = [
    { id: 'existingDoc', name: '最近的文档', icon: '📄', desc: '查看最近编辑的内容' },
    { id: 'existingProject', name: '存在项目', icon: '📂', desc: '查看当前活跃项目' },
    { id: 'useTemplate', name: '引用关系', icon: '🔗', desc: '探索文档间的关联' },
    { id: 'dataStats', name: '数据统计', icon: '📊', desc: '查看表格和数据分析' }
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-5/6 flex overflow-hidden">
        {/* 左侧搜索和筛选区域 */}
        <div className="w-96 bg-gray-50 border-r p-6 flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Search className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">搜索文档</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 主搜索框 */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索文档内容、标题、字段..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* 标签页切换 */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            {[
              { id: 'search', name: '搜索建议', icon: Search },
              { id: 'recent', name: '最近搜索', icon: Clock },
              { id: 'suggestions', name: '智能推荐', icon: Zap }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* 快捷操作 */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">快捷操作</h3>
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleSearch(action.name)}
                className="w-full flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <span className="text-lg">{action.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{action.name}</div>
                  <div className="text-xs text-gray-500">{action.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* 高级筛选 */}
          <div className="border-t pt-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Filter size={16} />
                <span className="font-medium">高级筛选</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {showAdvancedFilters && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">文档类型</label>
                  <div className="grid grid-cols-2 gap-2">
                    {blockTypes.slice(0, 4).map(type => (
                      <button
                        key={type.id}
                        onClick={() => setFilters(prev => ({ ...prev, blockType: type.id }))}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                          filters.blockType === type.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span>{type.icon}</span>
                        <span>{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧搜索结果区域 */}
        <div className="flex-1 flex flex-col">
          {/* 结果头部 */}
          <div className="p-6 border-b bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'search' && searchQuery && `"${searchQuery}" 的搜索结果`}
                  {activeTab === 'search' && !searchQuery && '搜索建议'}
                  {activeTab === 'recent' && '最近搜索'}
                  {activeTab === 'suggestions' && '智能推荐'}
                </h3>
                {searchResults.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    找到 {searchResults.length} 个相关结果
                  </p>
                )}
              </div>
              
              {/* 排序选项 */}
              {searchResults.length > 0 && (
                <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>相关性排序</option>
                  <option>时间排序</option>
                  <option>类型排序</option>
                </select>
              )}
            </div>
          </div>

          {/* 搜索结果内容 */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'search' && !searchQuery && (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">开始搜索</h3>
                <p className="text-gray-500">在左侧搜索框中输入关键词，或选择快捷操作</p>
              </div>
            )}

            {activeTab === 'search' && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">未找到相关结果</h3>
                <p className="text-gray-500">尝试使用不同的关键词或调整筛选条件</p>
              </div>
            )}

            {activeTab === 'search' && searchResults.length > 0 && (
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => onSelectBlock(result)}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <FileText size={18} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{result.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{result.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{result.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User size={12} />
                            <span>{result.author}</span>
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {result.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'recent' && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800 mb-3">搜索历史</h4>
                {searchHistory.map((query, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <button
                      onClick={() => setSearchQuery(query)}
                      className="flex items-center space-x-3 flex-1 text-left"
                    >
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-700">{query}</span>
                    </button>
                    <button
                      onClick={() => removeFromHistory(query)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800 mb-3">智能推荐</h4>
                {[
                  { title: '最近的文档', desc: '查看最近编辑的5个文档', icon: '📄', trend: '+12%' },
                  { title: '存在项目', desc: '当前活跃的项目和任务', icon: '📂', trend: '+8%' },
                  { title: '引用关系', desc: '探索文档间的关联关系', icon: '🔗', trend: '+15%' },
                  { title: '数据统计', desc: '查看表格和数据分析', icon: '📊', trend: '+5%' }
                ].map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSearch(suggestion.title)}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{suggestion.icon}</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                        <p className="text-sm text-gray-600">{suggestion.desc}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp size={14} className="text-green-500" />
                        <span className="text-sm text-green-600 font-medium">{suggestion.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
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