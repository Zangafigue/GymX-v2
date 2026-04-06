import React from 'react';
import { TableRowSkeleton } from './Skeleton';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  emptyMessage = "Aucune donnée trouvée",
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={`glass-card overflow-hidden ${className}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]">
              {columns.map((col, i) => (
                <th key={i} className={`px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] ${col.className ?? ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] bg-opacity-50">
            {columns.map((col, i) => (
              <th 
                key={i} 
                className={`px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] ${col.className ?? ''} text-${col.align ?? 'left'}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr 
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`group border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-[var(--color-surface-3)] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, i) => (
                  <td key={i} className={`px-8 py-6 text-sm ${col.className ?? ''} text-${col.align ?? 'left'}`}>
                    {typeof col.accessor === 'function' 
                      ? col.accessor(item) 
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-8 py-20 text-center text-sm text-[var(--color-text-muted)] italic">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
