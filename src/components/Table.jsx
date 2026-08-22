import React from 'react';
import { Skeleton } from './UI';
import { FileQuestion } from 'lucide-react';

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyStateText = "No records found.",
  emptyStateDescription = "Try adjusting your search filters or add a new entry.",
  onRowClick
}) => {
  const renderCell = (row, col) => {
    if (col.render) {
      return col.render(row);
    }
    // Deep access helper: e.g. 'salaryDetails.basicSalary'
    const keys = col.key.split('.');
    let val = row;
    for (let k of keys) {
      if (val === null || val === undefined) return '';
      val = val[k];
    }
    return val;
  };

  return (
    <div className="w-full bg-white border border-charcoal-100 rounded-xl overflow-hidden shadow-subtle">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-charcoal-50 border-b border-charcoal-100">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-3.5 text-xs font-semibold text-charcoal-500 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-charcoal-100 text-sm">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="hover:bg-charcoal-50/50">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-6 py-4">
                      <Skeleton className="h-4 w-3/4 rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State Row
              <tr>
                <td colSpan={columns.length} className="px-6 py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-charcoal-50 rounded-full text-charcoal-400 mb-3 border border-charcoal-100">
                      <FileQuestion className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-charcoal-800 text-sm">{emptyStateText}</p>
                    <p className="text-xs text-charcoal-400 mt-1 max-w-sm">{emptyStateDescription}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Rows
              data.map((row, rIdx) => (
                <tr 
                  key={row.id || rIdx} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-charcoal-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, cIdx) => (
                    <td 
                      key={cIdx} 
                      className={`px-6 py-4 text-charcoal-850 font-medium ${col.className || ''}`}
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- PAGINATION COMPONENT ---
export const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-3 border border-t-0 border-charcoal-100 bg-white rounded-b-xl shadow-subtle text-xs">
      <div className="text-charcoal-400">
        Showing <span className="font-semibold text-charcoal-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-semibold text-charcoal-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold text-charcoal-900">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 border border-charcoal-200 rounded-lg hover:bg-charcoal-50 text-charcoal-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${currentPage === p ? 'bg-charcoal-950 text-white border-charcoal-950 font-semibold' : 'border-charcoal-200 hover:bg-charcoal-50 text-charcoal-700'}`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 border border-charcoal-200 rounded-lg hover:bg-charcoal-50 text-charcoal-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};
