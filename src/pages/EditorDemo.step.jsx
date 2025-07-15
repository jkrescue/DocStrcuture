import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Template, 
  History, 
  Share2, 
  Settings, 
  User, 
  Bell,
  Plus,
  Save,
  Download,
  Eye,
  EyeOff,
  Menu,
  X
} from 'lucide-react';
import { useDocStore } from '../stores/docStore';
import BlockEditor from '../components/BlockEditor/BlockEditor';

const EditorDemo = () => {
  const { blocks, updateBlocks, saveVersion } = useDocStore();
  const [activePanel, setActivePanel] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('未命名文档');

  const handleBlocksChange = (newBlocks) => {
    updateBlocks(newBlocks);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {/* 左侧边栏 */}
      <div style={{
        width: sidebarCollapsed ? '60px' : '280px',
        backgroundColor: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 侧边栏头部 */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!sidebarCollapsed && (
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              文档编辑器
            </h2>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              padding: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* 导航菜单 */}
        <div style={{ padding: '16px 8px', flex: 1 }}>
          {[
            { icon: FileText, label: '文档', key: null },
            { icon: Template, label: '模板', key: 'template' },
            { icon: Search, label: '搜索', key: 'search' },
            { icon: History, label: '版本', key: 'version' },
            { icon: Share2, label: '关系图', key: 'graph' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setActivePanel(activePanel === item.key ? null : item.key)}
              style={{
                width: '100%',
                padding: '10px 12px',
                margin: '4px 0',
                border: 'none',
                background: activePanel === item.key ? '#e2e8f0' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                textAlign: 'left'
              }}
            >
              <item.icon size={16} />
              {!sidebarCollapsed && item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 主内容区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 顶部工具栏 */}
        <div style={{
          height: '60px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              style={{
                border: 'none',
                fontSize: '18px',
                fontWeight: '600',
                background: 'transparent',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => saveVersion('手动保存')}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                background: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Save size={16} />
              保存
            </button>
            <button style={{
              padding: '8px',
              border: '1px solid #d1d5db',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* 文档内容区域 */}
        <div style={{ flex: 1, display: 'flex' }}>
          {/* 主编辑区域 */}
          <div style={{
            flex: 1,
            padding: '20px',
            background: '#ffffff',
            overflow: 'auto'
          }}>
            <BlockEditor 
              blocks={blocks}
              onBlocksChange={handleBlocksChange}
              editable={true}
            />
          </div>

          {/* 右侧面板 */}
          {activePanel && (
            <div style={{
              width: '350px',
              backgroundColor: '#ffffff',
              borderLeft: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <h3>{activePanel} 面板</h3>
              <p>这里显示 {activePanel} 相关的内容</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorDemo;
