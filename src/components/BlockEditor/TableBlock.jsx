import React, { useState } from 'react';
import { Table, Plus, Trash2, Calculator } from 'lucide-react';

const TableBlock = ({ block, onChange, editable = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const tableData = block.content?.data || [
    ['列1', '列2', '列3'],
    ['', '', ''],
    ['', '', '']
  ];

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = tableData.map((row, rIdx) =>
      rIdx === rowIndex 
        ? row.map((cell, cIdx) => cIdx === colIndex ? value : cell)
        : row
    );

    onChange?.({
      content: { ...block.content, data: newData },
      metadata: {
        ...block.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const addRow = () => {
    const newRow = new Array(tableData[0]?.length || 3).fill('');
    const newData = [...tableData, newRow];
    onChange?.({
      content: { ...block.content, data: newData },
      metadata: {
        ...block.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const addColumn = () => {
    const newData = tableData.map(row => [...row, '']);
    onChange?.({
      content: { ...block.content, data: newData },
      metadata: {
        ...block.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const deleteRow = (rowIndex) => {
    if (tableData.length > 1) {
      const newData = tableData.filter((_, index) => index !== rowIndex);
      onChange?.({
        content: { ...block.content, data: newData },
        metadata: {
          ...block.metadata,
          updatedAt: new Date().toISOString()
        }
      });
    }
  };

  const deleteColumn = (colIndex) => {
    if (tableData[0]?.length > 1) {
      const newData = tableData.map(row => 
        row.filter((_, index) => index !== colIndex)
      );
      onChange?.({
        content: { ...block.content, data: newData },
        metadata: {
          ...block.metadata,
          updatedAt: new Date().toISOString()
        }
      });
    }
  };

  // 简单的求和计算
  const calculateSum = (colIndex) => {
    const values = tableData.slice(1).map(row => {
      const val = parseFloat(row[colIndex]);
      return isNaN(val) ? 0 : val;
    });
    return values.reduce((sum, val) => sum + val, 0);
  };

  return (
    <div className="table-block group relative border-l-2 border-transparent hover:border-purple-200 pl-4 transition-colors">
      {/* 块类型指示器 */}
      <div className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Table size={16} className="text-purple-500" />
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        {/* 表格标题和控制 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Table size={16} className="text-purple-600" />
            <span className="font-medium text-gray-800">
              {block.content?.title || '数据表格'}
            </span>
            <span className="text-xs text-gray-500">
              {tableData.length} 行 × {tableData[0]?.length || 0} 列
            </span>
          </div>
          
          {editable && (
            <div className="flex space-x-1">
              <button
                onClick={addRow}
                className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                title="添加行"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={addColumn}
                className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                title="添加列"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                title="编辑模式"
              >
                <Calculator size={14} />
              </button>
            </div>
          )}
        </div>

        {/* 表格 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white rounded">
            <thead>
              <tr className="bg-gray-50">
                {tableData[0]?.map((header, colIndex) => (
                  <th key={colIndex} className="relative group/header">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => handleCellChange(0, colIndex, e.target.value)}
                      className="w-full p-2 border-none bg-transparent font-medium text-center focus:outline-none focus:bg-white"
                      placeholder={`列${colIndex + 1}`}
                      disabled={!editable}
                    />
                    {editable && isEditing && tableData[0].length > 1 && (
                      <button
                        onClick={() => deleteColumn(colIndex)}
                        className="absolute top-1 right-1 opacity-0 group-hover/header:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded"
                        title="删除列"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex + 1} className="group/row hover:bg-gray-50">
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border border-gray-200 relative">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex + 1, colIndex, e.target.value)}
                        className="w-full p-2 border-none bg-transparent text-center focus:outline-none focus:bg-blue-50"
                        disabled={!editable}
                      />
                    </td>
                  ))}
                  {editable && isEditing && tableData.length > 2 && (
                    <td className="border border-gray-200 w-8">
                      <button
                        onClick={() => deleteRow(rowIndex + 1)}
                        className="w-full p-1 text-red-500 hover:bg-red-100 opacity-0 group-hover/row:opacity-100"
                        title="删除行"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            
            {/* 计算行 */}
            {isEditing && (
              <tfoot>
                <tr className="bg-blue-50 font-medium">
                  {tableData[0]?.map((_, colIndex) => (
                    <td key={colIndex} className="border border-gray-200 p-2 text-center text-blue-700">
                      Σ {calculateSum(colIndex).toFixed(2)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* 表格统计信息 */}
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <span>
            总计 {(tableData.length - 1) * (tableData[0]?.length || 0)} 个单元格
          </span>
          {isEditing && (
            <span className="text-blue-600">
              编辑模式 - 显示计算结果
            </span>
          )}
        </div>
      </div>

      {/* 块状态指示器 */}
      {block.metadata?.locked && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
          已锁定
        </div>
      )}
    </div>
  );
};

export default TableBlock;