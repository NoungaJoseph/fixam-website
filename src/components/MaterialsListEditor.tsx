import React from 'react';

export interface MaterialItem {
  id?: string;
  name: string;
  quantity?: string;
}

interface MaterialsListEditorProps {
  items: MaterialItem[];
  onChangeItems: (items: MaterialItem[]) => void;
  requiresDiagnosis?: boolean;
  onToggleDiagnosis?: (val: boolean) => void;
  readOnly?: boolean;
}

export const MaterialsListEditor: React.FC<MaterialsListEditorProps> = ({
  items = [],
  onChangeItems,
  requiresDiagnosis = false,
  onToggleDiagnosis,
  readOnly = false
}) => {

  // Ensure at least one empty field row exists when not requiring diagnosis
  const rows = items.length === 0 ? [{ id: '1', name: '', quantity: '' }] : items;

  const handleUpdateItem = (index: number, field: 'name' | 'quantity', value: string) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    onChangeItems(updated);
  };

  const handleAddRow = () => {
    const newRow: MaterialItem = { id: String(Date.now() + Math.random()), name: '', quantity: '' };
    onChangeItems([...rows, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    onChangeItems(updated);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 my-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Materials & Equipment</h3>
      </div>

      {/* Diagnosis Toggle */}
      {onToggleDiagnosis && !readOnly && (
        <div className={`flex items-center justify-between p-3 rounded-lg border transition-all mb-3 ${
          requiresDiagnosis 
            ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800' 
            : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
            <span>🩺</span>
            <span>Does the provider need to diagnose first?</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={requiresDiagnosis}
              onChange={(e) => onToggleDiagnosis(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      )}

      {/* Diagnosis Mode Banner */}
      {requiresDiagnosis ? (
        <div className="bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 rounded-lg p-2.5 flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-200">
          <span>ℹ️</span>
          <span>Diagnosis required first. No materials list needed upfront.</span>
        </div>
      ) : (
        <>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Add Needed Material / Equipment
          </span>

          {/* Dynamic Field Rows */}
          <div className="space-y-2 mb-2">
            {rows.map((item, index) => (
              <div key={item.id || index} className="flex items-center gap-1.5 sm:gap-2 w-full">
                <input
                  type="text"
                  placeholder="Material / Tool name"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                  disabled={readOnly}
                  className="flex-1 min-w-0 px-2.5 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="text"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                  disabled={readOnly}
                  className="w-16 sm:w-20 shrink-0 px-2 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-center"
                />

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="text-red-500 hover:text-red-700 p-1 text-xs shrink-0"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Another Item Button */}
          {!readOnly && (
            <button
              type="button"
              onClick={handleAddRow}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors flex items-center gap-1 mt-1"
            >
              ➕ Add another item
            </button>
          )}
        </>
      )}
    </div>
  );
};
