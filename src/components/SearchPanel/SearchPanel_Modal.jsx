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

  // 快捷操作卡片 - 对应您的HTML模板
  const quickCards = [
    { 
      id: 'recent-docs', 
      title: '最近文档', 
      description: '查看最近编辑内容',
      icon: '📄',
      color: 'from-blue-50 to-blue-100',
      hoverColor: 'from-blue-100 to-blue-200',
      iconBg: 'bg-blue-500'
    },
    { 
      id: 'active-projects', 
      title: '存在项目', 
      description: '查看当前活跃项目',
      icon: '📂',
      color: 'from-green-50 to-green-100',
      hoverColor: 'from-green-100 to-green-200',
      iconBg: 'bg-green-500'
    },
    { 
      id: 'references', 
      title: '引用关系', 
      description: '探索文档间关联',
      icon: '🔗',
      color: 'from-purple-50 to-purple-100',
      hoverColor: 'from-purple-100 to-purple-200',
      iconBg: 'bg-purple-500'
    },
    { 
      id: 'data-stats', 
      title: '数据统计', 
      description: '查看表格和数据分析',
      icon: '📊',
      color: 'from-orange-50 to-orange-100',
      hoverColor: 'from-orange-100 to-orange-200',
      iconBg: 'bg-orange-500'
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-5/6 flex flex-col overflow-hidden">
        
        {/* 顶部搜索栏 */}
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Search className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">全局搜索</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 主搜索框 */}
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="搜索文档内容、标题、字段…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* 高级筛选按钮 */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Settings size={16} />
                <span>高级筛选</span>
              </button>
              
              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 标签页导航 - 水平布局 */}
        <div className="border-b bg-white px-6">
          <div className="flex">
            {[
              { id: 'suggestions', name: '搜索建议', icon: Zap },
              { id: 'recent', name: '最近搜索', icon: Clock },
              { id: 'search', name: '智能推荐', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 高级筛选面板 */}
        {showAdvancedFilters && (
          <div className="border-b bg-gray-50 px-6 py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">文档类型:</label>
                <select 
                  value={filters.blockType}
                  onChange={(e) => setFilters(prev => ({ ...prev, blockType: e.target.value }))}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {blockTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">时间范围:</label>
                <select 
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部时间</option>
                  <option value="today">今天</option>
                  <option value="week">本周</option>
                  <option value="month">本月</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">作者:</label>
                <select 
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="flex-1 overflow-hidden">
          {/* 搜索建议页面 */}
          {activeTab === 'suggestions' && (
            <div className="h-full overflow-y-auto p-6">
              {/* 快捷卡片 - 网格布局 */}
              <div className="mb-8">
                <div className="grid grid-cols-4 gap-4">
                  {quickCards.map(card => (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      className={`bg-gradient-to-br ${card.color} hover:${card.hoverColor} p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 group`}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                          {card.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{card.title}</h4>
                          <p className="text-sm text-gray-600">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 搜索提示区域 */}
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  🔍 输入关键词开始搜索，或选择上方建议
                </h3>
                <p className="text-gray-500">
                  在上方搜索框中输入您要查找的内容，或点击快捷卡片开始探索
                </p>
              </div>
            </div>
          )}

          {/* 最近搜索页面 */}
          {activeTab === 'recent' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock size={20} className="mr-2 text-gray-600" />
                  搜索历史
                </h4>
                {searchHistory.length > 0 ? (
                  <>
                    {searchHistory.map((query, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
                      >
                        <button
                          onClick={() => setSearchQuery(query)}
                          className="flex items-center space-x-3 flex-1 text-left"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Clock size={14} className="text-gray-500 group-hover:text-blue-600" />
                          </div>
                          <span className="text-gray-800 font-medium">{query}</span>
                        </button>
                        <button
                          onClick={() => removeFromHistory(query)}
                          className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">暂无搜索历史</h3>
                    <p className="text-gray-500">开始搜索后，您的搜索历史将显示在这里</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 搜索结果页面 */}
          {activeTab === 'search' && (
            <div className="h-full overflow-y-auto p-6">
              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">未找到相关结果</h3>
                  <p className="text-gray-500">尝试使用不同的关键词或调整筛选条件</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      "{searchQuery}" 的搜索结果
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        找到 {searchResults.length} 个相关结果
                      </span>
                      <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>相关性排序</option>
                        <option>时间排序</option>
                        <option>类型排序</option>
                      </select>
                    </div>
                  </div>

                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => onSelectBlock && onSelectBlock(result)}
                      className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group bg-white"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2 text-lg">{result.title}</h4>
                          <p className="text-gray-600 mb-3 line-clamp-2">{result.content}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{result.date}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User size={14} />
                              <span>{result.author}</span>
                            </span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                              {result.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
