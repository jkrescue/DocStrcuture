import React from 'react';
import SimpleBlockEditor from './SimpleBlockEditor';
import SimpleBlockEditorEnhanced from './SimpleBlockEditor_Enhanced';

const BlockEditor = ({ blocks, onBlocksChange, editable = true, enhanced = true }) => {
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