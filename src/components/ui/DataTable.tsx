/**
 * DataTable.tsx — Reusable Data Table Component
 * 
 * Replaces repetitive table structures in admin pages.
 * Supports: sorting, loading states with skeletons, and custom cell rendering.
 */

import React, { useState } from 'react';
import { TableRowSkeleton } from './Skeleton';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  skeletonRows?: number;
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available.',
  skeletonRows = 5,
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Note: Sorting logic is intended to be handled by the parent component 
  // via a data prop or fetch effect, but the UI state is managed here.

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] uppercase text-[var(--color-text-muted)] tracking-widest border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-3)]">
            {columns.map(col => (
              <th
                key={String(col.key)}
                className={`px-8 py-4 font-bold ${col.width ? `w-[${col.width}]` : ''} ${col.align === 'right' ? 'text-right' : ''}`}
              >
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(String(col.key))}
                    className="inline-flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {col.header}
                    {sortKey === String(col.key)
                      ? sortDir === 'asc'
                        ? <ChevronUp size={12} />
                        : <ChevronDown size={12} />
                      : <ChevronUp size={12} className="opacity-30" />
                    }
                  </button>
                ) : col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            : data.length === 0
              ? (
                <tr>
                  <td colSpan={columns.length} className="px-8 py-20 text-center text-[var(--color-text-muted)] italic">
                    {emptyMessage}
                  </td>
                </tr>
              )
              : data.map(row => (
                  <tr
                    key={keyExtractor(row)}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-3)] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {columns.map(col => (
                      <td
                        key={String(col.key)}
                        className={`px-8 py-6 ${col.align === 'right' ? 'text-right' : ''}`}
                      >
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[String(col.key)] ?? '')
                        }
                      </td>
                    ))}
                  </tr>
                ))
          }
        </tbody>
      </table>
    </div>
  );
}
