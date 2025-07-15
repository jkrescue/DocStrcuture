import React, { useState } from 'react';
import { Clock, GitBranch, User, Download, RotateCcw, Eye, Plus, Minus, Archive } from 'lucide-react';
import { useDocStore } from '../../stores/docStore';

const VersionPanel = ({ onClose }) => {
  const { versions, blocks, saveVersion, loadVersion } = useDocStore();
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState([]);
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSaveVersion = () => {
    saveVersion(newVersionDescription || '手动保存');
    setNewVersionDescription('');
    setShowCreateForm(false);
  };

  const handleLoadVersion = (versionId) => {
    loadVersion(versionId);
    onClose?.();
  };

  const toggleCompareVersion = (version) => {
    if (compareVersions.includes(version.id)) {
      setCompareVersions(prev => prev.filter(id => id !== version.id));
    } else if (compareVersions.length < 2) {
      setCompareVersions(prev => [...prev, version.id]);
    }
  };

  const getDiffSummary = (version) => {
    // 模拟差异计算
    const changes = {
      added: Math.floor(Math.random() * 5),
      modified: Math.floor(Math.random() * 8),
      deleted: Math.floor(Math.random() * 3)
    };
    return changes;
  };

  const getVersionStatus = (version) => {
    const now = new Date();
    const versionDate = new Date(version.timestamp);
    const diffHours = (now - versionDate) / (1000 * 60 * 60);
    
    if (diffHours < 24) return { status: 'recent', color: 'green' };
    if (diffHours < 168) return { status: 'week', color: 'blue' };
    return { status: 'old', color: 'gray' };
  };

  const renderVersionTimeline = () => {
    return (
      <div className="space-y-4">
        {[...versions].reverse().map((version, index) => {
          const diff = getDiffSummary(version);
          const status = getVersionStatus(version);
          const isSelected = selectedVersion?.id === version.id;
          const isCompareSelected = compareVersions.includes(version.id);

          return (
            <div
              key={version.id}
              className={`relative p-4 border rounded-lg transition-all cursor-pointer ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : isCompareSelected 
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => setSelectedVersion(version)}
            >
              {/* 时间线连接线 */}
              {index < versions.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
              )}

              <div className="flex items-start space-x-4">
                {/* 时间线节点 */}
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                  status.color === 'green' ? 'bg-green-500' :
                  status.color === 'blue' ? 'bg-blue-500' : 'bg-gray-400'
                }`}></div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {version.description || '自动保存'}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>{new Date(version.timestamp).toLocaleString()}</span>
                        <User size={14} />
                        <span>当前用户</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {compareMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompareVersion(version);
                          }}
                          className={`p-1 rounded ${
                            isCompareSelected 
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          disabled={!isCompareSelected && compareVersions.length >= 2}
                        >
                          <GitBranch size={14} />
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVersion(version);
                        }}
                        className="p-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded"
                        title="查看详情"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadVersion(version.id);
                        }}
                        className="p-1 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded"
                        title="恢复到此版本"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 变更统计 */}
                  <div className="flex items-center space-x-4 text-sm">
                    {diff.added > 0 && (
                      <span className="flex items-center space-x-1 text-green-600">
                        <Plus size={12} />
                        <span>{diff.added} 新增</span>
                      </span>
                    )}
                    {diff.modified > 0 && (
                      <span className="flex items-center space-x-1 text-blue-600">
                        <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                        <span>{diff.modified} 修改</span>
                      </span>
                    )}
                    {diff.deleted > 0 && (
                      <span className="flex items-center space-x-1 text-red-600">
                        <Minus size={12} />
                        <span>{diff.deleted} 删除</span>
                      </span>
                    )}
                  </div>

                  {/* 版本标签 */}
                  <div className="mt-2 flex items-center space-x-2">
                    {index === 0 && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        当前版本
                      </span>
                    )}
                    {version.auto && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        自动保存
                      </span>
                    )}
                    {version.description?.includes('重要') && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                        重要节点
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderVersionDetail = () => {
    if (!selectedVersion) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Clock size={48} className="mx-auto mb-4 opacity-50" />
            <p>选择左侧版本查看详情</p>
          </div>
        </div>
      );
    }

    const diff = getDiffSummary(selectedVersion);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-2">{selectedVersion.description}</h3>
          <div className="text-sm text-gray-500 space-y-1">
            <div>保存时间: {new Date(selectedVersion.timestamp).toLocaleString()}</div>
            <div>版本ID: {selectedVersion.id}</div>
            <div>创建者: 当前用户</div>
          </div>
        </div>

        {/* 变更统计 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">变更统计</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{diff.added}</div>
              <div className="text-sm text-green-700">新增块</div>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{diff.modified}</div>
              <div className="text-sm text-blue-700">修改块</div>
            </div>
            <div className="p-3 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">{diff.deleted}</div>
              <div className="text-sm text-red-700">删除块</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={() => handleLoadVersion(selectedVersion.id)}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            恢复到此版本
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={16} className="mx-auto mb-1" />
              <div className="text-sm">导出版本</div>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Archive size={16} className="mx-auto mb-1" />
              <div className="text-sm">归档版本</div>
            </button>
          </div>
        </div>

        {/* 文件快照预览 */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">内容快照</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedVersion.blocksSnapshot?.slice(0, 5).map((block, index) => (
              <div key={index} className="p-2 bg-white border rounded text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded">{block.type}</span>
                  <span className="text-gray-600">#{block.id}</span>
                </div>
                <div className="text-gray-700 truncate">
                  {block.type === 'text' && block.content.text}
                  {block.type === 'field' && `${block.content.label}: ${block.content.value}`}
                  {block.type === 'table' && block.content.title}
                  {block.type === 'reference' && '引用内容'}
                </div>
              </div>
            ))}
            {selectedVersion.blocksSnapshot?.length > 5 && (
              <div className="text-center text-sm text-gray-500 py-2">
                还有 {selectedVersion.blocksSnapshot.length - 5} 个块...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex">
        {/* 左侧版本列表 */}
        <div className="w-2/3 border-r">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">版本历史</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 工具栏 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} className="inline mr-1" />
                  保存当前版本
                </button>
                
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    compareMode 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <GitBranch size={16} className="inline mr-1" />
                  对比模式
                </button>
              </div>

              <div className="text-sm text-gray-500">
                共 {versions.length} 个版本
              </div>
            </div>

            {/* 创建版本表单 */}
            {showCreateForm && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="输入版本描述（可选）"
                  value={newVersionDescription}
                  onChange={(e) => setNewVersionDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveVersion}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* 对比模式提示 */}
            {compareMode && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-purple-700">
                  对比模式已启用，选择最多2个版本进行比较
                  {compareVersions.length > 0 && (
                    <span className="ml-2">
                      （已选择 {compareVersions.length}/2）
                    </span>
                  )}
                </div>
                {compareVersions.length === 2 && (
                  <button className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                    开始比较
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="p-6 overflow-y-auto h-full">
            {renderVersionTimeline()}
          </div>
        </div>

        {/* 右侧版本详情 */}
        <div className="w-1/3 p-6 bg-gray-50">
          {renderVersionDetail()}
        </div>
      </div>
    </div>
  );
};

export default VersionPanel;