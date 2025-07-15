import { create } from 'zustand';

const useDocStore = create((set, get) => ({
  // 文档数据
  documents: [],
  currentDocument: null,
  
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
  }
}));

export { useDocStore };
export default useDocStore;