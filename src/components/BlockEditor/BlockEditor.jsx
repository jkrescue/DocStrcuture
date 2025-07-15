import React from 'react';
import SimpleBlockEditor from './SimpleBlockEditor';

const BlockEditor = ({ blocks, onBlocksChange, editable = true }) => {
  return (
    <SimpleBlockEditor
      blocks={blocks}
      onBlocksChange={onBlocksChange}
      editable={editable}
    />
  );
};

export default BlockEditor;