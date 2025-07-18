# 🔍 信息抽取面板使用指南

## 面板位置与访问

### 1. 打开AI分析器
- 在文档编辑器顶部工具栏中，点击 **"AI分析"** 按钮
- AI分析器将在右侧打开，显示为一个侧边栏面板

### 2. 切换到关键信息标签
- 在AI分析器顶部的标签栏中，点击 **"关键信息"** 标签页
- 图标显示为 🎯 Target 图标
- 显示格式：`关键信息 (数量)`

## 功能详解

### 📊 智能识别功能

AI分析器会根据文档类型自动识别不同的关键信息：

#### 合同文档类型
- **合同编号** (contract_number): 如 "CT-2024-0156"
- **合同金额** (currency): 如 "¥850,000"
- **签约日期** (date): 如 "2024-07-15"
- **甲方代表** (person): 如 "张总经理"
- **乙方代表** (person): 如 "李项目经理"

#### 技术文档类型
- **API版本** (target): 如 "v2.1.0"
- **接口数量** (target): 如 "15个"
- **认证方式** (target): 如 "JWT Token"
- **数据格式** (target): 如 "JSON"

#### 开发计划类型
- **项目开始时间** (date): 如 "2024年1月15日"
- **预计完成时间** (date): 如 "2024年3月30日"
- **总预算** (currency): 如 "200万元"
- **项目经理** (person): 如 "张三"
- **技术负责人** (person): 如 "李工程师"
- **目标用户数** (target): 如 "10万+"

#### 通用文档类型
- **创建时间** (date): 文档创建日期
- **作者** (person): 文档作者
- **文档类型** (target): 文档分类
- **字数统计** (target): 文档长度

### 🎨 信息卡片界面

每个提取的关键信息以卡片形式展示，包含：

#### 卡片结构
```
┌─────────────────────────────────────┐
│ [图标] 信息类型标签                    │
│        主要内容值                     │
│        来源位置 | 置信度 XX%          │
│                            [复制][应用] │
└─────────────────────────────────────┘
```

#### 信息类型图标
- 📅 **日期时间** (date): Calendar 图标
- 💰 **金额货币** (currency): DollarSign 图标  
- 👥 **人员角色** (person): Users 图标
- 🎯 **目标指标** (target): Target 图标
- 📞 **联系电话** (phone): Phone 图标
- 📧 **电子邮箱** (email): Mail 图标
- 📍 **地理位置** (location): MapPin 图标

#### 颜色分类边框
- **日期信息**: 蓝色左边框
- **金额信息**: 绿色左边框
- **人员信息**: 紫色左边框
- **目标信息**: 橙色左边框

### ⚡ 手动确认操作

每个信息卡片右侧提供两个操作按钮：

#### 1. 复制按钮 📋
- **图标**: Copy 图标
- **功能**: 将信息值复制到剪贴板
- **样式**: 灰色背景，悬停时变深
- **使用场景**: 需要在其他地方粘贴该信息

#### 2. 应用按钮 ➕
- **图标**: Plus 图标  
- **功能**: 将信息应用到文档中
- **样式**: 蓝色背景，悬停时有阴影效果
- **使用场景**: 确认信息正确，集成到文档结构中

## 使用流程示例

### 完整操作流程

1. **开始分析**
   ```
   创建/打开文档 → 点击"AI分析"按钮 → 等待分析完成
   ```

2. **查看关键信息**
   ```
   点击"关键信息"标签 → 浏览提取的信息卡片
   ```

3. **验证信息准确性**
   ```
   检查信息值 → 查看来源位置 → 确认置信度
   ```

4. **执行操作**
   ```
   复制需要的信息 OR 应用到文档中
   ```

### 实际使用案例

#### 案例1: 合同信息提取
```
文档内容: "本合同编号为CT-2024-0156，总金额¥850,000元..."

AI提取结果:
┌─────────────────────────────────────┐
│ 📄 合同编号                          │
│    CT-2024-0156                     │
│    来源: 第1段 | 置信度 95%           │
│                            [📋][➕] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💰 合同金额                          │
│    ¥850,000                        │
│    来源: 第1段 | 置信度 92%           │
│                            [📋][➕] │
└─────────────────────────────────────┘
```

#### 案例2: 开发计划信息提取
```
文档内容: "项目将于2024年1月15日启动，预算200万元..."

AI提取结果:
┌─────────────────────────────────────┐
│ 📅 项目开始时间                       │
│    2024年1月15日                     │
│    来源: 第二段落 | 置信度 95%         │
│                            [📋][➕] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💰 总预算                           │
│    200万元                          │
│    来源: 预算部分 | 置信度 90%         │
│                            [📋][➕] │
└─────────────────────────────────────┘
```

## 技术实现原理

### 智能识别算法
- **关键词匹配**: 基于预定义规则识别特定模式
- **正则表达式**: 匹配日期、金额、邮箱等格式
- **NLP技术**: 实体识别和语义分析
- **置信度评分**: 基于匹配准确度计算可信度

### 数据结构
```javascript
{
  type: 'date|currency|person|target',  // 信息类型
  label: '显示标签',                    // 字段名称
  value: '提取的值',                    // 实际内容
  confidence: 0.95,                   // 置信度(0-1)
  source: '自动识别',                   // 提取方式
  location: '第1段'                    // 文档位置
}
```

这就是信息抽取面板的完整使用指南！它位于AI分析器的"关键信息"标签页中，提供智能识别和手动确认的完整工作流。
