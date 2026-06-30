'use client';

/**
 * ПРИМЕР: TanStack Table (headless)
 *
 * Где живёт: features/<name>/components/
 * Таблица — UI фичи, данные приходят из queries/ или props от view.
 */

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface Row {
  id: string;
  name: string;
}

const columnHelper = createColumnHelper<Row>();

const columns = [
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('name', { header: 'Name' }),
];

const data: Row[] = [
  { id: '1', name: 'Пример' },
  { id: '2', name: 'Строка' },
];

export function ExampleTable() {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((header) => (
              <th key={header.id} className="border px-3 py-2 text-left">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border px-3 py-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Куда это идёт в архитектуре:
// features/<name>/components/ — не в shared/, таблица привязана к домену фичи.
