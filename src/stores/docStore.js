import { create } from 'zustand';

const useDocStore = create((set, get) => ({
  // 文档和文件夹数据
  documents: [
    {
      id: 'doc_1',
      title: '产品需求文档 - 文档管理系统',
      description: '详细描述文档管理系统的产品需求和功能规格',
      folderId: null, // 根目录
      blocks: [
        {
          id: 'block_doc1_1',
          type: 'text',
          content: { text: '# 产品需求文档 - 文档管理系统\n\n## 产品概述\n\n本系统旨在为团队提供高效的文档创建、管理和协作功能，支持结构化编辑、版本控制、实时协作等核心特性。\n\n## 核心功能\n\n### 1. 文档编辑\n- 支持Markdown语法\n- 块级编辑模式\n- 实时预览\n- 多媒体内容嵌入\n\n### 2. 文档管理\n- 文件夹结构组织\n- 搜索和筛选\n- 批量操作\n- 权限控制' }
        },
        {
          id: 'block_doc1_2',
          type: 'field',
          content: {
            fieldType: 'text',
            label: '产品名称',
            value: '文档管理系统',
            required: true
          }
        },
        {
          id: 'block_doc1_3',
          type: 'field',
          content: {
            fieldType: 'text',
            label: '目标用户',
            value: '企业团队、内容创作者、知识工作者',
            required: true
          }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: '产品经理',
        version: '2.1.0',
        templateId: 'template_3',
        category: 'document',
        tags: ['产品', 'PRD', '需求']
      }
    },
    {
      id: 'doc_2',
      title: '技术架构设计方案',
      description: '系统技术架构的详细设计文档',
      folderId: 'folder_1', // 在技术文档文件夹中
      blocks: [
        {
          id: 'block_doc2_1',
          type: 'text',
          content: { text: '# 技术架构设计方案\n\n## 整体架构\n\n采用前后端分离的架构模式，前端使用React + Vite，后端使用Node.js + Express。\n\n## 技术栈\n\n### 前端技术栈\n- React 18.x\n- Vite 4.x\n- Zustand (状态管理)\n- BlockNote (富文本编辑器)\n- Lucide React (图标库)\n\n### 后端技术栈\n- Node.js 18.x\n- Express.js\n- MongoDB\n- Redis (缓存)\n- WebSocket (实时通信)' }
        },
        {
          id: 'block_doc2_2',
          type: 'table',
          content: {
            title: '技术选型对比',
            data: [
              ['技术', '优势', '劣势', '评分'],
              ['React', '生态丰富、性能优秀', '学习曲线陡峭', '9/10'],
              ['Vue', '易学易用、文档详细', '生态相对较小', '8/10'],
              ['Angular', '企业级、功能完整', '复杂度高', '7/10']
            ]
          }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        author: '技术负责人',
        version: '1.3.0',
        templateId: 'template_4',
        category: 'document',
        tags: ['技术', '架构', '设计']
      }
    },
    {
      id: 'doc_3',
      title: '周例会纪要 - 第42周',
      description: '第42周团队例会的会议纪要和行动项',
      folderId: 'folder_2', // 在会议记录文件夹中
      blocks: [
        {
          id: 'block_doc3_1',
          type: 'text',
          content: { text: '# 周例会纪要 - 第42周\n\n## 会议信息\n\n- 时间：2024年10月15日 14:00-15:00\n- 地点：会议室A\n- 主持人：项目经理\n- 参会人员：产品经理、技术负责人、UI设计师、前端工程师×2、后端工程师×2\n\n## 议程\n\n### 1. 项目进度汇报\n- 产品需求文档已完成初稿\n- 技术架构设计进行中\n- UI设计稿完成60%\n\n### 2. 技术难点讨论\n- 实时协作功能的技术实现方案\n- 大文件处理的性能优化\n- 跨浏览器兼容性问题' }
        },
        {
          id: 'block_doc3_2',
          type: 'field',
          content: {
            fieldType: 'text',
            label: '下周目标',
            value: '完成技术架构设计文档，开始前端框架搭建',
            required: true
          }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        author: '项目经理',
        version: '1.0.0',
        templateId: 'template_2',
        category: 'meeting',
        tags: ['会议', '例会', '纪要']
      }
    },
    {
      id: 'doc_4',
      title: '用户研究报告',
      description: '针对文档管理需求的用户调研分析报告',
      folderId: null, // 根目录
      blocks: [
        {
          id: 'block_doc4_1',
          type: 'text',
          content: { text: '# 用户研究报告\n\n## 研究背景\n\n为了更好地了解用户对文档管理工具的需求和使用习惯，我们开展了这次用户研究。\n\n## 研究方法\n\n- 在线问卷调查（200+样本）\n- 深度用户访谈（15位用户）\n- 竞品分析（5款主流产品）\n- 用户行为数据分析\n\n## 关键发现\n\n### 用户痛点\n1. 文档散落各处，难以管理\n2. 协作效率低下，版本混乱\n3. 搜索功能不够智能\n4. 移动端体验欠佳\n\n### 用户需求\n1. 统一的文档管理平台\n2. 实时协作编辑功能\n3. 强大的搜索和组织能力\n4. 多设备同步' }
        },
        {
          id: 'block_doc4_2',
          type: 'field',
          content: {
            fieldType: 'text',
            label: '调研时间',
            value: '2024年9月1日 - 2024年9月30日',
            required: true
          }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        author: '用户研究员',
        version: '1.2.0',
        templateId: 'template_1',
        category: 'report',
        tags: ['用户研究', '调研', '报告']
      }
    },
    {
      id: 'doc_5',
      title: '开发进度周报',
      description: '本周开发团队的工作进展和下周计划',
      folderId: 'folder_2', // 在会议记录文件夹中
      blocks: [
        {
          id: 'block_doc5_1',
          type: 'text',
          content: { text: '# 开发进度周报\n\n## 本周完成工作\n\n1. 完成了文档管理组件的基础框架\n2. 实现了文档列表的展示功能\n3. 添加了文档创建和删除功能\n4. 完成了文件夹管理功能\n5. 实现了批量操作功能\n\n## 遇到的问题\n\n1. 拖拽排序功能的性能优化\n2. 大量文档时的虚拟滚动实现\n3. 搜索功能的防抖优化\n\n## 下周计划\n\n1. 完成关系管理器功能\n2. 实现版本控制功能\n3. 添加模板系统\n4. 开始移动端适配工作' }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        author: '开发团队',
        version: '1.0.0',
        templateId: 'template_5',
        category: 'report',
        tags: ['开发', '周报', '进度']
      }
    },
    {
      id: 'doc_6',
      title: 'UI设计规范',
      description: '文档管理系统的界面设计规范和组件库',
      folderId: 'folder_1', // 在技术文档文件夹中
      blocks: [
        {
          id: 'block_doc6_1',
          type: 'text',
          content: { text: '# UI设计规范\n\n## 设计原则\n\n### 1. 简洁明了\n- 界面布局清晰，信息层次分明\n- 减少不必要的装饰元素\n- 突出核心功能和内容\n\n### 2. 一致性\n- 统一的视觉语言和交互模式\n- 一致的颜色、字体、间距规范\n- 标准化的组件和控件\n\n### 3. 易用性\n- 符合用户认知习惯\n- 提供清晰的操作反馈\n- 支持快捷键和批量操作\n\n## 色彩规范\n\n### 主色调\n- Primary: #3b82f6 (蓝色)\n- Secondary: #10b981 (绿色)\n- Warning: #f59e0b (橙色)\n- Danger: #ef4444 (红色)\n\n### 中性色\n- Gray-900: #111827\n- Gray-600: #4b5563\n- Gray-400: #9ca3af\n- Gray-100: #f3f4f6' }
        },
        {
          id: 'block_doc6_2',
          type: 'reference',
          content: {
            type: 'document',
            title: '设计稿原型',
            url: 'https://figma.com/design-system',
            description: 'Figma中的完整设计稿'
          }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        author: 'UI设计师',
        version: '1.1.0',
        templateId: 'template_4',
        category: 'document',
        tags: ['设计', 'UI', '规范']
      }
    },
    {
      id: 'doc_7',
      title: 'API接口文档',
      description: '后端API接口的详细说明和使用示例',
      folderId: 'folder_1', // 在技术文档文件夹中
      blocks: [
        {
          id: 'block_doc7_1',
          type: 'text',
          content: { text: '# API接口文档\n\n## 基础信息\n\n- Base URL: `https://api.docmanager.com/v1`\n- 认证方式: Bearer Token\n- 数据格式: JSON\n- 字符编码: UTF-8\n\n## 文档管理接口\n\n### 1. 获取文档列表\n\n```http\nGET /documents\n```\n\n**请求参数:**\n- `page`: 页码 (可选，默认1)\n- `limit`: 每页数量 (可选，默认20)\n- `folder_id`: 文件夹ID (可选)\n- `search`: 搜索关键词 (可选)\n\n**响应示例:**\n```json\n{\n  "success": true,\n  "data": {\n    "documents": [...],\n    "total": 100,\n    "page": 1,\n    "limit": 20\n  }\n}\n```\n\n### 2. 创建文档\n\n```http\nPOST /documents\n```\n\n**请求体:**\n```json\n{\n  "title": "文档标题",\n  "description": "文档描述",\n  "folder_id": "folder_123",\n  "blocks": [...]\n}\n```' }
        },
        {
          id: 'block_doc7_2',
          type: 'table',
          content: {
            title: 'HTTP状态码说明',
            data: [
              ['状态码', '说明', '处理方式'],
              ['200', '请求成功', '正常处理响应数据'],
              ['401', '未授权', '引导用户登录'],
              ['403', '权限不足', '显示权限错误提示'],
              ['404', '资源不存在', '显示资源不存在提示'],
              ['500', '服务器错误', '显示系统错误提示']
            ]
          }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        author: '后端工程师',
        version: '1.0.0',
        templateId: 'template_4',
        category: 'document',
        tags: ['API', '接口', '后端']
      }
    },
    {
      id: 'doc_8',
      title: '测试计划文档',
      description: '系统功能测试的计划和测试用例',
      folderId: 'folder_1', // 在技术文档文件夹中
      blocks: [
        {
          id: 'block_doc8_1',
          type: 'text',
          content: { text: '# 测试计划文档\n\n## 测试目标\n\n确保文档管理系统的功能正确性、性能稳定性和用户体验的优质性。\n\n## 测试范围\n\n### 功能测试\n1. 文档CRUD操作\n2. 文件夹管理功能\n3. 搜索和筛选功能\n4. 用户权限管理\n5. 实时协作功能\n\n### 性能测试\n1. 页面加载速度\n2. 大文档处理能力\n3. 并发用户支持\n4. 内存使用优化\n\n### 兼容性测试\n1. 主流浏览器兼容性\n2. 移动设备适配\n3. 不同分辨率支持\n\n## 测试环境\n\n- 开发环境: http://dev.docmanager.com\n- 测试环境: http://test.docmanager.com\n- 预发布环境: http://staging.docmanager.com' }
        },
        {
          id: 'block_doc8_2',
          type: 'field',
          content: {
            fieldType: 'text',
            label: '测试周期',
            value: '2024年11月1日 - 2024年11月15日',
            required: true
          }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        author: '测试工程师',
        version: '1.0.0',
        templateId: 'template_4',
        category: 'document',
        tags: ['测试', '计划', '质量']
      }
    },
    {
      id: 'doc_9',
      title: '项目启动会议',
      description: '文档管理系统项目正式启动的会议记录',
      folderId: 'folder_2', // 在会议记录文件夹中
      blocks: [
        {
          id: 'block_doc9_1',
          type: 'text',
          content: { text: '# 项目启动会议\n\n## 会议信息\n\n- 时间：2024年9月1日 09:00-11:00\n- 地点：大会议室\n- 主持人：项目总监\n- 参会人员：全体项目成员\n\n## 项目背景\n\n随着公司业务快速发展，现有的文档管理方式已无法满足团队协作需求。亟需开发一套专业的文档管理系统，提升团队工作效率。\n\n## 项目目标\n\n1. 提供统一的文档管理平台\n2. 支持实时协作编辑\n3. 实现文档版本控制\n4. 提升文档搜索效率\n5. 支持移动端使用\n\n## 项目范围\n\n### 包含功能\n- 文档创建、编辑、删除\n- 文件夹组织管理\n- 权限控制系统\n- 搜索和筛选\n- 版本历史管理\n- 评论和协作\n\n### 不包含功能\n- 外部系统集成\n- 高级工作流\n- 自动化审批' }
        },
        {
          id: 'block_doc9_2',
          type: 'field',
          content: {
            fieldType: 'text',
            label: '项目经理',
            value: '张三',
            required: true
          }
        },
        {
          id: 'block_doc9_3',
          type: 'field',
          content: {
            fieldType: 'text',
            label: '项目周期',
            value: '3个月 (2024年9月-11月)',
            required: true
          }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        author: '项目总监',
        version: '1.0.0',
        templateId: 'template_2',
        category: 'meeting',
        tags: ['项目', '启动', '会议']
      }
    },
    {
      id: 'doc_10',
      title: '竞品分析报告',
      description: '主流文档管理工具的功能对比和分析',
      folderId: null, // 根目录
      blocks: [
        {
          id: 'block_doc10_1',
          type: 'text',
          content: { text: '# 竞品分析报告\n\n## 分析目的\n\n通过对市场上主流文档管理工具的深入分析，了解行业标准和最佳实践，为我们的产品设计提供参考。\n\n## 竞品选择\n\n基于市场占有率和功能完整度，我们选择了以下5款产品进行分析：\n\n1. **Notion** - 综合性工作空间\n2. **Confluence** - 企业级知识管理\n3. **Obsidian** - 知识图谱工具\n4. **Typora** - Markdown编辑器\n5. **石墨文档** - 国内协作平台\n\n## 功能对比分析\n\n### 核心功能\n\n所有竞品都具备基础的文档创建、编辑、组织功能，但在实现方式和用户体验上存在差异。\n\n### 差异化功能\n\n- **Notion**: 数据库和模板系统\n- **Confluence**: 企业级权限和审批\n- **Obsidian**: 双向链接和知识图谱\n- **Typora**: 所见即所得Markdown\n- **石墨文档**: 本土化和移动端优化' }
        },
        {
          id: 'block_doc10_2',
          type: 'table',
          content: {
            title: '竞品功能对比',
            data: [
              ['功能', 'Notion', 'Confluence', 'Obsidian', 'Typora', '石墨文档'],
              ['实时协作', '✓', '✓', '✗', '✗', '✓'],
              ['模板系统', '✓', '✓', '✗', '✗', '✓'],
              ['版本控制', '✓', '✓', '✗', '✗', '✓'],
              ['移动端应用', '✓', '✓', '✓', '✗', '✓'],
              ['离线编辑', '✗', '✗', '✓', '✓', '✗'],
              ['API开放', '✓', '✓', '✗', '✗', '✓']
            ]
          }
        }
      ],
      metadata: {
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        author: '产品分析师',
        version: '1.1.0',
        templateId: 'template_1',
        category: 'report',
        tags: ['竞品', '分析', '对比']
      }
    }
  ],
  
  // 文件夹数据
  folders: [
    {
      id: 'folder_1',
      name: '技术文档',
      parentId: null, // 根文件夹
      color: '#3b82f6',
      metadata: {
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        author: '技术负责人'
      }
    },
    {
      id: 'folder_2',
      name: '会议记录',
      parentId: null, // 根文件夹
      color: '#10b981',
      metadata: {
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        author: '项目经理'
      }
    },
    {
      id: 'folder_3',
      name: '前端开发',
      parentId: 'folder_1', // 技术文档的子文件夹
      color: '#f59e0b',
      metadata: {
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        author: '前端团队'
      }
    }
  ],
  
  currentDocument: null,
  currentFolderId: null, // 当前所在的文件夹ID，null表示根目录
  recentlyOpenedDocuments: ['doc_1', 'doc_3', 'doc_5', 'doc_2'], // 最近打开的文档ID列表，按时间倒序
  
  // 应用状态
  searchQuery: '',
  selectedBlocks: [],
  isCollaborativeMode: false,
  
  // 文档关系数据
  documentRelationships: [
    {
      id: 'rel_1',
      sourceDocId: 'doc_1', // 产品需求文档
      targetDocId: 'doc_2', // 技术架构设计方案
      type: 'implements',
      description: '技术架构设计实现产品需求',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rel_2',
      sourceDocId: 'doc_1', // 产品需求文档
      targetDocId: 'doc_4', // 用户研究报告
      type: 'depends_on',
      description: '产品需求基于用户研究结果',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rel_3',
      sourceDocId: 'doc_10', // 竞品分析报告
      targetDocId: 'doc_1', // 产品需求文档
      type: 'influences',
      description: '竞品分析影响产品需求设计',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rel_4',
      sourceDocId: 'doc_2', // 技术架构设计方案
      targetDocId: 'doc_7', // API接口文档
      type: 'defines',
      description: '技术架构定义API接口规范',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rel_5',
      sourceDocId: 'doc_6', // UI设计规范
      targetDocId: 'doc_1', // 产品需求文档
      type: 'implements',
      description: 'UI设计实现产品需求中的界面要求',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rel_6',
      sourceDocId: 'doc_8', // 测试计划文档
      targetDocId: 'doc_2', // 技术架构设计方案
      type: 'validates',
      description: '测试计划验证技术架构的可行性',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rel_7',
      sourceDocId: 'doc_9', // 项目启动会议
      targetDocId: 'doc_1', // 产品需求文档
      type: 'initiates',
      description: '项目启动会议确定产品需求方向',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rel_8',
      sourceDocId: 'doc_3', // 周例会纪要
      targetDocId: 'doc_5', // 开发进度周报
      type: 'references',
      description: '例会纪要与开发进度相互关联',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rel_9',
      sourceDocId: 'doc_4', // 用户研究报告
      targetDocId: 'doc_10', // 竞品分析报告
      type: 'complements',
      description: '用户研究与竞品分析相互补充',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rel_10',
      sourceDocId: 'doc_7', // API接口文档
      targetDocId: 'doc_8', // 测试计划文档
      type: 'tested_by',
      description: 'API接口需要通过测试计划验证',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  blockRelationships: [],
  
  // 块数据
  blocks: [
    {
      id: 'block_1',
      type: 'text',
      content: { text: '# 文档结构化编辑器演示\n\n这是一个支持块级编辑的文档系统。' },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 'block_2',
      type: 'field',
      content: {
        fieldType: 'text',
        label: '项目名称',
        value: '文档结构化组件',
        required: true
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 'block_3',
      type: 'field',
      content: {
        fieldType: 'select',
        label: '项目状态',
        value: '开发中',
        options: ['规划中', '开发中', '测试中', '已完成', '已暂停']
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 'block_4',
      type: 'table',
      content: {
        title: '功能清单',
        data: [
          ['功能模块', '优先级', '完成度', '负责人'],
          ['块编辑器', '高', '80%', '张三'],
          ['模板中心', '中', '60%', '李四'],
          ['版本管理', '中', '40%', '王五'],
          ['权限控制', '低', '20%', '赵六']
        ]
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 'block_5',
      type: 'reference',
      content: {
        sourceBlockId: 'block_2',
        sourceContent: {
          fieldType: 'text',
          label: '项目名称',
          value: '文档结构化组件'
        },
        sourceType: 'field',
        lastSyncTime: new Date().toISOString(),
        syncStatus: 'synced'
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  ],

  // 模板数据
  templates: [
    {
      id: 'template_1',
      name: '项目需求文档',
      description: '标准的项目需求文档模板，包含完整的需求分析结构',
      category: 'document',
      featured: true,
      blocks: [
        { type: 'text', content: { text: '# 项目需求文档\n\n## 项目概述' } },
        { type: 'field', content: { fieldType: 'text', label: '项目名称', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '项目负责人', required: true } },
        { type: 'field', content: { fieldType: 'date', label: '项目开始时间' } },
        { type: 'field', content: { fieldType: 'date', label: '预计完成时间' } },
        { type: 'field', content: { fieldType: 'select', label: '项目优先级', options: ['低', '中', '高', '紧急'] } },
        { type: 'text', content: { text: '## 需求分析' } },
        { type: 'table', content: { title: '功能需求列表', data: [['需求编号', '需求描述', '优先级', '状态'], ['REQ-001', '', '高', '待开发']] } },
        { type: 'text', content: { text: '## 技术要求' } },
        { type: 'field', content: { fieldType: 'text', label: '技术栈' } },
        { type: 'field', content: { fieldType: 'text', label: '性能要求' } }
      ]
    },
    {
      id: 'template_2', 
      name: '会议纪要',
      description: '会议记录和行动项跟踪模板',
      category: 'meeting',
      featured: false,
      blocks: [
        { type: 'text', content: { text: '# 会议纪要' } },
        { type: 'field', content: { fieldType: 'text', label: '会议主题', required: true } },
        { type: 'field', content: { fieldType: 'date', label: '会议时间' } },
        { type: 'field', content: { fieldType: 'text', label: '会议地点' } },
        { type: 'field', content: { fieldType: 'text', label: '主持人' } },
        { type: 'field', content: { fieldType: 'text', label: '参会人员' } },
        { type: 'text', content: { text: '## 会议议程' } },
        { type: 'table', content: { title: '议程安排', data: [['时间', '议题', '负责人'], ['', '', '']] } },
        { type: 'text', content: { text: '## 讨论要点' } },
        { type: 'text', content: { text: '## 决议事项' } },
        { type: 'table', content: { title: '行动项', data: [['行动项', '负责人', '截止日期', '状态'], ['', '', '', '待处理']] } }
      ]
    },
    {
      id: 'template_3',
      name: '产品PRD',
      description: '产品需求文档标准模板',
      category: 'document',
      featured: true,
      blocks: [
        { type: 'text', content: { text: '# 产品需求文档 (PRD)\n\n## 产品概述' } },
        { type: 'field', content: { fieldType: 'text', label: '产品名称', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '产品版本' } },
        { type: 'field', content: { fieldType: 'text', label: '产品经理' } },
        { type: 'field', content: { fieldType: 'date', label: '文档创建日期' } },
        { type: 'text', content: { text: '## 背景与目标' } },
        { type: 'field', content: { fieldType: 'text', label: '业务背景' } },
        { type: 'field', content: { fieldType: 'text', label: '产品目标' } },
        { type: 'text', content: { text: '## 用户故事' } },
        { type: 'table', content: { title: '用户故事列表', data: [['故事ID', '用户角色', '需求描述', '验收标准'], ['US-001', '', '', '']] } }
      ]
    },
    {
      id: 'template_4',
      name: '技术方案',
      description: '技术设计方案文档模板',
      category: 'document',
      featured: false,
      blocks: [
        { type: 'text', content: { text: '# 技术方案设计\n\n## 方案概述' } },
        { type: 'field', content: { fieldType: 'text', label: '方案名称', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '技术负责人' } },
        { type: 'field', content: { fieldType: 'date', label: '方案设计日期' } },
        { type: 'text', content: { text: '## 技术架构' } },
        { type: 'field', content: { fieldType: 'text', label: '架构设计' } },
        { type: 'text', content: { text: '## 技术选型' } },
        { type: 'table', content: { title: '技术选型对比', data: [['技术', '优势', '劣势', '适用场景'], ['', '', '', '']] } },
        { type: 'text', content: { text: '## 实施计划' } },
        { type: 'table', content: { title: '开发计划', data: [['阶段', '任务', '工期', '负责人'], ['', '', '', '']] } }
      ]
    },
    {
      id: 'template_5',
      name: '周报模板',
      description: '个人或团队周报模板',
      category: 'report',
      featured: false,
      blocks: [
        { type: 'text', content: { text: '# 工作周报\n\n## 基本信息' } },
        { type: 'field', content: { fieldType: 'text', label: '汇报人', required: true } },
        { type: 'field', content: { fieldType: 'text', label: '汇报周期' } },
        { type: 'field', content: { fieldType: 'date', label: '汇报日期' } },
        { type: 'text', content: { text: '## 本周工作总结' } },
        { type: 'table', content: { title: '工作完成情况', data: [['工作项', '完成度', '说明'], ['', '', '']] } },
        { type: 'text', content: { text: '## 下周工作计划' } },
        { type: 'table', content: { title: '计划安排', data: [['工作项', '预期完成时间', '备注'], ['', '', '']] } },
        { type: 'text', content: { text: '## 问题与建议' } }
      ]
    },
    {
      id: 'template_6',
      name: '用户反馈收集',
      description: '用户反馈和问题跟踪模板',
      category: 'document',
      featured: false,
      blocks: [
        { type: 'text', content: { text: '# 用户反馈收集\n\n## 反馈基本信息' } },
        { type: 'field', content: { fieldType: 'text', label: '反馈来源', required: true } },
        { type: 'field', content: { fieldType: 'date', label: '反馈时间' } },
        { type: 'field', content: { fieldType: 'select', label: '反馈类型', options: ['功能建议', 'Bug反馈', '使用问题', '其他'] } },
        { type: 'field', content: { fieldType: 'select', label: '优先级', options: ['低', '中', '高', '紧急'] } },
        { type: 'text', content: { text: '## 详细描述' } },
        { type: 'field', content: { fieldType: 'text', label: '问题详情' } },
        { type: 'text', content: { text: '## 处理跟踪' } },
        { type: 'table', content: { title: '处理记录', data: [['时间', '处理人', '处理状态', '备注'], ['', '', '', '']] } }
      ]
    }
  ],

  // 版本数据
  versions: [
    {
      id: 'v_1',
      version: '1.0.0',
      name: '初始版本',
      author: '张三',
      timestamp: '2024-01-15 10:30:00',
      description: '文档初始创建版本，包含基本结构和内容框架',
      changes: [
        '创建文档基本结构',
        '添加项目概述章节',
        '定义初始需求条目'
      ],
      blockCount: 5,
      status: 'published',
      blocksSnapshot: []
    },
    {
      id: 'v_2',
      version: '1.1.0',
      name: '需求补充',
      author: '李四',
      timestamp: '2024-01-16 14:20:00',
      description: '补充详细需求分析和技术要求',
      changes: [
        '添加需求分析表格',
        '补充技术架构说明',
        '新增验收标准'
      ],
      blockCount: 8,
      status: 'published',
      blocksSnapshot: []
    },
    {
      id: 'v_3',
      version: '1.2.0',
      name: '架构优化',
      author: '王五',
      timestamp: '2024-01-17 09:15:00',
      description: '优化技术架构设计，调整实施方案',
      changes: [
        '重构技术架构图',
        '优化数据库设计',
        '调整开发时间线',
        '添加风险评估'
      ],
      blockCount: 12,
      status: 'published',
      blocksSnapshot: []
    },
    {
      id: 'v_4',
      version: '1.3.0-beta',
      name: 'Beta版本',
      author: '赵六',
      timestamp: '2024-01-18 16:45:00',
      description: '测试版本，包含最新功能特性',
      changes: [
        '添加用户界面设计',
        '补充测试用例',
        '更新API文档'
      ],
      blockCount: 15,
      status: 'draft',
      blocksSnapshot: []
    },
    {
      id: 'v_5',
      version: '2.0.0-rc1',
      name: '发布候选版',
      author: '张三',
      timestamp: '2024-01-20 11:30:00',
      description: '2.0版本发布候选，准备正式发布',
      changes: [
        '完善所有功能模块',
        '修复已知问题',
        '优化性能指标',
        '更新部署文档'
      ],
      blockCount: 18,
      status: 'review',
      blocksSnapshot: []
    },
    {
      id: 'v_6',
      version: '2.0.0',
      name: '正式发布版',
      author: '李四',
      timestamp: '2024-01-22 10:00:00',
      description: '2.0正式版本，包含完整功能和文档',
      changes: [
        '发布正式版本',
        '更新用户手册',
        '添加故障排除指南'
      ],
      blockCount: 20,
      status: 'published',
      blocksSnapshot: []
    }
  ],

  // 图形关系数据
  graphData: {
    nodes: [
      { id: 'node_1', label: '项目需求文档', type: 'document', x: 100, y: 100, color: '#3b82f6' },
      { id: 'node_2', label: '技术方案', type: 'document', x: 300, y: 150, color: '#10b981' },
      { id: 'node_3', label: '用户故事', type: 'requirement', x: 200, y: 250, color: '#f59e0b' },
      { id: 'node_4', label: 'API设计', type: 'technical', x: 400, y: 200, color: '#ef4444' },
      { id: 'node_5', label: '数据库设计', type: 'technical', x: 350, y: 300, color: '#8b5cf6' },
      { id: 'node_6', label: '测试用例', type: 'test', x: 150, y: 350, color: '#06b6d4' }
    ],
    edges: [
      { id: 'edge_1', source: 'node_1', target: 'node_2', label: '技术实现' },
      { id: 'edge_2', source: 'node_1', target: 'node_3', label: '需求分解' },
      { id: 'edge_3', source: 'node_2', target: 'node_4', label: '接口定义' },
      { id: 'edge_4', source: 'node_2', target: 'node_5', label: '数据存储' },
      { id: 'edge_5', source: 'node_3', target: 'node_6', label: '测试验证' },
      { id: 'edge_6', source: 'node_4', target: 'node_5', label: '数据交互' }
    ]
  },

  // Actions
  updateBlocks: (newBlocks) => set({ blocks: newBlocks }),
  
  // 文档管理方法
  addDocument: (document) => set((state) => ({
    documents: [...state.documents, document]
  })),
  
  setCurrentDocument: (document) => set((state) => {
    if (!document) return { currentDocument: document };
    
    // 更新最近打开的文档列表
    const recentlyOpened = state.recentlyOpenedDocuments.filter(id => id !== document.id);
    recentlyOpened.unshift(document.id);
    
    // 只保留最近的10个文档记录
    const limitedRecent = recentlyOpened.slice(0, 10);
    
    return {
      currentDocument: document,
      recentlyOpenedDocuments: limitedRecent
    };
  }),
  
  updateCurrentDocument: (updates) => set((state) => ({
    currentDocument: state.currentDocument ? { ...state.currentDocument, ...updates } : null,
    documents: state.documents.map(doc => 
      doc.id === state.currentDocument?.id ? { ...doc, ...updates } : doc
    )
  })),
  
  removeDocument: (documentId) => set((state) => ({
    documents: state.documents.filter(doc => doc.id !== documentId),
    currentDocument: state.currentDocument?.id === documentId ? null : state.currentDocument
  })),
  
  // 应用状态管理
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedBlocks: (blocks) => set({ selectedBlocks: blocks }),
  
  setCollaborativeMode: (enabled) => set({ isCollaborativeMode: enabled }),
  
  // 块与文档关联的方法
  addBlockToDocument: (documentId, block) => set((state) => ({
    documents: state.documents.map(doc =>
      doc.id === documentId 
        ? { ...doc, blocks: [...(doc.blocks || []), block] }
        : doc
    ),
    currentDocument: state.currentDocument?.id === documentId
      ? { ...state.currentDocument, blocks: [...(state.currentDocument.blocks || []), block] }
      : state.currentDocument
  })),
  
  updateBlockInDocument: (documentId, blockId, updates) => set((state) => ({
    documents: state.documents.map(doc =>
      doc.id === documentId 
        ? { 
            ...doc, 
            blocks: (doc.blocks || []).map(block => 
              block.id === blockId ? { ...block, ...updates } : block
            )
          }
        : doc
    ),
    currentDocument: state.currentDocument?.id === documentId
      ? { 
          ...state.currentDocument, 
          blocks: (state.currentDocument.blocks || []).map(block => 
            block.id === blockId ? { ...block, ...updates } : block
          )
        }
      : state.currentDocument
  })),
  
  deleteBlockFromDocument: (documentId, blockId) => set((state) => ({
    documents: state.documents.map(doc =>
      doc.id === documentId 
        ? { ...doc, blocks: (doc.blocks || []).filter(block => block.id !== blockId) }
        : doc
    ),
    currentDocument: state.currentDocument?.id === documentId
      ? { ...state.currentDocument, blocks: (state.currentDocument.blocks || []).filter(block => block.id !== blockId) }
      : state.currentDocument
  })),
  
  // 关系管理方法
  addDocumentRelationship: (sourceDocId, targetDocId, relationType, description = '') => set((state) => ({
    documentRelationships: [...state.documentRelationships, {
      id: `doc_rel_${Date.now()}`,
      sourceDocId,
      targetDocId,
      type: relationType,
      description,
      createdAt: new Date().toISOString(),
      strength: 1.0
    }]
  })),
  
  addBlockRelationship: (sourceBlockId, targetBlockId, relationType, description = '') => set((state) => ({
    blockRelationships: [...state.blockRelationships, {
      id: `block_rel_${Date.now()}`,
      sourceBlockId,
      targetBlockId,
      type: relationType,
      description,
      createdAt: new Date().toISOString(),
      strength: 1.0
    }]
  })),
  
  removeDocumentRelationship: (relationshipId) => set((state) => ({
    documentRelationships: state.documentRelationships.filter(rel => rel.id !== relationshipId)
  })),
  
  removeBlockRelationship: (relationshipId) => set((state) => ({
    blockRelationships: state.blockRelationships.filter(rel => rel.id !== relationshipId)
  })),
  
  getDocumentRelationships: (documentId) => {
    const state = get();
    return state.documentRelationships.filter(rel => 
      rel.sourceDocId === documentId || rel.targetDocId === documentId
    );
  },
  
  getBlockRelationships: (blockId) => {
    const state = get();
    return state.blockRelationships.filter(rel => 
      rel.sourceBlockId === blockId || rel.targetBlockId === blockId
    );
  },
  
  // 智能关系推荐
  suggestRelationships: (documentId) => {
    const state = get();
    const currentDoc = state.documents.find(doc => doc.id === documentId);
    if (!currentDoc) return [];
    
    const suggestions = [];
    
    // 基于内容相似性推荐
    state.documents.forEach(doc => {
      if (doc.id !== documentId) {
        // 简单的关键词匹配逻辑
        const currentKeywords = extractKeywords(currentDoc);
        const targetKeywords = extractKeywords(doc);
        const similarity = calculateSimilarity(currentKeywords, targetKeywords);
        
        if (similarity > 0.3) {
          suggestions.push({
            targetDocId: doc.id,
            targetDocTitle: doc.title,
            suggestedType: similarity > 0.7 ? 'derives' : 'relates',
            confidence: similarity,
            reason: `内容相似度: ${Math.round(similarity * 100)}%`
          });
        }
      }
    });
    
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  },
  
  // 现有的块管理方法
  addBlock: (block) => set((state) => ({
    blocks: [...state.blocks, {
      ...block,
      id: block.id || `block_${Date.now()}`,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...block.metadata
      }
    }]
  })),

  updateBlock: (blockId, updates) => set((state) => ({
    blocks: state.blocks.map(block =>
      block.id === blockId 
        ? { 
            ...block, 
            ...updates,
            metadata: {
              ...block.metadata,
              updatedAt: new Date().toISOString(),
              ...updates.metadata
            }
          }
        : block
    )
  })),

  deleteBlock: (blockId) => set((state) => ({
    blocks: state.blocks.filter(block => block.id !== blockId)
  })),

  saveVersion: (description) => set((state) => ({
    versions: [...state.versions, {
      id: `version_${Date.now()}`,
      timestamp: new Date().toISOString(),
      description: description || '手动保存',
      blocksSnapshot: JSON.parse(JSON.stringify(state.blocks))
    }]
  })),

  loadVersion: (versionId) => {
    const version = get().versions.find(v => v.id === versionId);
    if (version) {
      set({ blocks: version.blocksSnapshot });
    }
  },

  applyTemplate: (templateId) => {
    const template = get().templates.find(t => t.id === templateId);
    if (template) {
      const newBlocks = template.blocks.map((blockTemplate, index) => ({
        id: `block_${Date.now()}_${index}`,
        type: blockTemplate.type,
        content: { ...blockTemplate.content },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          templateId: templateId
        }
      }));
      set({ blocks: newBlocks });
    }
  },

  // 搜索功能
  searchBlocks: (query) => {
    const blocks = get().blocks;
    if (!query.trim()) return blocks;
    
    return blocks.filter(block => {
      const searchText = JSON.stringify(block.content).toLowerCase();
      return searchText.includes(query.toLowerCase());
    });
  },

  // 引用相关
  createReference: (sourceBlockId) => {
    const sourceBlock = get().blocks.find(b => b.id === sourceBlockId);
    if (sourceBlock) {
      const referenceBlock = {
        id: `ref_${Date.now()}`,
        type: 'reference',
        content: {
          sourceBlockId: sourceBlockId,
          sourceContent: sourceBlock.content,
          sourceType: sourceBlock.type,
          lastSyncTime: new Date().toISOString(),
          syncStatus: 'synced'
        },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      set((state) => ({
        blocks: [...state.blocks, referenceBlock]
      }));
      
      return referenceBlock.id;
    }
  },

  // 获取引用关系
  getReferences: (blockId) => {
    return get().blocks.filter(block => 
      block.type === 'reference' && block.content?.sourceBlockId === blockId
    );
  },

  // 文件夹管理方法
  setCurrentFolder: (folderId) => set({ currentFolderId: folderId }),

  addFolder: (folder) => set((state) => ({
    folders: [...state.folders, {
      ...folder,
      id: folder.id || `folder_${Date.now()}`,
      metadata: {
        ...folder.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }]
  })),

  updateFolder: (folderId, updates) => set((state) => ({
    folders: state.folders.map(folder =>
      folder.id === folderId 
        ? { 
            ...folder, 
            ...updates,
            metadata: {
              ...folder.metadata,
              ...updates.metadata,
              updatedAt: new Date().toISOString()
            }
          }
        : folder
    )
  })),

  removeFolder: (folderId) => set((state) => {
    // 移除文件夹时，将其中的文档移动到父文件夹或根目录
    const folderToRemove = state.folders.find(f => f.id === folderId);
    const newParentId = folderToRemove?.parentId || null;
    
    return {
      folders: state.folders.filter(folder => folder.id !== folderId),
      documents: state.documents.map(doc =>
        doc.folderId === folderId
          ? { ...doc, folderId: newParentId }
          : doc
      ),
      currentFolderId: state.currentFolderId === folderId ? newParentId : state.currentFolderId
    };
  }),

  // 文档移动方法
  moveDocuments: (documentIds, targetFolderId) => set((state) => ({
    documents: state.documents.map(doc =>
      documentIds.includes(doc.id)
        ? { ...doc, folderId: targetFolderId }
        : doc
    )
  })),

  moveDocumentToFolder: (documentId, folderId) => set((state) => ({
    documents: state.documents.map(doc =>
      doc.id === documentId
        ? { ...doc, folderId: folderId }
        : doc
    )
  })),

  // 批量操作方法
  removeMultipleDocuments: (documentIds) => set((state) => ({
    documents: state.documents.filter(doc => !documentIds.includes(doc.id)),
    currentDocument: documentIds.includes(state.currentDocument?.id) 
      ? null 
      : state.currentDocument
  })),

  duplicateDocument: (documentId) => set((state) => {
    const originalDoc = state.documents.find(doc => doc.id === documentId);
    if (!originalDoc) return state;

    const duplicatedDoc = {
      ...originalDoc,
      id: `doc_${Date.now()}`,
      title: `${originalDoc.title} - 副本`,
      blocks: originalDoc.blocks ? originalDoc.blocks.map((block, index) => ({
        ...block,
        id: `block_${Date.now()}_${index}`
      })) : [],
      metadata: {
        ...originalDoc.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    return {
      documents: [...state.documents, duplicatedDoc]
    };
  }),

  // 获取文件夹内容的辅助方法
  getDocumentsInFolder: (folderId) => {
    return get().documents.filter(doc => doc.folderId === folderId);
  },

  getSubfolders: (parentId) => {
    return get().folders.filter(folder => folder.parentId === parentId);
  },

  getFolderPath: (folderId) => {
    const folders = get().folders;
    const path = [];
    let currentId = folderId;
    
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parentId;
    }
    
    return path;
  },

  // 获取最近打开的文档
  getRecentlyOpenedDocuments: (limit = 6) => {
    const state = get();
    return state.recentlyOpenedDocuments
      .map(id => state.documents.find(doc => doc.id === id))
      .filter(Boolean) // 过滤掉已删除的文档
      .slice(0, limit);
  }
}));

// 辅助函数
const extractKeywords = (document) => {
  const text = JSON.stringify(document.blocks || document.content || '')
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff]/g, ' ');
  
  // 简单的关键词提取（实际项目中可使用更复杂的NLP技术）
  const words = text.split(/\s+/).filter(word => word.length > 2);
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

const calculateSimilarity = (keywords1, keywords2) => {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
};

export { useDocStore };
export default useDocStore;