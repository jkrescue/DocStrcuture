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
  Search,
  FileText,
  Shield,
  GitBranch,
  RefreshCw
} from 'lucide-react';
import './AIDocumentAnalyzer_Enhanced.css';

// 基于AI_support.md规范的AI分析结果生成器
const generateDocumentAnalysis = (content, documentType = 'general') => {
  // 基础分析信息
  const baseAnalysis = {
    confidence: Math.random() * 0.3 + 0.7, // 70-100%
    processingTime: Math.random() * 2000 + 1000, // 1-3秒
    lastAnalyzed: new Date().toISOString()
  };

  // 智能检测文档类型（车型研发场景）
  const detectedType = (() => {
    if (content.includes('车型') || content.includes('汽车') || content.includes('整车') || content.includes('底盘') || content.includes('发动机') || content.includes('变速箱')) {
      if (content.includes('需求') || content.includes('规格') || content.includes('参数')) {
        return 'vehicle_requirements';
      }
      if (content.includes('设计') || content.includes('方案') || content.includes('图纸')) {
        return 'vehicle_design';
      }
      if (content.includes('测试') || content.includes('试验') || content.includes('验证')) {
        return 'vehicle_testing';
      }
      return 'vehicle_project';
    }
    if (content.includes('项目') && (content.includes('进度') || content.includes('计划') || content.includes('里程碑'))) {
      return 'project_management';
    }
    if (content.includes('技术') || content.includes('规范') || content.includes('标准') || content.includes('工艺') || content.includes('制造')) {
      return 'technical_spec';
    }
    if (content.includes('开发') && (content.includes('周报') || content.includes('月报') || content.includes('报告'))) {
      return 'development_report';
    }
    if (content.includes('合同') || content.includes('协议') || content.includes('签约') || content.includes('甲方') || content.includes('乙方')) {
      return 'contract';
    }
    return 'general';
  })();

  const finalType = documentType !== 'general' ? documentType : detectedType;

  // 根据AI_support.md规范生成四大核心功能分析
  return {
    ...baseAnalysis,
    documentType: finalType,
    
    // 1. 【信息抽取自动化】- 核心功能
    extractedFields: generateExtractedFields(content, finalType),
    
    // 2. 【段落冲突检测】- 核心功能  
    conflictDetection: generateConflictDetection(content, finalType),
    
    // 3. 【引用合规性校验】- 核心功能
    referenceValidation: generateReferenceValidation(content, finalType),
    
    // 4. 【校核工作流】- 核心功能
    auditWorkflow: generateAuditWorkflow(content, finalType)
  };
};

// 1. 信息抽取自动化功能（车型研发场景优化）
const generateExtractedFields = (content, documentType) => {
  // 车型需求规格文档
  if (documentType === 'vehicle_requirements') {
    return {
      title: '车型需求信息提取',
      description: '自动识别车型研发需求规格中的关键参数',
      fields: [
        { 
          id: 'vehicle_model',
          label: '车型代码', 
          value: 'VH-2024-SUV-001', 
          confidence: 0.95,
          source: '标题识别',
          location: '文档头部',
          editable: true,
          validated: true,
          extractionMethod: '车型编码模式识别'
        },
        { 
          id: 'engine_type',
          label: '发动机类型', 
          value: '2.0T涡轮增压', 
          confidence: 0.92,
          source: '技术规格',
          location: '动力系统章节',
          editable: true,
          validated: false,
          extractionMethod: '发动机规格提取'
        },
        { 
          id: 'transmission',
          label: '变速箱', 
          value: '8AT自动变速箱', 
          confidence: 0.90,
          source: '技术规格',
          location: '传动系统章节',
          editable: true,
          validated: false,
          extractionMethod: '变速箱类型识别'
        },
        { 
          id: 'fuel_consumption',
          label: '油耗指标', 
          value: '7.8L/100km', 
          confidence: 0.88,
          source: '性能参数',
          location: '燃油经济性章节',
          editable: true,
          validated: false,
          extractionMethod: '数值单位识别'
        },
        { 
          id: 'wheelbase',
          label: '轴距', 
          value: '2750mm', 
          confidence: 0.94,
          source: '车身尺寸',
          location: '外观设计章节',
          editable: true,
          validated: true,
          extractionMethod: '尺寸参数提取'
        },
        { 
          id: 'target_market',
          label: '目标市场', 
          value: '中高端SUV市场', 
          confidence: 0.85,
          source: '市场定位',
          location: '产品定位章节',
          editable: true,
          validated: false,
          extractionMethod: 'NLP市场分析'
        }
      ],
      exportFormats: ['JSON', 'CSV', 'Excel'],
      template: 'vehicle_requirements_template_v1.0',
      autoRecognitionPatterns: [
        '车型代码: VH-YYYY-TYPE-NNN',
        '发动机: N.NT/自然吸气/混动',
        '变速箱: NAT/CVT/DCT',
        '油耗: N.NL/100km',
        '尺寸: NNNNmm'
      ]
    };
  }
  
  // 车型设计文档
  if (documentType === 'vehicle_design') {
    return {
      title: '车型设计信息提取',
      description: '自动识别车型设计方案中的关键设计要素',
      fields: [
        { 
          id: 'design_phase',
          label: '设计阶段', 
          value: 'CD阶段', 
          confidence: 0.93,
          source: '阶段标识',
          location: '项目状态',
          editable: true,
          validated: true,
          extractionMethod: '设计阶段识别'
        },
        { 
          id: 'styling_theme',
          label: '造型主题', 
          value: '运动时尚', 
          confidence: 0.87,
          source: '设计理念',
          location: '外观设计章节',
          editable: true,
          validated: false,
          extractionMethod: '设计风格提取'
        },
        { 
          id: 'material_type',
          label: '主要材料', 
          value: '高强度钢+铝合金', 
          confidence: 0.91,
          source: '材料规格',
          location: '车身结构章节',
          editable: true,
          validated: false,
          extractionMethod: '材料类型识别'
        },
        { 
          id: 'safety_rating',
          label: '安全等级', 
          value: 'C-NCAP 5星', 
          confidence: 0.89,
          source: '安全标准',
          location: '安全性能章节',
          editable: true,
          validated: false,
          extractionMethod: '安全标准提取'
        }
      ],
      exportFormats: ['JSON', 'CSV', 'Excel'],
      template: 'vehicle_design_template_v1.0',
      autoRecognitionPatterns: [
        '设计阶段: CD|DD|PD|SOP',
        '材料: 钢|铝|碳纤维|复合材料',
        '安全等级: C-NCAP|E-NCAP|IIHS',
        '造型: 运动|商务|时尚|越野'
      ]
    };
  }
  
  // 车型测试文档
  if (documentType === 'vehicle_testing') {
    return {
      title: '车型测试信息提取',
      description: '自动识别车型测试验证中的关键测试数据',
      fields: [
        { 
          id: 'test_type',
          label: '测试类型', 
          value: '整车道路测试', 
          confidence: 0.95,
          source: '测试分类',
          location: '测试计划',
          editable: true,
          validated: true,
          extractionMethod: '测试类型识别'
        },
        { 
          id: 'test_mileage',
          label: '测试里程', 
          value: '50000km', 
          confidence: 0.92,
          source: '里程统计',
          location: '测试进度',
          editable: true,
          validated: false,
          extractionMethod: '里程数值提取'
        },
        { 
          id: 'durability_result',
          label: '耐久性结果', 
          value: '通过', 
          confidence: 0.88,
          source: '测试结果',
          location: '耐久性测试章节',
          editable: true,
          validated: false,
          extractionMethod: '结果状态识别'
        },
        { 
          id: 'emission_level',
          label: '排放标准', 
          value: '国六B', 
          confidence: 0.94,
          source: '排放测试',
          location: '环保性能章节',
          editable: true,
          validated: true,
          extractionMethod: '排放标准识别'
        }
      ],
      exportFormats: ['JSON', 'CSV', 'Excel'],
      template: 'vehicle_testing_template_v1.0',
      autoRecognitionPatterns: [
        '测试类型: 整车|部件|系统|材料',
        '里程: NNNNNkm',
        '结果: 通过|失败|待定',
        '排放: 国六|欧六|美标'
      ]
    };
  }
  
  // 车型项目管理文档
  if (documentType === 'vehicle_project') {
    return {
      title: '车型项目信息提取',
      description: '自动识别车型项目管理中的关键项目信息',
      fields: [
        { 
          id: 'project_code',
          label: '项目代码', 
          value: 'P2024-SUV-001', 
          confidence: 0.96,
          source: '项目标识',
          location: '项目基本信息',
          editable: true,
          validated: true,
          extractionMethod: '项目编码识别'
        },
        { 
          id: 'sop_date',
          label: 'SOP时间', 
          value: '2025年12月', 
          confidence: 0.91,
          source: '时间计划',
          location: '项目里程碑',
          editable: true,
          validated: false,
          extractionMethod: '日期提取'
        },
        { 
          id: 'project_budget',
          label: '项目预算', 
          value: '15亿元', 
          confidence: 0.89,
          source: '预算信息',
          location: '项目投资',
          editable: true,
          validated: false,
          extractionMethod: '金额识别'
        },
        { 
          id: 'team_size',
          label: '团队规模', 
          value: '280人', 
          confidence: 0.87,
          source: '组织架构',
          location: '项目团队',
          editable: true,
          validated: false,
          extractionMethod: '人员数量统计'
        }
      ],
      exportFormats: ['JSON', 'CSV', 'Excel'],
      template: 'vehicle_project_template_v1.0',
      autoRecognitionPatterns: [
        '项目代码: P-YYYY-TYPE-NNN',
        'SOP: YYYY年MM月',
        '预算: NN亿元/NN万元',
        '团队: NNN人'
      ]
    };
  }
  
  // 项目管理文档
  if (documentType === 'project_management') {
    return {
      title: '项目管理信息提取',
      description: '自动识别项目管理文档中的关键项目信息',
      fields: [
        { 
          id: 'project_name',
          label: '项目名称', 
          value: '新能源SUV开发项目', 
          confidence: 0.94,
          source: '标题识别',
          location: '项目概述',
          editable: true,
          validated: true,
          extractionMethod: '项目名称提取'
        },
        { 
          id: 'project_manager',
          label: '项目经理', 
          value: '张工程师', 
          confidence: 0.89,
          source: '人员信息',
          location: '项目团队',
          editable: true,
          validated: false,
          extractionMethod: '人员角色识别'
        },
        { 
          id: 'completion_rate',
          label: '完成进度', 
          value: '65%', 
          confidence: 0.92,
          source: '进度统计',
          location: '进度跟踪',
          editable: true,
          validated: false,
          extractionMethod: '百分比提取'
        },
        { 
          id: 'milestone_count',
          label: '里程碑数量', 
          value: '8个', 
          confidence: 0.87,
          source: '里程碑统计',
          location: '项目计划',
          editable: true,
          validated: false,
          extractionMethod: '数量统计'
        }
      ],
      exportFormats: ['JSON', 'CSV', 'Excel'],
      template: 'project_management_template_v1.0',
      autoRecognitionPatterns: [
        '项目: XX项目/XX开发',
        '进度: NN%',
        '里程碑: NN个',
        '经理: XX工程师/XX经理'
      ]
    };
  }
  
  // 技术规范文档  
  if (documentType === 'technical_spec') {
    return {
      title: '技术规范信息提取',
      description: '自动识别技术规范文档中的关键技术参数',
      fields: [
        { 
          id: 'spec_version',
          label: '规范版本', 
          value: 'v2.1.0', 
          confidence: 0.95,
          source: '版本标识',
          location: '文档头部',
          editable: true,
          validated: true,
          extractionMethod: '版本号识别'
        },
        { 
          id: 'technical_standard',
          label: '技术标准', 
          value: 'GB/T 19596-2017', 
          confidence: 0.91,
          source: '标准引用',
          location: '标准章节',
          editable: true,
          validated: false,
          extractionMethod: '标准编号识别'
        },
        { 
          id: 'tolerance_level',
          label: '公差等级', 
          value: '±0.1mm', 
          confidence: 0.89,
          source: '精度要求',
          location: '技术要求',
          editable: true,
          validated: false,
          extractionMethod: '公差值提取'
        }
      ],
      exportFormats: ['JSON', 'CSV', 'Excel'],
      template: 'technical_spec_template_v1.0',
      autoRecognitionPatterns: [
        '版本: vN.N.N',
        '标准: GB/T|ISO|SAE',
        '公差: ±N.Nmm'
      ]
    };
  }
  
  // 原有的合同文档处理
  if (documentType === 'contract') {
    return {
      title: '自动提取字段',
      description: '基于合同模板自动识别关键信息',
      fields: [
        { 
          id: 'contract_number',
          label: '合同编号', 
          value: 'CT-2024-0156', 
          confidence: 0.95,
          source: 'OCR识别',
          location: '文档头部',
          editable: true,
          validated: false,
          extractionMethod: 'AI + 规则引擎'
        },
        { 
          id: 'contract_amount',
          label: '合同金额', 
          value: '¥850,000', 
          confidence: 0.92,
          source: '数字识别',
          location: '第3段',
          editable: true,
          validated: false,
          extractionMethod: 'NLP数字识别'
        },
        { 
          id: 'sign_date',
          label: '签约日期', 
          value: '2024-07-15', 
          confidence: 0.88,
          source: '日期提取',
          location: '第2段',
          editable: true,
          validated: false,
          extractionMethod: '日期模式匹配'
        },
        { 
          id: 'party_a',
          label: '甲方', 
          value: '某科技有限公司', 
          confidence: 0.90,
          source: '实体识别',
          location: '第1段',
          editable: true,
          validated: false,
          extractionMethod: 'NLP实体识别'
        },
        { 
          id: 'party_b',
          label: '乙方', 
          value: '技术服务提供商', 
          confidence: 0.87,
          source: '实体识别',
          location: '第1段',
          editable: true,
          validated: false,
          extractionMethod: 'NLP实体识别'
        },
        { 
          id: 'duration',
          label: '履行期限', 
          value: '2024-08-01 至 2024-12-31', 
          confidence: 0.85,
          source: '时间范围识别',
          location: '第4段',
          editable: true,
          validated: false,
          extractionMethod: '时间范围解析'
        }
      ],
      exportFormats: ['JSON', 'CSV', 'Excel'],
      template: 'contract_template_v2.1',
      autoRecognitionPatterns: [
        '合同编号模式: CT-YYYY-NNNN',
        '金额模式: ¥数字+万/元',
        '日期模式: YYYY-MM-DD',
        '公司实体模式: XX有限公司/XX股份有限公司'
      ]
    };
  }
  
  if (documentType === 'development_report') {
    return {
      title: '自动提取字段',
      description: '基于开发报告模板自动识别进度信息',
      fields: [
        { 
          id: 'report_date',
          label: '报告日期', 
          value: '2025年7月17日', 
          confidence: 0.98,
          source: 'OCR识别',
          location: '文档标题',
          editable: true,
          validated: true,
          extractionMethod: 'OCR + 日期解析'
        },
        { 
          id: 'report_period',
          label: '报告周期', 
          value: '第29周', 
          confidence: 0.85,
          source: '时间计算',
          location: '副标题',
          editable: true,
          validated: false,
          extractionMethod: '周期计算'
        },
        { 
          id: 'total_tasks',
          label: '总任务数', 
          value: '5个功能', 
          confidence: 0.95,
          source: '表格统计',
          location: '进度表',
          editable: true,
          validated: true,
          extractionMethod: '表格数据统计'
        },
        { 
          id: 'completion_rate',
          label: '完成率', 
          value: '100%', 
          confidence: 0.92,
          source: '进度计算',
          location: '进度表分析',
          editable: true,
          validated: true,
          extractionMethod: '百分比计算'
        },
        { 
          id: 'team_members',
          label: '参与人员', 
          value: '5人', 
          confidence: 0.89,
          source: '人员识别',
          location: '责任人列',
          editable: true,
          validated: false,
          extractionMethod: 'NLP人员提取'
        },
        { 
          id: 'issues_count',
          label: '问题数量', 
          value: '3个', 
          confidence: 0.91,
          source: '问题统计',
          location: '问题表',
          editable: true,
          validated: false,
          extractionMethod: '问题分类统计'
        }
      ],
      exportFormats: ['JSON', 'CSV', 'Excel'],
      template: 'development_report_template_v1.0',
      autoRecognitionPatterns: [
        '日期模式: YYYY年MM月DD日',
        '周期模式: 第NN周',
        '百分比模式: NN%',
        '人员模式: 姓名 + 角色'
      ]
    };
  }
  
  if (documentType === 'technical') {
    return {
      title: '自动提取字段',
      description: '基于技术文档模板自动识别规范信息',
      fields: [
        { 
          id: 'api_version',
          label: 'API版本', 
          value: 'v2.1.0', 
          confidence: 0.93,
          source: '版本标识',
          location: '文档头部',
          editable: true,
          validated: true,
          extractionMethod: '版本号模式识别'
        },
        { 
          id: 'api_count',
          label: '接口数量', 
          value: '15个', 
          confidence: 0.95,
          source: '计数统计',
          location: '全文扫描',
          editable: true,
          validated: false,
          extractionMethod: 'API接口计数'
        },
        { 
          id: 'auth_method',
          label: '认证方式', 
          value: 'JWT Token', 
          confidence: 0.89,
          source: '技术识别',
          location: '认证章节',
          editable: true,
          validated: false,
          extractionMethod: '技术术语识别'
        },
        { 
          id: 'data_format',
          label: '数据格式', 
          value: 'JSON', 
          confidence: 0.94,
          source: '格式检测',
          location: '数据格式章节',
          editable: true,
          validated: true,
          extractionMethod: '格式标准识别'
        }
      ],
      exportFormats: ['JSON', 'CSV', 'Excel'],
      template: 'technical_doc_template_v1.5',
      autoRecognitionPatterns: [
        '版本模式: vN.N.N',
        'API路径模式: /api/xxx',
        '认证模式: JWT|OAuth|Basic',
        '格式模式: JSON|XML|YAML'
      ]
    };
  }
  
  // 通用文档字段提取
  return {
    title: '自动提取字段',
    description: '基于通用模板自动识别常见信息',
    fields: [
      { 
        id: 'document_title',
        label: '文档标题', 
        value: '未识别', 
        confidence: 0.70,
        source: '标题识别',
        location: '文档开头',
        editable: true,
        validated: false,
        extractionMethod: '文档结构分析'
      },
      { 
        id: 'creation_date',
        label: '创建日期', 
        value: '2025-07-17', 
        confidence: 0.85,
        source: '日期识别',
        location: '元数据',
        editable: true,
        validated: false,
        extractionMethod: '日期模式匹配'
      }
    ],
    exportFormats: ['JSON', 'CSV'],
    template: 'general_template_v1.0',
    autoRecognitionPatterns: [
      '日期模式: YYYY-MM-DD',
      '邮箱模式: xxx@xxx.xxx',
      '电话模式: 1XX-XXXX-XXXX'
    ]
  };
};

// 2. 段落冲突检测功能（车型研发场景优化）
const generateConflictDetection = (content, documentType) => {
  const conflicts = [];
  
  // 车型需求规格冲突检测
  if (documentType === 'vehicle_requirements') {
    conflicts.push({
      id: 'conflict_1',
      type: 'parameter_inconsistency',
      severity: 'high',
      title: '动力参数不一致',
      description: '发动机功率在不同章节中描述不同',
      sourceLocation: { paragraph: 3, sentence: 1 },
      conflictLocation: { paragraph: 7, sentence: 2 },
      sourceContent: '最大功率为180kW',
      conflictContent: '峰值功率达到185kW',
      detectionMethod: '数值参数检测',
      confidence: 0.94,
      suggestion: '请核实发动机准确功率参数，确保技术规格一致性',
      status: 'unresolved',
      reviewRequired: true
    });
    
    conflicts.push({
      id: 'conflict_2',
      type: 'specification_mismatch',
      severity: 'medium',
      title: '车身尺寸不匹配',
      description: '车长尺寸在概述与详细规格中不符',
      sourceLocation: { paragraph: 2, sentence: 3 },
      conflictLocation: { paragraph: 6, sentence: 1 },
      sourceContent: '车身长度4680mm',
      conflictContent: '整车长度4685mm',
      detectionMethod: '尺寸参数匹配',
      confidence: 0.89,
      suggestion: '建议统一车身长度表述，确认最终设计尺寸',
      status: 'unresolved',
      reviewRequired: false
    });
  }
  
  // 车型设计方案冲突检测
  if (documentType === 'vehicle_design') {
    conflicts.push({
      id: 'conflict_3',
      type: 'design_inconsistency',
      severity: 'medium',
      title: '材料选择不一致',
      description: '车身材料在不同设计阶段描述不同',
      sourceLocation: { paragraph: 4, sentence: 2 },
      conflictLocation: { paragraph: 8, sentence: 1 },
      sourceContent: '采用高强度钢车身结构',
      conflictContent: '车身主体使用铝合金材料',
      detectionMethod: '材料术语检测',
      confidence: 0.86,
      suggestion: '明确车身材料选择，统一设计方案描述',
      status: 'unresolved',
      reviewRequired: true
    });
  }
  
  // 车型测试验证冲突检测
  if (documentType === 'vehicle_testing') {
    conflicts.push({
      id: 'conflict_4',
      type: 'test_result_inconsistency',
      severity: 'high',
      title: '测试结果不一致',
      description: '油耗测试结果在不同测试条件下差异较大',
      sourceLocation: { paragraph: 5, sentence: 1 },
      conflictLocation: { paragraph: 9, sentence: 2 },
      sourceContent: '综合油耗7.8L/100km',
      conflictContent: '实际油耗测试8.2L/100km',
      detectionMethod: '测试数据对比',
      confidence: 0.91,
      suggestion: '分析测试条件差异，说明油耗数据的测试场景',
      status: 'unresolved',
      reviewRequired: true
    });
  }
  
  // 车型项目管理冲突检测
  if (documentType === 'vehicle_project') {
    conflicts.push({
      id: 'conflict_5',
      type: 'timeline_inconsistency',
      severity: 'medium',
      title: '项目时间不一致',
      description: 'SOP时间在项目计划与里程碑中不符',
      sourceLocation: { paragraph: 2, sentence: 2 },
      conflictLocation: { paragraph: 6, sentence: 3 },
      sourceContent: 'SOP计划2025年12月',
      conflictContent: '量产时间2026年1月',
      detectionMethod: '时间对比检测',
      confidence: 0.88,
      suggestion: '确认准确的SOP时间，保持项目计划一致性',
      status: 'unresolved',
      reviewRequired: false
    });
  }
  
  // 项目管理文档冲突检测
  if (documentType === 'project_management') {
    conflicts.push({
      id: 'conflict_6',
      type: 'progress_inconsistency',
      severity: 'medium',
      title: '进度数据不一致',
      description: '项目完成率在不同报告中存在差异',
      sourceLocation: { paragraph: 3, sentence: 1 },
      conflictLocation: { paragraph: 7, sentence: 2 },
      sourceContent: '项目完成率65%',
      conflictContent: '总体进度达到70%',
      detectionMethod: '进度数据对比',
      confidence: 0.85,
      suggestion: '统一进度统计口径，确保数据准确性',
      status: 'unresolved',
      reviewRequired: false
    });
  }
  
  // 技术规范文档冲突检测
  if (documentType === 'technical_spec') {
    conflicts.push({
      id: 'conflict_7',
      type: 'standard_inconsistency',
      severity: 'high',
      title: '技术标准不一致',
      description: '引用的技术标准版本在不同章节中不同',
      sourceLocation: { paragraph: 2, sentence: 1 },
      conflictLocation: { paragraph: 5, sentence: 3 },
      sourceContent: '按照GB/T 19596-2017标准',
      conflictContent: '依据GB/T 19596-2020标准',
      detectionMethod: '标准版本检测',
      confidence: 0.93,
      suggestion: '确认采用的标准版本，保持技术规范一致性',
      status: 'unresolved',
      reviewRequired: true
    });
  }
  
  // 原有文档类型的冲突检测
  if (documentType === 'development_plan') {
    conflicts.push({
      id: 'conflict_8',
      type: 'content_inconsistency',
      severity: 'medium',
      title: '技术栈描述不一致',
      description: '第3段与第5段关于前端框架的描述存在冲突',
      sourceLocation: { paragraph: 3, sentence: 2 },
      conflictLocation: { paragraph: 5, sentence: 1 },
      sourceContent: '我们将使用React 18进行前端开发',
      conflictContent: '前端采用Vue 3框架实现',
      detectionMethod: '文本相似度 + 预定义规则',
      confidence: 0.87,
      suggestion: '建议统一为React 18，确保技术栈一致性',
      status: 'unresolved',
      reviewRequired: true
    });
  }
  
  if (documentType === 'contract') {
    conflicts.push({
      id: 'conflict_1',
      type: 'content_inconsistency',
      severity: 'medium',
      title: '技术栈描述不一致',
      description: '第3段与第5段关于前端框架的描述存在冲突',
      sourceLocation: { paragraph: 3, sentence: 2 },
      conflictLocation: { paragraph: 5, sentence: 1 },
      sourceContent: '我们将使用React 18进行前端开发',
      conflictContent: '前端采用Vue 3框架实现',
      detectionMethod: '文本相似度 + 预定义规则',
      confidence: 0.87,
      suggestion: '建议统一为React 18，确保技术栈一致性',
      status: 'unresolved',
      reviewRequired: true
    });
    
    conflicts.push({
      id: 'conflict_2',
      type: 'definition_mismatch',
      severity: 'low',
      title: '术语定义重复',
      description: '第2段和第4段都定义了"用户权限"概念，描述略有差异',
      sourceLocation: { paragraph: 2, sentence: 3 },
      conflictLocation: { paragraph: 4, sentence: 2 },
      sourceContent: '用户权限指系统中用户可执行的操作范围',
      conflictContent: '用户权限是指用户在应用中的访问控制级别',
      detectionMethod: '术语重复检测',
      confidence: 0.73,
      suggestion: '建议保留第一个定义，删除重复描述',
      status: 'unresolved',
      reviewRequired: false
    });
  }
  
  if (documentType === 'contract') {
    conflicts.push({
      id: 'conflict_3',
      type: 'data_inconsistency',
      severity: 'high',
      title: '金额数据不一致',
      description: '合同总金额在不同段落中出现了不同的数值',
      sourceLocation: { paragraph: 2, sentence: 1 },
      conflictLocation: { paragraph: 7, sentence: 3 },
      sourceContent: '合同总金额为人民币850,000元',
      conflictContent: '总价款为人民币800,000元',
      detectionMethod: '数字模式匹配',
      confidence: 0.95,
      suggestion: '请核实正确金额，确保全文一致',
      status: 'unresolved',
      reviewRequired: true
    });
  }
  
  if (documentType === 'technical') {
    conflicts.push({
      id: 'conflict_4',
      type: 'technology_inconsistency',
      severity: 'medium',
      title: '前端技术栈不一致',
      description: '文档中前端框架描述存在冲突',
      sourceLocation: { paragraph: 1, sentence: 1 },
      conflictLocation: { paragraph: 3, sentence: 2 },
      sourceContent: '前端使用React + Vite',
      conflictContent: '前端技术栈 - React 18.x - Vite 4.x',
      detectionMethod: '技术术语匹配',
      confidence: 0.78,
      suggestion: '建议统一版本号的表述方式',
      status: 'unresolved',
      reviewRequired: false
    });
    
    conflicts.push({
      id: 'conflict_5',
      type: 'version_mismatch',
      severity: 'low',
      title: 'Node.js版本描述不完整',
      description: '后端技术栈中Node.js版本信息不一致',
      sourceLocation: { paragraph: 1, sentence: 2 },
      conflictLocation: { paragraph: 4, sentence: 1 },
      sourceContent: '后端使用Node.js + Express',
      conflictContent: 'Node.js 18.x',
      detectionMethod: '版本号检测',
      confidence: 0.65,
      suggestion: '建议在首次提及时就标明具体版本号',
      status: 'unresolved',
      reviewRequired: false
    });
  }
  
  return {
    title: '段落冲突检测',
    description: '扫描文档内部发现的内容冲突和不一致',
    totalConflicts: conflicts.length,
    highSeverity: conflicts.filter(c => c.severity === 'high').length,
    mediumSeverity: conflicts.filter(c => c.severity === 'medium').length,
    lowSeverity: conflicts.filter(c => c.severity === 'low').length,
    conflicts: conflicts,
    detectionMethods: [
      '文本相似度匹配',
      '预定义规则比对',
      '术语一致性检查',
      '数字数据校验'
    ],
    autoResolutionSuggestions: conflicts.length > 0,
    lastScanTime: new Date().toISOString()
  };
};

// 3. 引用合规性校验功能
const generateReferenceValidation = (content, documentType) => {
  const references = [];
  
  // 模拟检测到的引用问题
  if (documentType === 'development_plan') {
    references.push({
      id: 'ref_1',
      type: 'title_mismatch',
      severity: 'medium',
      title: '引用章节标题已变更',
      description: '引用的设计规范文档标题已更新',
      referenceLocation: { paragraph: 4, sentence: 2 },
      sourceDocument: 'UI设计规范V2.0.docx',
      originalTitle: '用户界面设计原则',
      currentTitle: '用户体验设计规范',
      lastChecked: '2025-07-17T10:30:00Z',
      syncStatus: 'out_of_sync',
      permissionStatus: 'accessible',
      suggestion: '建议更新引用标题以保持一致性',
      autoUpdateAvailable: true
    });
    
    references.push({
      id: 'ref_2',
      type: 'content_structure_change',
      severity: 'low',
      title: '引用表格结构调整',
      description: '源文档中的数据表格增加了新列',
      referenceLocation: { paragraph: 6, sentence: 1 },
      sourceDocument: '数据库设计文档V1.2.docx',
      originalStructure: '用户表: ID, 姓名, 邮箱',
      currentStructure: '用户表: ID, 姓名, 邮箱, 创建时间, 状态',
      lastChecked: '2025-07-17T10:30:00Z',
      syncStatus: 'partially_synced',
      permissionStatus: 'accessible',
      suggestion: '考虑是否需要更新引用的表格描述',
      autoUpdateAvailable: false
    });
  }
  
  if (documentType === 'technical') {
    references.push({
      id: 'ref_3',
      type: 'permission_issue',
      severity: 'high',
      title: '引用内容权限不足',
      description: '引用的内部API文档需要更高权限访问',
      referenceLocation: { paragraph: 3, sentence: 4 },
      sourceDocument: '内部API密钥管理.docx',
      originalTitle: 'API密钥配置说明',
      currentTitle: '无法访问',
      lastChecked: '2025-07-17T10:30:00Z',
      syncStatus: 'access_denied',
      permissionStatus: 'insufficient',
      suggestion: '联系文档管理员获取访问权限或移除敏感引用',
      autoUpdateAvailable: false
    });
    
    references.push({
      id: 'ref_4',
      type: 'version_update',
      severity: 'medium',
      title: 'React版本文档已更新',
      description: '引用的React官方文档版本已从18.x更新至19.x',
      referenceLocation: { paragraph: 2, sentence: 1 },
      sourceDocument: 'React官方文档',
      originalTitle: 'React 18 特性说明',
      currentTitle: 'React 19 新特性指南',
      lastChecked: '2025-07-17T10:30:00Z',
      syncStatus: 'out_of_sync',
      permissionStatus: 'accessible',
      suggestion: '评估是否需要升级到React 19或更新文档引用',
      autoUpdateAvailable: true
    });
  }
  
  return {
    title: '引用合规性校验',
    description: '检查文档间引用关系的一致性和权限',
    totalReferences: references.length + 3, // 假设还有其他正常引用
    issuesFound: references.length,
    syncedReferences: 3,
    outOfSyncReferences: references.filter(r => r.syncStatus === 'out_of_sync').length,
    accessDeniedReferences: references.filter(r => r.permissionStatus === 'insufficient').length,
    references: references,
    validationMethods: [
      '源文档版本比对',
      '权限状态检查',
      '结构一致性验证',
      '内容同步检测'
    ],
    autoSyncAvailable: references.some(r => r.autoUpdateAvailable),
    lastValidationTime: new Date().toISOString()
  };
};

// 4. 校核工作流功能
const generateAuditWorkflow = (content, documentType) => {
  return {
    title: '校核工作流',
    description: '专家审阅和内容校核流程管理',
    currentStatus: 'in_progress',
    documentStatus: 'under_review',
    
    // 工作流步骤
    steps: [
      {
        id: 'step_1',
        title: '提交校核',
        description: '文档提交审核流程',
        status: 'completed',
        assignee: '张三（文档负责人）',
        completedAt: '2025-07-17T09:00:00Z',
        duration: '5分钟',
        action: 'submit_for_review',
        feedback: '文档已提交，等待专家审阅'
      },
      {
        id: 'step_2', 
        title: '专家审阅',
        description: '资深专家进行内容审查',
        status: 'in_progress',
        assignee: '李四（技术专家）',
        startedAt: '2025-07-17T09:15:00Z',
        estimatedDuration: '2-4小时',
        action: 'expert_review',
        feedback: '正在审阅中，已完成60%'
      },
      {
        id: 'step_3',
        title: 'AI辅助校核',
        description: 'AI自动检查术语统一性、格式规范等',
        status: 'pending',
        assignee: 'AI校核系统',
        estimatedDuration: '10分钟',
        action: 'ai_validation',
        feedback: '等待专家审阅完成后启动'
      },
      {
        id: 'step_4',
        title: '反馈处理',
        description: '根据专家意见修改文档',
        status: 'pending',
        assignee: '张三（文档负责人）',
        estimatedDuration: '1-2小时',
        action: 'feedback_processing',
        feedback: '等待专家反馈'
      },
      {
        id: 'step_5',
        title: '复审确认',
        description: '专家确认修改结果',
        status: 'pending',
        assignee: '李四（技术专家）',
        estimatedDuration: '30分钟',
        action: 'final_review',
        feedback: '等待反馈处理完成'
      },
      {
        id: 'step_6',
        title: '发布批准',
        description: '文档状态更新为已校核',
        status: 'pending',
        assignee: '系统自动',
        estimatedDuration: '即时',
        action: 'publish_approval',
        feedback: '等待复审通过'
      }
    ],
    
    // 专家反馈（模拟当前进行中的审阅）
    expertFeedback: [
      {
        id: 'feedback_1',
        type: 'modification_suggestion',
        severity: 'medium',
        reviewer: '李四（技术专家）',
        timestamp: '2025-07-17T10:45:00Z',
        location: { paragraph: 2, sentence: 3 },
        originalText: '系统采用微服务架构设计',
        suggestion: '建议补充具体的微服务拆分原则和边界定义',
        reason: '描述过于简单，缺少实施细节',
        status: 'pending_response'
      },
      {
        id: 'feedback_2',
        type: 'terminology_check',
        severity: 'low',
        reviewer: '李四（技术专家）',
        timestamp: '2025-07-17T10:50:00Z',
        location: { paragraph: 5, sentence: 1 },
        originalText: '前端框架',
        suggestion: '建议统一使用"前端技术栈"术语',
        reason: '与其他技术文档保持术语一致性',
        status: 'pending_response'
      }
    ],
    
    // AI辅助校核项目
    aiValidationChecks: [
      {
        id: 'ai_check_1',
        name: '术语统一性检查',
        description: '检查文档中技术术语的一致性使用',
        status: 'ready',
        estimatedTime: '2分钟'
      },
      {
        id: 'ai_check_2',
        name: '引用资料完整性',
        description: '验证所有引用资料是否标注完整',
        status: 'ready', 
        estimatedTime: '3分钟'
      },
      {
        id: 'ai_check_3',
        name: '排版格式规范',
        description: '检查文档格式是否符合组织规范',
        status: 'ready',
        estimatedTime: '5分钟'
      }
    ],
    
    // 流程统计
    statistics: {
      totalSteps: 6,
      completedSteps: 1,
      currentProgress: '16.7%',
      estimatedCompletion: '2025-07-17T16:00:00Z',
      averageReviewTime: '3.5小时',
      expertWorkload: 'medium'
    }
  };
};

const AIDocumentAnalyzer = ({ isVisible, onClose, documentContent = "" }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('extractedFields');
  const [selectedDocumentType, setSelectedDocumentType] = useState('general');
  const [expandedSections, setExpandedSections] = useState({
    extractedFields: true,
    conflictDetection: false,
    referenceValidation: false,
    auditWorkflow: false
  });

  // 分析文档
  const analyzeDocument = async () => {
    setIsAnalyzing(true);
    
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 使用当前文档内容或车型研发示例内容进行分析
    const contentToAnalyze = documentContent || `
    新能源SUV车型开发项目技术规格书
    
    项目概述
    项目代码：P2024-SUV-001
    车型定位：中高端新能源SUV
    目标市场：家庭用户、商务用户
    SOP时间：2025年12月
    项目预算：15亿元
    
    动力系统规格
    发动机类型：2.0T涡轮增压发动机
    最大功率：180kW@5500rpm
    峰值扭矩：350N·m@2000-4500rpm
    电机功率：120kW
    综合最大功率：260kW
    
    车身参数
    车身长度：4680mm
    车身宽度：1880mm
    车身高度：1680mm
    轴距：2750mm
    整备质量：1850kg
    
    性能指标
    0-100km/h加速：6.8秒
    最高车速：200km/h
    综合油耗：7.8L/100km
    NEDC续航：650km
    
    安全配置
    安全等级：C-NCAP 5星
    主动安全：AEB、ACC、LKA
    被动安全：6气囊、高强度钢车身
    
    测试验证
    整车道路测试里程：50000km
    耐久性测试：通过
    排放标准：国六B
    NVH测试：符合标准
    
    项目团队
    项目经理：张工程师
    设计团队：50人
    测试团队：30人
    总计团队规模：280人
    
    技术标准
    执行标准：GB/T 19596-2017
    工艺标准：ISO 9001-2015
    环保标准：国六B排放法规
    `;
    
    const analysisResult = generateDocumentAnalysis(contentToAnalyze, selectedDocumentType);
    console.log('分析结果:', analysisResult); // 调试日志
    setAnalysis(analysisResult);
    setIsAnalyzing(false);
  };

  // 初始化分析
  useEffect(() => {
    if (isVisible) {
      analyzeDocument();
    }
  }, [isVisible, selectedDocumentType]);

  // 切换展开状态
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 导出数据
  const exportData = (format, data) => {
    if (format === 'JSON') {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted_data_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 复制模板
  const copyTemplate = (templateData) => {
    const templateText = templateData.fields.map(field => 
      `${field.label}: ${field.value}`
    ).join('\n');
    navigator.clipboard.writeText(templateText);
  };

  if (!isVisible) return null;

  return (
    <div className="ai-analyzer-sidebar">
      <div className="ai-analyzer-panel-sidebar">
        {/* 头部 */}
        <div className="analyzer-header-sidebar">
          <div className="header-left">
            <Brain className="header-icon" />
            <div>
              <h3>AI 内容校核</h3>
              <p>智能分析系统</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* 文档类型选择 */}
        <div className="document-type-selector-sidebar">
          <label>文档类型：</label>
          <select 
            value={selectedDocumentType} 
            onChange={(e) => setSelectedDocumentType(e.target.value)}
          >
            <option value="general">通用文档</option>
            <optgroup label="车型研发相关">
              <option value="vehicle_requirements">车型需求规格</option>
              <option value="vehicle_design">车型设计方案</option>
              <option value="vehicle_testing">车型测试验证</option>
              <option value="vehicle_project">车型项目管理</option>
            </optgroup>
            <optgroup label="项目管理">
              <option value="project_management">项目管理文档</option>
              <option value="development_report">开发报告</option>
            </optgroup>
            <optgroup label="技术文档">
              <option value="technical_spec">技术规范标准</option>
              <option value="contract">合同协议</option>
            </optgroup>
          </select>
        </div>

        {/* 分析状态 */}
        {isAnalyzing && (
          <div className="analyzing-status-sidebar">
            <RefreshCw className="spin" />
            <span>分析中...</span>
          </div>
        )}

        {/* 四大核心功能模块 */}
        {!isAnalyzing && (
          <div className="analysis-content-sidebar">
            
            {/* 1. 信息抽取自动化 */}
            <div className="analysis-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('extractedFields')}
              >
                <div className="section-title">
                  <FileSearch className="section-icon" />
                  <span>🔍 信息抽取自动化</span>
                </div>
                {expandedSections.extractedFields ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              {expandedSections.extractedFields && (
                <div className="section-content">
                  <p className="section-description">
                    {analysis?.extractedFields?.description || '基于AI和规则引擎，自动识别和提取文档中的关键字段信息'}
                  </p>
                  
                  <div className="extracted-fields">
                    {analysis?.extractedFields?.fields?.map(field => (
                      <div key={field.id} className="field-item">
                        <div className="field-header">
                          <span className="field-label">{field.label}</span>
                          <div className="field-badges">
                            <span className={`confidence-badge ${field.confidence > 0.9 ? 'high' : field.confidence > 0.8 ? 'medium' : 'low'}`}>
                              {Math.round(field.confidence * 100)}%
                            </span>
                            {field.validated && <span className="validated-badge">已验证</span>}
                          </div>
                        </div>
                        <div className="field-value">
                          {field.editable ? (
                            <input 
                              type="text" 
                              value={field.value} 
                              onChange={(e) => {
                                // 更新字段值的逻辑
                              }}
                            />
                          ) : (
                            <span>{field.value}</span>
                          )}
                        </div>
                        <div className="field-meta">
                          <span>来源: {field.source}</span>
                          <span>位置: {field.location}</span>
                          <span>方法: {field.extractionMethod}</span>
                        </div>
                      </div>
                    )) || (
                      <div className="no-data">暂无提取到的字段信息</div>
                    )}
                  </div>
                  
                  {analysis?.extractedFields?.fields?.length > 0 && (
                    <div className="extraction-actions">
                      <button 
                        className="action-btn json-export"
                        onClick={() => exportData('JSON', analysis.extractedFields)}
                      >
                        <Download /> 导出 JSON
                      </button>
                      <button 
                        className="action-btn template-export"
                        onClick={() => copyTemplate(analysis.extractedFields)}
                      >
                        <Copy /> 复制模板
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. 段落冲突检测 */}
            <div className="analysis-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('conflictDetection')}
              >
                <div className="section-title">
                  <AlertTriangle className="section-icon" />
                  <span>⚔️ 段落冲突检测</span>
                  {analysis?.conflictDetection?.totalConflicts > 0 && (
                    <span className="conflict-count">{analysis.conflictDetection.totalConflicts}</span>
                  )}
                </div>
                {expandedSections.conflictDetection ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              {expandedSections.conflictDetection && (
                <div className="section-content">
                  <p className="section-description">
                    {analysis?.conflictDetection?.description || '扫描文档内部发现的内容冲突和不一致'}
                  </p>
                  
                  <div className="conflict-summary">
                    <div className="summary-item high">
                      <span>高</span>
                      <span>{analysis?.conflictDetection?.highSeverity || 0}</span>
                    </div>
                    <div className="summary-item medium">
                      <span>中</span>
                      <span>{analysis?.conflictDetection?.mediumSeverity || 0}</span>
                    </div>
                    <div className="summary-item low">
                      <span>低</span>
                      <span>{analysis?.conflictDetection?.lowSeverity || 0}</span>
                    </div>
                  </div>
                  
                  <div className="conflicts-list">
                    {analysis?.conflictDetection?.conflicts?.map(conflict => (
                      <div key={conflict.id} className={`conflict-item ${conflict.severity}`}>
                        <div className="conflict-header">
                          <span className="conflict-title">{conflict.title}</span>
                          <span className={`severity-badge ${conflict.severity}`}>
                            {conflict.severity === 'high' ? '高' : conflict.severity === 'medium' ? '中' : '低'}
                          </span>
                        </div>
                        <p className="conflict-description">{conflict.description}</p>
                        <div className="conflict-details">
                          <div className="conflict-content">
                            <strong>原文:</strong> {conflict.sourceContent}
                          </div>
                          <div className="conflict-content">
                            <strong>冲突:</strong> {conflict.conflictContent}
                          </div>
                          <div className="conflict-suggestion">
                            <strong>建议:</strong> {conflict.suggestion}
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="no-data">未检测到段落冲突</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. 引用合规性校验 */}
            <div className="analysis-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('referenceValidation')}
              >
                <div className="section-title">
                  <Shield className="section-icon" />
                  <span>🔗 引用合规性校验</span>
                  {analysis?.referenceValidation?.issuesFound > 0 && (
                    <span className="reference-issues">{analysis.referenceValidation.issuesFound}</span>
                  )}
                </div>
                {expandedSections.referenceValidation ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              {expandedSections.referenceValidation && (
                <div className="section-content">
                  <p className="section-description">
                    {analysis?.referenceValidation?.description || '检查文档间引用关系的一致性和权限'}
                  </p>
                  
                  <div className="reference-summary">
                    <div className="summary-grid">
                      <div className="summary-item">
                        <span>总引用</span>
                        <span>{analysis?.referenceValidation?.totalReferences || 0}</span>
                      </div>
                      <div className="summary-item success">
                        <span>已同步</span>
                        <span>{analysis?.referenceValidation?.syncedReferences || 0}</span>
                      </div>
                      <div className="summary-item warning">
                        <span>不同步</span>
                        <span>{analysis?.referenceValidation?.outOfSyncReferences || 0}</span>
                      </div>
                      <div className="summary-item error">
                        <span>权限不足</span>
                        <span>{analysis?.referenceValidation?.accessDeniedReferences || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="references-list">
                    {analysis?.referenceValidation?.references?.map(ref => (
                      <div key={ref.id} className={`reference-item ${ref.severity}`}>
                        <div className="reference-header">
                          <span className="reference-title">{ref.title}</span>
                          <div className="reference-status">
                            <span className={`sync-status ${ref.syncStatus}`}>
                              {ref.syncStatus === 'out_of_sync' ? '不同步' :
                               ref.syncStatus === 'access_denied' ? '无权限' : '部分同步'}
                            </span>
                            {ref.autoUpdateAvailable && (
                              <span className="auto-update">可自动更新</span>
                            )}
                          </div>
                        </div>
                        <p className="reference-description">{ref.description}</p>
                        <div className="reference-details">
                          <div><strong>源文档:</strong> {ref.sourceDocument}</div>
                          {ref.originalTitle && (
                            <div><strong>原标题:</strong> {ref.originalTitle}</div>
                          )}
                          {ref.currentTitle && (
                            <div><strong>当前标题:</strong> {ref.currentTitle}</div>
                          )}
                          <div className="reference-suggestion">
                            <strong>建议:</strong> {ref.suggestion}
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="no-data">未发现引用问题</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. 校核工作流 */}
            <div className="analysis-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('auditWorkflow')}
              >
                <div className="section-title">
                  <GitBranch className="section-icon" />
                  <span>🧾 校核工作流</span>
                  <span className={`workflow-status ${analysis?.auditWorkflow?.currentStatus || 'pending'}`}>
                    {(analysis?.auditWorkflow?.currentStatus === 'in_progress') ? '进行中' : '待开始'}
                  </span>
                </div>
                {expandedSections.auditWorkflow ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              {expandedSections.auditWorkflow && (
                <div className="section-content">
                  <p className="section-description">
                    {analysis?.auditWorkflow?.description || '专家审阅和内容校核流程管理'}
                  </p>
                  
                  <div className="workflow-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: analysis?.auditWorkflow?.statistics?.currentProgress || '0%' }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {analysis?.auditWorkflow?.statistics?.currentProgress || '0%'} 完成
                    </span>
                  </div>
                  
                  <div className="workflow-steps">
                    {analysis?.auditWorkflow?.steps?.map(step => (
                      <div key={step.id} className={`workflow-step ${step.status}`}>
                        <div className="step-indicator">
                          {step.status === 'completed' && <CheckCircle className="step-icon completed" />}
                          {step.status === 'in_progress' && <RefreshCw className="step-icon in-progress" />}
                          {step.status === 'pending' && <Clock className="step-icon pending" />}
                        </div>
                        <div className="step-content">
                          <div className="step-header">
                            <span className="step-title">{step.title}</span>
                            <span className="step-assignee">{step.assignee}</span>
                          </div>
                          <p className="step-description">{step.description}</p>
                          <div className="step-meta">
                            {step.completedAt && (
                              <span>完成时间: {new Date(step.completedAt).toLocaleString()}</span>
                            )}
                            {step.estimatedDuration && (
                              <span>预计耗时: {step.estimatedDuration}</span>
                            )}
                          </div>
                          <p className="step-feedback">{step.feedback}</p>
                        </div>
                      </div>
                    )) || (
                      <div className="no-data">暂无工作流信息</div>
                    )}
                  </div>
                  
                  {/* 专家反馈区域 */}
                  {analysis?.auditWorkflow?.expertFeedback?.length > 0 && (
                    <div className="expert-feedback">
                      <h4>专家反馈</h4>
                      {analysis.auditWorkflow.expertFeedback.map(feedback => (
                        <div key={feedback.id} className={`feedback-item ${feedback.severity}`}>
                          <div className="feedback-header">
                            <span className="feedback-type">{feedback.type === 'modification_suggestion' ? '修改建议' : '术语检查'}</span>
                            <span className="feedback-reviewer">{feedback.reviewer}</span>
                          </div>
                          <div className="feedback-content">
                            <div><strong>原文:</strong> {feedback.originalText}</div>
                            <div><strong>建议:</strong> {feedback.suggestion}</div>
                            <div><strong>理由:</strong> {feedback.reason}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDocumentAnalyzer;
