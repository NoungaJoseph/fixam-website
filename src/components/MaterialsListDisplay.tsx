import React from 'react';
import { MaterialItem } from './MaterialsListEditor';

interface MaterialsListDisplayProps {
  materialsList?: MaterialItem[];
  requiresDiagnosis?: boolean;
}

export const MaterialsListDisplay: React.FC<MaterialsListDisplayProps> = ({
  materialsList = [],
  requiresDiagnosis = false
}) => {
  if (requiresDiagnosis) {
    return (
      <div className="bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 rounded-xl p-3 my-3 flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200 font-semibold">
        <span className="text-base">🩺</span>
        <span>Diagnosis required first</span>
      </div>
    );
  }

  if (!materialsList || materialsList.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 my-3">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Required Materials & Equipment</h3>
      </div>

      <div className="space-y-1.5 pl-1">
        {materialsList.map((item, idx) => (
          <div key={item.id || idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-teal-600">•</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
            </div>
            {item.quantity && <span className="text-slate-500 text-[11px]">({item.quantity})</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
