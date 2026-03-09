import type { ReactNode } from 'react';

interface TableHeader {
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface Props {
  headers: TableHeader[];
  rows: ReactNode[][];
}

export default function Table({ headers, rows }: Props) {
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-xs md:text-sm">
        <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {headers.map((header) => (
              <th
                key={header.label}
                className={`px-2 py-2 md:px-4 md:py-3 ${
                  header.align === 'right' ? 'text-right' : header.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-slate-100 text-slate-700">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-2 py-2 align-top text-xs md:px-4 md:py-3 md:text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
