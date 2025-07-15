import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, Tag, Clock, FileText, ChevronDown, X, Zap, Star, TrendingUp, Settings } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('suggestions'); // 默认显示搜索建议

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

  // 快捷操作卡片 - 严格按照截图设计
  const quickCards = [
    { 
      id: 'recent-docs', 
      title: '最近文档', 
      description: '查看最近编辑内容'
    },
    { 
      id: 'active-projects', 
      title: '存在项目', 
      description: '查看当前活跃项目'
    },
    { 
      id: 'references', 
      title: '引用关系', 
      description: '探索文档间关联'
    },
    { 
      id: 'data-stats', 
      title: '数据统计', 
      description: '查看表格和数据分析'
    }
  ];

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, filters]);

  const handleSearch = (query) => {
    if (!query.trim()) return;
    
    // 模拟搜索逻辑
    const mockResults = [
      {
        id: 1,
        title: '项目需求文档',
        content: '这是一个关于新产品功能的需求分析文档，包含了用户调研和市场分析...',
        type: '文档',
        author: '张三',
        date: '2天前',
        blockType: 'text'
      },
      {
        id: 2,
        title: '会议纪要记录',
        content: '周例会讨论了产品迭代计划，确定了下阶段的开发重点...',
        type: '会议',
        author: '李四',
        date: '1周前',
        blockType: 'field'
      },
      {
        id: 3,
        title: '用户反馈汇总',
        content: '收集了过去一个月的用户反馈，主要集中在功能优化和性能提升...',
        type: '反馈',
        author: '王五',
        date: '3天前',
        blockType: 'table'
      }
    ];

    // 简单的过滤逻辑
    let filteredResults = mockResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.content.toLowerCase().includes(query.toLowerCase())
    );

    if (filters.blockType !== 'all') {
      filteredResults = filteredResults.filter(result => 
        result.blockType === filters.blockType
      );
    }

    setSearchResults(filteredResults);

    // 添加到搜索历史
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
    }

    // 切换到搜索结果标签页
    setActiveTab('search');
  };

  const removeFromHistory = (query) => {
    setSearchHistory(prev => prev.filter(item => item !== query));
  };

  const handleCardClick = (cardId) => {
    const cardTitles = {
      'recent-docs': '最近文档',
      'active-projects': '存在项目', 
      'references': '引用关系',
      'data-stats': '数据统计'
    };
    
    const query = cardTitles[cardId];
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部搜索栏 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 搜索框 */}
            <div className="flex items-center flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="搜索文档内容、标题、字段…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            
            {/* 右侧按钮区域 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                高级筛选
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 标签页导航 - 水平布局，严格按照截图 */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <div className="flex space-x-0">
              {[
                { id: 'suggestions', name: '搜索建议' },
                { id: 'recent', name: '最近搜索' },
                { id: 'search', name: '智能推荐' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 高级筛选面板 */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <label className="font-medium text-gray-700">文档类型:</label>
                <select 
                  value={filters.blockType}
                  onChange={(e) => setFilters(prev => ({ ...prev, blockType: e.target.value }))}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {blockTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="font-medium text-gray-700">时间范围:</label>
                <select 
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">全部时间</option>
                  <option value="today">今天</option>
                  <option value="week">本周</option>
                  <option value="month">本月</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="font-medium text-gray-700">作者:</label>
                <select 
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">全部作者</option>
                  <option value="me">仅我的</option>
                  <option value="others">其他人的</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 主内容区域 */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* 搜索建议页面 */}
          {activeTab === 'suggestions' && (
            <div className="p-6">
              {/* 快捷卡片 - 严格按照截图的4列网格布局 */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {quickCards.map(card => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">{card.title}</h4>
                      <p className="text-sm text-gray-600">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 搜索提示区域 - 按照截图的虚线边框设计 */}
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-16 text-center">
                <div className="text-gray-500">
                  <Search size={24} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-lg">🔍 输入关键词开始搜索，或选择上方建议</p>
                </div>
              </div>
            </div>
          )}

          {/* 最近搜索页面 */}
          {activeTab === 'recent' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock size={20} className="mr-2 text-gray-600" />
                  搜索历史
                </h4>
                {searchHistory.length > 0 ? (
                  <div className="space-y-3">
                    {searchHistory.map((query, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors group"
                      >
                        <button
                          onClick={() => setSearchQuery(query)}
                          className="flex items-center space-x-3 flex-1 text-left"
                        >
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-gray-800">{query}</span>
                        </button>
                        <button
                          onClick={() => removeFromHistory(query)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">暂无搜索历史</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 搜索结果页面 */}
          {activeTab === 'search' && (
            <div className="p-6">
              {searchQuery && searchResults.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
                  <FileText size={32} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">未找到相关结果</h3>
                  <p className="text-gray-500">尝试使用不同的关键词或调整筛选条件</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        "{searchQuery}" 的搜索结果
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">
                          找到 {searchResults.length} 个相关结果
                        </span>
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option>相关性排序</option>
                          <option>时间排序</option>
                          <option>类型排序</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => onSelectBlock && onSelectBlock(result)}
                        className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{result.title}</h4>
                            <p className="text-gray-600 mb-2 text-sm">{result.content}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Clock size={12} />
                                <span>{result.date}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <User size={12} />
                                <span>{result.author}</span>
                              </span>
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {result.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
