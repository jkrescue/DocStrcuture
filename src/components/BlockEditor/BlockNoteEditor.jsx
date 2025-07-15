import React, { useMemo } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

const BlockNoteEditor = ({ 
  initialContent = [], 
  onChange, 
  editable = true,
  placeholder = "开始输入，或按 '/' 打开命令菜单...",
  theme = "light"
}) => {
  // 创建编辑器实例
  const editor = useCreateBlockNote({
    initialContent: initialContent.length > 0 ? initialContent : undefined,
    editable,
    // 本地化配置
    dictionary: {
      slash_menu: {
        heading: {
          title: "标题",
          subtext: "大号文本标题",
          aliases: ["h", "heading1", "h1", "标题"],
          group: "基础块",
        },
        heading_2: {
          title: "标题 2", 
          subtext: "中号文本标题",
          aliases: ["h2", "heading2", "二级标题"],
          group: "基础块",
        },
        heading_3: {
          title: "标题 3",
          subtext: "小号文本标题", 
          aliases: ["h3", "heading3", "三级标题"],
          group: "基础块",
        },
        numbered_list: {
          title: "有序列表",
          subtext: "创建有序列表",
          aliases: ["ol", "有序", "数字列表"],
          group: "基础块",
        },
        bullet_list: {
          title: "无序列表",
          subtext: "创建无序列表", 
          aliases: ["ul", "无序", "项目符号"],
          group: "基础块",
        },
        check_list: {
          title: "待办清单",
          subtext: "创建可勾选的任务列表",
          aliases: ["todo", "task", "check", "checkbox", "待办", "任务"],
          group: "基础块",
        },
        table: {
          title: "表格",
          subtext: "创建表格",
          aliases: ["table", "表格"],
          group: "高级块",
        },
        paragraph: {
          title: "段落",
          subtext: "普通文本",
          aliases: ["p", "paragraph", "段落"],
          group: "基础块", 
        },
        code: {
          title: "代码块",
          subtext: "带语法高亮的代码",
          aliases: ["code", "代码"],
          group: "高级块",
        },
        image: {
          title: "图片",
          subtext: "插入图片",
          aliases: ["image", "img", "图片", "图像"],
          group: "媒体",
        },
      },
      placeholders: {
        default: placeholder,
        heading: "标题",
        bulletListItem: "列表项",
        numberedListItem: "列表项", 
        checkListItem: "待办事项",
      },
      // 侧边栏菜单
      side_menu: {
        add_block: "添加块",
        drag_handle: "拖拽句柄",
      },
      // 格式化工具栏
      formatting: {
        bold: "粗体",
        italic: "斜体",
        underline: "下划线",
        strike: "删除线",
        code: "行内代码",
        colors: "颜色",
        createLink: "创建链接",
        openLink: "打开链接",
        editLink: "编辑链接",
        unlinkLink: "取消链接",
        backgroundColor: "背景色",
        textColor: "文字颜色",
      },
      // 文件面板
      file_panel: {
        upload: {
          title: "上传文件",
          fileTab: {
            title: "上传文件",
            upload: "点击上传",
          },
          urlTab: {
            title: "嵌入链接", 
            url: "输入URL",
            embed: "嵌入",
          },
        },
        loading: "加载中...",
        uploading: "上传中...",
        embed: "嵌入",
        previewToggle: "切换预览",
      },
      // 表格
      table_handle: {
        delete_column: "删除列",
        delete_row: "删除行",
        add_left: "在左侧添加列",
        add_right: "在右侧添加列",
        add_above: "在上方添加行",
        add_below: "在下方添加行",
      },
    },
  });

  // 处理内容变化
  const handleChange = () => {
    if (onChange) {
      const blocks = editor.document;
      onChange(blocks);
    }
  };

  // 编辑器样式
  const editorStyles = {
    '.bn-editor': {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Open Sans", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      fontSize: '16px',
      lineHeight: '1.6',
      color: theme === 'dark' ? '#ffffff' : '#374151',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    },
    '.bn-editor .ProseMirror': {
      padding: '20px 0',
      minHeight: '200px',
      outline: 'none',
    },
    '.bn-editor .bn-block-content': {
      fontSize: '16px',
      lineHeight: '1.6',
    },
    '.bn-editor h1': {
      fontSize: '2.25rem',
      fontWeight: '700',
      lineHeight: '2.5rem',
      marginTop: '0',
      marginBottom: '0.5rem',
    },
    '.bn-editor h2': {
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '2.25rem',
      marginTop: '0',
      marginBottom: '0.5rem',
    },
    '.bn-editor h3': {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '2rem',
      marginTop: '0',
      marginBottom: '0.5rem',
    },
    '.bn-editor h4': {
      fontSize: '1.25rem',
      fontWeight: '600',
      lineHeight: '1.75rem',
      marginTop: '0',
      marginBottom: '0.5rem',
    },
    '.bn-editor h5': {
      fontSize: '1.125rem',
      fontWeight: '600',
      lineHeight: '1.75rem',
      marginTop: '0',
      marginBottom: '0.5rem',
    },
    '.bn-editor h6': {
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.5rem',
      marginTop: '0',
      marginBottom: '0.5rem',
    },
    '.bn-editor p': {
      margin: '0.5rem 0',
    },
    '.bn-editor ul, .bn-editor ol': {
      paddingLeft: '1.5rem',
      margin: '0.5rem 0',
    },
    '.bn-editor li': {
      margin: '0.25rem 0',
    },
    '.bn-editor blockquote': {
      borderLeft: '4px solid #3b82f6',
      paddingLeft: '1rem',
      margin: '1rem 0',
      fontStyle: 'italic',
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f8fafc',
      padding: '1rem',
      borderRadius: '0.5rem',
    },
    '.bn-editor code': {
      backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
      padding: '0.125rem 0.25rem',
      borderRadius: '0.25rem',
      fontFamily: 'JetBrains Mono, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: '0.875rem',
    },
    '.bn-editor pre': {
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f8fafc',
      padding: '1rem',
      borderRadius: '0.5rem',
      overflow: 'auto',
      margin: '1rem 0',
    },
    '.bn-editor pre code': {
      backgroundColor: 'transparent',
      padding: '0',
    },
    '.bn-editor table': {
      borderCollapse: 'collapse',
      width: '100%',
      margin: '1rem 0',
      border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
    },
    '.bn-editor th, .bn-editor td': {
      border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
      padding: '0.5rem',
      textAlign: 'left',
    },
    '.bn-editor th': {
      backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
      fontWeight: '600',
    },
  };

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '400px',
      position: 'relative',
    }}>
      <style>
        {Object.entries(editorStyles).map(([selector, styles]) => 
          `${selector} { ${Object.entries(styles).map(([prop, value]) => 
            `${prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${value};`
          ).join(' ')} }`
        ).join('\n')}
      </style>
      
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme={theme}
        sideMenu={true}
        formattingToolbar={true}
        linkToolbar={true}
        slashMenu={true}
        filePanel={true}
        tableHandles={true}
      />
    </div>
  );
};

export default BlockNoteEditor;
