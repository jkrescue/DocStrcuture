import React from 'react';
import SimpleBlockEditor from './SimpleBlockEditor';
import SimpleBlockEditorEnhanced from './SimpleBlockEditor_Enhanced';
import BlockNoteEditor from './BlockNoteEditor';

const BlockEditor = ({ 
  blocks, 
  onBlocksChange, 
  editable = true, 
  enhanced = true, 
  editorType = 'traditional',
  document = null
}) => {
  // 根据编辑器类型或文档元数据选择编辑器
  const actualEditorType = document?.metadata?.editorType || editorType;

  if (actualEditorType === 'blocknote') {
    return (
      <BlockNoteEditor
        initialContent={blocks}
        onChange={onBlocksChange}
        editable={editable}
        placeholder="开始输入，或按 '/' 打开命令菜单..."
        theme="light"
      />
    );
  }

  if (enhanced) {
    return (
      <SimpleBlockEditorEnhanced
        blocks={blocks}
        onBlocksChange={onBlocksChange}
        editable={editable}
      />
    );
  }

  return (
    <SimpleBlockEditor
      blocks={blocks}
      onBlocksChange={onBlocksChange}
      editable={editable}
    />
  );
};

export default BlockEditor;