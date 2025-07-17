import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Table,
  Calendar,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Zap,
  FileSearch,
  BarChart3,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail,
  Hash,
  Sparkles,
  Eye,
  Copy,
  Download,
  Edit3,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Search
} from 'lucide-react';
import './AIDocumentAnalyzer.css';

// 模拟AI分析结果
const generateDocumentAnalysis = (content, documentType = 'general') => {
  // 根据文档类型和内容生成不同的分析结果
  const baseAnalysis = {
    confidence: Math.random() * 0.3 + 0.7, // 70-100%
    processingTime: Math.random() * 2000 + 1000, // 1-3秒
    lastAnalyzed: new Date().toISOString()
  };

  // 智能检测文档类型
  const detectedType = (() => {
    if (content.includes('合同') || content.includes('协议') || content.includes('签约') || content.includes('甲方') || content.includes('乙方')) {
      return 'contract';
    }
    if (content.includes('技术') || content.includes('规范') || content.includes('标准') || content.includes('API') || content.includes('接口')) {
      return 'technical';
    }
    if (content.includes('开发') || content.includes('计划') || content.includes('项目') || content.includes('里程碑')) {
      return 'development_plan';
    }
    return 'general';
  })();

  const finalType = documentType !== 'general' ? documentType : detectedType;

  // 合同文档分析
  if (finalType === 'contract') {
    return {
      ...baseAnalysis,
      documentType: 'contract',
      extractedData: {
        tables: [
          {
            id: 'contract_info',
            title: '合同关键信息',
            type: 'contract',
            rows: 8,
            columns: 2,
            confidence: 0.94,
            data: [
              ['字段', '值'],
              ['合同编号', 'CT-2024-0156'],
              ['合同名称', '软件开发服务协议'],
              ['甲方', '某科技有限公司'],
              ['乙方', '技术服务提供商'],
              ['签约日期', '2024-07-15'],
              ['合同金额', '¥850,000'],
              ['履行期限', '2024-08-01 至 2024-12-31']
            ],
            insights: [
              '合同金额较大，建议设置分期付款节点',
              '履行期限跨度5个月，需要明确里程碑交付',
              '建议补充违约责任和知识产权条款'
            ]
          }
        ],
        keyInfo: [
          { type: 'contract_number', label: '合同编号', value: 'CT-2024-0156', confidence: 0.95, source: '自动识别', location: '第1段' },
          { type: 'currency', label: '合同金额', value: '¥850,000', confidence: 0.92, source: '数字识别', location: '第3段' },
          { type: 'date', label: '签约日期', value: '2024-07-15', confidence: 0.88, source: '日期提取', location: '第2段' },
          { type: 'date', label: '履行期限', value: '2024-08-01 至 2024-12-31', confidence: 0.90, source: '日期范围', location: '第4段' },
          { type: 'person', label: '甲方代表', value: '张总经理', confidence: 0.85, source: '实体识别', location: '第5段' },
          { type: 'person', label: '乙方代表', value: '李项目经理', confidence: 0.87, source: '实体识别', location: '第5段' }
        ],
        risks: [
          {
            id: 'contract_risk_1',
            title: '付款条款风险',
            level: 'medium',
            probability: 0.65,
            description: '合同中付款节点描述不够明确，可能导致付款纠纷',
            suggestion: '建议明确每个付款节点的具体条件和时间要求'
          },
          {
            id: 'contract_risk_2',
            title: '知识产权归属',
            level: 'high',
            probability: 0.78,
            description: '未明确说明开发成果的知识产权归属',
            suggestion: '需要补充知识产权条款，明确归属和使用范围'
          }
        ],
        suggestions: [
          {
            id: 'contract_suggestion_1',
            title: '添加里程碑管理',
            impact: 'high',
            effort: 'medium',
            description: '建议增加项目里程碑节点，便于进度管控和风险预警'
          },
          {
            id: 'contract_suggestion_2',
            title: '完善验收标准',
            impact: 'high',
            effort: 'low',
            description: '建议明确每个阶段的验收标准和验收流程'
          }
        ]
      }
    };
  }

  // 技术文档分析
  if (finalType === 'technical') {
    return {
      ...baseAnalysis,
      documentType: 'technical',
      extractedData: {
        tables: [
          {
            id: 'api_specs',
            title: 'API接口规范',
            type: 'technical',
            rows: 6,
            columns: 4,
            confidence: 0.91,
            data: [
              ['接口名称', '请求方式', '路径', '说明'],
              ['用户登录', 'POST', '/api/auth/login', '用户身份验证'],
              ['获取用户信息', 'GET', '/api/user/profile', '查询用户详细信息'],
              ['更新用户信息', 'PUT', '/api/user/profile', '修改用户基本信息'],
              ['文件上传', 'POST', '/api/upload/file', '上传文件到服务器'],
              ['数据导出', 'GET', '/api/data/export', '导出业务数据']
            ],
            insights: [
              '检测到5个主要API接口，建议补充参数说明',
              '缺少错误码定义，建议添加统一错误处理',
              '建议增加接口版本管理和向后兼容性说明'
            ]
          }
        ],
        keyInfo: [
          { type: 'target', label: 'API版本', value: 'v2.1.0', confidence: 0.93, source: '版本标识', location: '头部' },
          { type: 'target', label: '接口数量', value: '15个', confidence: 0.95, source: '计数统计', location: '全文' },
          { type: 'target', label: '认证方式', value: 'JWT Token', confidence: 0.89, source: '技术识别', location: '第2段' },
          { type: 'target', label: '数据格式', value: 'JSON', confidence: 0.94, source: '格式检测', location: '第3段' }
        ],
        risks: [
          {
            id: 'tech_risk_1',
            title: '缺少安全认证说明',
            level: 'high',
            probability: 0.82,
            description: '技术文档中缺少详细的安全认证和权限控制说明',
            suggestion: '建议补充JWT认证流程和权限验证机制'
          },
          {
            id: 'tech_risk_2',
            title: '版本兼容性风险',
            level: 'medium',
            probability: 0.68,
            description: '未说明不同版本间的兼容性和迁移方案',
            suggestion: '添加版本升级指南和兼容性矩阵'
          }
        ],
        suggestions: [
          {
            id: 'tech_suggestion_1',
            title: '增加示例代码',
            impact: 'high',
            effort: 'medium',
            description: '为每个API接口添加调用示例，提高文档可用性'
          },
          {
            id: 'tech_suggestion_2',
            title: '完善错误处理',
            impact: 'medium',
            effort: 'low',
            description: '统一错误码定义，建立标准错误处理流程'
          }
        ]
      }
    };
  }

  // 开发计划类型的特殊分析
  if (finalType === 'development_plan') {
    return {
      ...baseAnalysis,
      documentType: 'development_plan',
      extractedData: {
        tables: [
          {
            id: 'schedule_table',
            title: '开发时间表',
            type: 'schedule',
            rows: 6,
            columns: 5,
            confidence: 0.92,
            data: [
              ['阶段', '任务', '负责人', '开始时间', '结束时间'],
              ['需求分析', '需求收集与整理', '产品经理', '2024-01-15', '2024-01-28'],
              ['UI设计', '界面设计与原型', '设计师', '2024-01-20', '2024-02-10'],
              ['前端开发', '页面开发与交互', '前端工程师', '2024-02-01', '2024-03-15'],
              ['后端开发', 'API接口开发', '后端工程师', '2024-02-05', '2024-03-20'],
              ['测试阶段', '功能测试与修复', '测试工程师', '2024-03-10', '2024-03-30']
            ],
            insights: [
              '检测到前后端开发有重叠期，建议加强沟通协调',
              '测试阶段时间较短，建议预留更多测试时间',
              '关键路径：需求分析 → UI设计 → 前端开发'
            ]
          },
          {
            id: 'budget_table',
            title: '预算分配表',
            type: 'budget',
            rows: 5,
            columns: 4,
            confidence: 0.88,
            data: [
              ['项目', '预算(万元)', '占比', '备注'],
              ['人力成本', '120', '60%', '包含开发、设计、测试人员'],
              ['硬件设备', '30', '15%', '服务器、测试设备等'],
              ['软件工具', '20', '10%', '开发工具、云服务等'],
              ['其他费用', '30', '15%', '培训、差旅等']
            ],
            insights: [
              '人力成本占比合理，符合软件项目特点',
              '建议增加10%的风险预算',
              '云服务费用可能需要根据用户增长调整'
            ]
          }
        ],
        keyInfo: [
          { type: 'date', label: '项目开始时间', value: '2024年1月15日', confidence: 0.95, source: '自动识别', location: '第二段落' },
          { type: 'date', label: '预计完成时间', value: '2024年3月30日', confidence: 0.93, source: '时间表提取', location: '时间表' },
          { type: 'currency', label: '总预算', value: '200万元', confidence: 0.90, source: '数字识别', location: '预算部分' },
          { type: 'person', label: '项目经理', value: '张三', confidence: 0.87, source: '实体识别', location: '团队成员' },
          { type: 'person', label: '技术负责人', value: '李工程师', confidence: 0.84, source: '角色识别', location: '第三段' },
          { type: 'target', label: '目标用户数', value: '10万+', confidence: 0.85, source: '指标提取', location: '项目目标' },
          { type: 'target', label: '开发周期', value: '75天', confidence: 0.92, source: '计算得出', location: '时间表分析' }
        ],
        risks: [
          {
            id: 'dev_risk_1',
            title: '段落内容冲突',
            level: 'medium',
            probability: 0.72,
            description: '检测到第3段与第5段关于技术栈的描述存在不一致',
            suggestion: '建议统一技术栈描述，确保前后一致性'
          },
          {
            id: 'dev_risk_2',
            title: '时间安排冲突',
            level: 'high',
            probability: 0.85,
            description: '前端开发与后端开发时间重叠过多，可能导致接口对接问题',
            suggestion: '建议调整开发时序，确保接口设计先行完成'
          },
          {
            id: 'dev_risk_3',
            title: '引用信息过期',
            level: 'low',
            probability: 0.45,
            description: '引用的设计规范文档可能已更新，需要校验最新版本',
            suggestion: '定期检查引用文档的版本一致性'
          }
        ],
        suggestions: [
          {
            id: 'dev_suggestion_1',
            title: '添加里程碑检查点',
            impact: 'high',
            effort: 'low',
            description: '在关键节点增加里程碑检查，及时发现和解决问题'
          },
          {
            id: 'dev_suggestion_2',
            title: '完善测试策略',
            impact: 'high',
            effort: 'medium',
            description: '当前测试时间偏少，建议增加自动化测试和性能测试'
          },
          {
            id: 'dev_suggestion_3',
            title: '引入代码审查',
            impact: 'medium',
            effort: 'low',
            description: '建立代码审查流程，提高代码质量和团队协作'
          }
        ]
      }
    };
  }

  // 通用文档分析
  return {
    ...baseAnalysis,
    documentType: 'general',
    extractedData: {
      tables: [
        {
          id: 'general_table',
          title: '数据表格',
          type: 'data',
          rows: 4,
          columns: 3,
          confidence: 0.85,
          data: [
            ['项目', '状态', '负责人'],
            ['需求分析', '进行中', '张三'],
            ['技术调研', '已完成', '李四'],
            ['原型设计', '待开始', '王五']
          ],
          insights: [
            '检测到项目进度表格，建议补充时间节点',
            '负责人分配明确，便于任务跟踪',
            '建议添加优先级和完成时间列'
          ]
        }
      ],
      keyInfo: [
        { type: 'date', label: '创建时间', value: new Date().toLocaleDateString(), confidence: 0.95, source: '文档属性', location: '文档头部' },
        { type: 'person', label: '作者', value: '当前用户', confidence: 0.90, source: '系统识别', location: '文档属性' },
        { type: 'target', label: '文档类型', value: '通用文档', confidence: 0.88, source: '内容分析', location: '全文' },
        { type: 'target', label: '字数统计', value: content.length + '字符', confidence: 1.0, source: '计算得出', location: '全文' }
      ],
      risks: [
        {
          id: 'general_risk_1',
          title: '段落逻辑冲突',
          level: 'low',
          probability: 0.35,
          description: '部分段落之间的逻辑关系不够清晰，可能存在内容重复',
          suggestion: '建议重新整理段落结构，确保逻辑清晰'
        },
        {
          id: 'general_risk_2',
          title: '引用格式不统一',
          level: 'medium',
          probability: 0.58,
          description: '文档中的引用格式存在不一致，影响专业性',
          suggestion: '建议统一引用格式，遵循既定标准'
        },
        {
          id: 'general_risk_3',
          title: '术语使用不一致',
          level: 'medium',
          probability: 0.62,
          description: '同一概念在不同段落中使用了不同术语',
          suggestion: '建议建立术语表，确保全文术语统一'
        }
      ],
      suggestions: [
        {
          id: 'general_suggestion_1',
          title: '添加目录结构',
          impact: 'medium',
          effort: 'low',
          description: '为文档添加清晰的目录结构，便于阅读和导航'
        },
        {
          id: 'general_suggestion_2',
          title: '建立术语统一检查',
          impact: 'high',
          effort: 'low',
          description: '建立自动术语检查机制，确保文档用词一致性'
        },
        {
          id: 'general_suggestion_3',
          title: '完善引用标注',
          impact: 'medium',
          effort: 'medium',
          description: '为重要观点和数据添加来源引用，提高文档可信度'
        }
      ]
    }
  };
};

const AIDocumentAnalyzer = ({ 
  documentContent = '',
  documentType = 'general',
  isVisible = true,
  onExtractedDataApply,
  onSuggestionApply,
  className = ''
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('tables');
  const [expandedTable, setExpandedTable] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailModalContent, setDetailModalContent] = useState(null);
  const analysisRef = useRef(null);

  // 自动分析文档内容
  useEffect(() => {
    if (documentContent && documentContent.length > 50) {
      analyzeDocument();
    }
  }, [documentContent, documentType]);

  const analyzeDocument = async () => {
    setIsAnalyzing(true);
    
    // 模拟AI分析过程
    setTimeout(() => {
      const result = generateDocumentAnalysis(documentContent, documentType);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, result.processingTime || 2000);
  };

  const handleApplyTable = (table) => {
    onExtractedDataApply?.({
      type: 'table',
      data: table
    });
  };

  const handleApplyKeyInfo = (info) => {
    onExtractedDataApply?.({
      type: 'keyInfo',
      data: info
    });
  };

  const handleApplySuggestion = (suggestion) => {
    onSuggestionApply?.(suggestion);
  };

  const showDetailView = (type, data) => {
    setDetailModalContent({ type, data });
    setShowDetailModal(true);
  };

  if (!isVisible) return null;

  return (
    <div className={`ai-document-analyzer ${className}`}>
      {/* 分析器头部 */}
      <div className="analyzer-header">
        <div className="header-left">
          <div className="ai-icon">
            <Brain size={20} />
            <Sparkles className="sparkle" size={12} />
          </div>
          <div className="header-info">
            <h3>AI文档分析</h3>
            {analysis && (
              <p>置信度 {Math.round(analysis.confidence * 100)}% • 已识别 {analysis.extractedData?.tables?.length || 0} 个表格</p>
            )}
          </div>
        </div>
        
        <div className="header-actions">
          {analysis && (
            <button 
              className="refresh-btn"
              onClick={analyzeDocument}
              disabled={isAnalyzing}
            >
              <Zap size={16} />
              重新分析
            </button>
          )}
        </div>
      </div>

      {/* 分析状态 */}
      {isAnalyzing && (
        <div className="analyzing-state">
          <div className="analyzing-animation">
            <div className="pulse-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <p>正在分析文档内容...</p>
          </div>
          <div className="analyzing-steps">
            <div className="step active">
              <CheckCircle size={16} />
              <span>内容解析</span>
            </div>
            <div className="step active">
              <CheckCircle size={16} />
              <span>结构识别</span>
            </div>
            <div className="step">
              <Clock size={16} />
              <span>智能提取</span>
            </div>
          </div>
        </div>
      )}

      {/* 分析结果 */}
      {analysis && !isAnalyzing && (
        <div className="analysis-results">
          {/* 标签页导航 */}
          <div className="analysis-tabs">
            <button 
              className={`tab ${activeTab === 'tables' ? 'active' : ''}`}
              onClick={() => setActiveTab('tables')}
            >
              <Table size={16} />
              表格数据 ({analysis.extractedData?.tables?.length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'keyinfo' ? 'active' : ''}`}
              onClick={() => setActiveTab('keyinfo')}
            >
              <Target size={16} />
              关键信息 ({analysis.extractedData?.keyInfo?.length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'risks' ? 'active' : ''}`}
              onClick={() => setActiveTab('risks')}
            >
              <AlertTriangle size={16} />
              风险识别 ({analysis.extractedData?.risks?.length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              <Lightbulb size={16} />
              优化建议 ({analysis.extractedData?.suggestions?.length || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <CheckCircle size={16} />
              校核流程
            </button>
          </div>

          {/* 表格数据标签页 */}
          {activeTab === 'tables' && (
            <div className="tables-section">
              {analysis.extractedData?.tables?.map((table, index) => (
                <div key={table.id} className="table-card">
                  <div className="table-header">
                    <div className="table-info">
                      <h4>{table.title}</h4>
                      <div className="table-meta">
                        <span className="table-size">{table.rows}行 × {table.columns}列</span>
                        <span className="confidence">置信度 {Math.round(table.confidence * 100)}%</span>
                        <span className={`table-type ${table.type}`}>
                          {table.type === 'schedule' && '时间表'}
                          {table.type === 'budget' && '预算表'}
                          {table.type === 'data' && '数据表'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="table-actions">
                      <button 
                        className="action-btn preview"
                        onClick={() => showDetailView('table', table)}
                      >
                        <Eye size={14} />
                        预览
                      </button>
                      <button 
                        className="action-btn apply"
                        onClick={() => handleApplyTable(table)}
                      >
                        <Plus size={14} />
                        插入
                      </button>
                    </div>
                  </div>

                  {/* 表格预览 */}
                  <div className="table-preview">
                    <table>
                      <thead>
                        <tr>
                          {table.data[0]?.map((header, i) => (
                            <th key={i}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.data.slice(1, 4).map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {table.data.length > 4 && (
                      <div className="table-more">
                        还有 {table.data.length - 4} 行数据...
                      </div>
                    )}
                  </div>

                  {/* 表格洞察 */}
                  {table.insights && table.insights.length > 0 && (
                    <div className="table-insights">
                      <h5>智能洞察</h5>
                      <ul>
                        {table.insights.map((insight, i) => (
                          <li key={i}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 关键信息标签页 */}
          {activeTab === 'keyinfo' && (
            <div className="keyinfo-section">
              <div className="keyinfo-grid">
                {analysis.extractedData?.keyInfo?.map((info, index) => (
                  <div key={index} className={`keyinfo-card ${info.type}`}>
                    <div className="keyinfo-icon">
                      {info.type === 'date' && <Calendar size={20} />}
                      {info.type === 'currency' && <DollarSign size={20} />}
                      {info.type === 'person' && <Users size={20} />}
                      {info.type === 'target' && <Target size={20} />}
                      {info.type === 'phone' && <Phone size={20} />}
                      {info.type === 'email' && <Mail size={20} />}
                      {info.type === 'location' && <MapPin size={20} />}
                    </div>
                    
                    <div className="keyinfo-content">
                      <div className="keyinfo-label">{info.label}</div>
                      <div className="keyinfo-value">{info.value}</div>
                      <div className="keyinfo-meta">
                        <span className="location">来源: {info.location}</span>
                        <span className="confidence">置信度 {Math.round(info.confidence * 100)}%</span>
                      </div>
                    </div>

                    <div className="keyinfo-actions">
                      <button 
                        className="action-btn copy"
                        onClick={() => navigator.clipboard.writeText(info.value)}
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        className="action-btn apply"
                        onClick={() => handleApplyKeyInfo(info)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 风险识别标签页 */}
          {activeTab === 'risks' && (
            <div className="risks-section">
              {analysis.extractedData?.risks?.map((risk, index) => (
                <div key={index} className={`risk-card ${risk.level}`}>
                  <div className="risk-header">
                    <div className="risk-indicator">
                      <AlertTriangle size={18} />
                    </div>
                    <div className="risk-content">
                      <div className="risk-title">
                        <h4>{risk.title}</h4>
                        <span className={`risk-level ${risk.level}`}>
                          {risk.level === 'high' && '高风险'}
                          {risk.level === 'medium' && '中风险'}
                          {risk.level === 'low' && '低风险'}
                        </span>
                        <span className="probability">
                          风险概率 {Math.round(risk.probability * 100)}%
                        </span>
                      </div>
                      <p className="risk-description">{risk.description}</p>
                      <div className="risk-suggestion">
                        <strong>建议措施:</strong> {risk.suggestion}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 优化建议标签页 */}
          {activeTab === 'suggestions' && (
            <div className="suggestions-section">
              {analysis.extractedData?.suggestions?.map((suggestion, index) => (
                <div key={index} className="suggestion-card">
                  <div className="suggestion-header">
                    <div className="suggestion-icon">
                      <Lightbulb size={18} />
                    </div>
                    <div className="suggestion-content">
                      <div className="suggestion-title">
                        <h4>{suggestion.title}</h4>
                        <div className="suggestion-badges">
                          <span className={`impact ${suggestion.impact}`}>
                            {suggestion.impact === 'high' && '高影响'}
                            {suggestion.impact === 'medium' && '中影响'}
                            {suggestion.impact === 'low' && '低影响'}
                          </span>
                          <span className={`effort ${suggestion.effort}`}>
                            {suggestion.effort === 'high' && '高成本'}
                            {suggestion.effort === 'medium' && '中成本'}
                            {suggestion.effort === 'low' && '低成本'}
                          </span>
                        </div>
                      </div>
                      <p className="suggestion-description">{suggestion.description}</p>
                      
                      <div className="suggestion-actions">
                        <button 
                          className="apply-btn"
                          onClick={() => handleApplySuggestion(suggestion)}
                        >
                          <Zap size={14} />
                          应用建议
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 校核流程标签页 */}
          {activeTab === 'audit' && (
            <div className="audit-section">
              <div className="audit-workflow">
                <h4 style={{ marginBottom: '20px', color: '#374151', fontSize: '16px', fontWeight: '600' }}>
                  文档校核工作流
                </h4>
                
                {/* 校核流程步骤 */}
                <div className="audit-steps">
                  <div className="audit-step completed">
                    <div className="step-icon">
                      <CheckCircle size={16} />
                    </div>
                    <div className="step-content">
                      <h5>自动检查</h5>
                      <p>术语统一性、格式规范、引用完整性检查</p>
                      <span className="step-status">已完成 - 2分钟前</span>
                    </div>
                  </div>
                  
                  <div className="audit-step active">
                    <div className="step-icon">
                      <Clock size={16} />
                    </div>
                    <div className="step-content">
                      <h5>专家审阅</h5>
                      <p>等待技术专家李工程师审阅</p>
                      <span className="step-status">进行中 - 已分配</span>
                    </div>
                  </div>
                  
                  <div className="audit-step pending">
                    <div className="step-icon">
                      <User size={16} />
                    </div>
                    <div className="step-content">
                      <h5>反馈处理</h5>
                      <p>处理专家反馈并修改文档</p>
                      <span className="step-status">待开始</span>
                    </div>
                  </div>
                  
                  <div className="audit-step pending">
                    <div className="step-icon">
                      <FileSearch size={16} />
                    </div>
                    <div className="step-content">
                      <h5>最终校核</h5>
                      <p>专家确认修改内容</p>
                      <span className="step-status">待开始</span>
                    </div>
                  </div>
                </div>

                {/* 自动检查结果 */}
                <div className="auto-check-results">
                  <h5 style={{ marginBottom: '16px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>
                    自动检查结果
                  </h5>
                  
                  <div className="check-item">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    <span>术语统一性检查 - 通过</span>
                  </div>
                  
                  <div className="check-item">
                    <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                    <span>引用格式检查 - 发现3处不一致</span>
                  </div>
                  
                  <div className="check-item">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    <span>排版规范检查 - 通过</span>
                  </div>
                  
                  <div className="check-item">
                    <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                    <span>段落冲突检测 - 发现1处潜在冲突</span>
                  </div>
                </div>

                {/* 校核操作 */}
                <div className="audit-actions">
                  <button 
                    className="action-btn apply"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '10px 16px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                  >
                    <FileSearch size={14} />
                    触发专家复审
                  </button>
                  
                  <button 
                    className="action-btn preview"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '10px 16px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} />
                    导出校核报告
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 详情模态框 */}
      {showDetailModal && detailModalContent && (
        <div className="detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {detailModalContent.type === 'table' && '表格详情'}
                {detailModalContent.data.title}
              </h3>
              <button 
                className="close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {detailModalContent.type === 'table' && (
                <div className="table-detail">
                  <table className="detail-table">
                    <thead>
                      <tr>
                        {detailModalContent.data.data[0]?.map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detailModalContent.data.data.slice(1).map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn secondary"
                onClick={() => setShowDetailModal(false)}
              >
                关闭
              </button>
              <button 
                className="btn primary"
                onClick={() => {
                  if (detailModalContent.type === 'table') {
                    handleApplyTable(detailModalContent.data);
                  }
                  setShowDetailModal(false);
                }}
              >
                <Plus size={14} />
                插入到文档
              </button>
            </div>
          </div>
          <div 
            className="modal-backdrop"
            onClick={() => setShowDetailModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AIDocumentAnalyzer;
