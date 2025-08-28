// src/components/shared/PaginatedDataTable.tsx
'use client';

/**
 * @file Componente de UI genérico y de élite para renderizar tablas de datos con paginación.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es una pieza de infraestructura de UI soberana. Utiliza
 *              `@tanstack/react-table` para renderizar cualquier conjunto de datos
 *              y proporciona controles de paginación que se sincronizan con la URL.
 *              Es completamente genérico y reutilizable en toda la aplicación.
 */

import * as React from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { clientLogger } from '@/lib/logger';

interface PaginatedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noResultsText: string;
  totalCount: number;
  page: number;
  limit: number;
  basePath: string;
  searchQuery?: string;
}

/**
 * @public
 * @component PaginatedDataTable
 * @description Renderiza una tabla de datos genérica con controles de paginación.
 */
export function PaginatedDataTable<TData, TValue>({
  columns,
  data,
  noResultsText,
  totalCount,
  page,
  limit,
  basePath,
  searchQuery,
}: PaginatedDataTableProps<TData, TValue>) {
  clientLogger.trace('[PaginatedDataTable] Renderizando tabla genérica.');
  const t = useTranslations('Components.PaginatedDataTable');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: totalCount,
  });

  const totalPages = Math.ceil(totalCount / limit);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    if (pageNumber > 1) {
      params.set('page', pageNumber.toString());
    }
    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {noResultsText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t('pagination_summary', {
            start: Math.min((page - 1) * limit + 1, totalCount),
            end: Math.min(page * limit, totalCount),
            total: totalCount,
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild disabled={!hasPreviousPage}>
            <Link href={createPageUrl(page - 1)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('previous_button')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild disabled={!hasNextPage}>
            <Link href={createPageUrl(page + 1)}>
              {t('next_button')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * @module PaginatedDataTable
 * @description Componente genérico para tablas de datos con paginación basada en URL.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Input de Página:** Adicionar um campo de entrada numérico entre os botões "Anterior" e "Próximo" que permita ao usuário saltar diretamente para uma página específica.
 * - ((Vigente)) **Seleção de Limite por Página:** Adicionar um componente `<Select>` que permita ao usuário escolher o número de itens por página (ex: 10, 25, 50), persistindo essa preferência nos parâmetros da URL.
 * - ((Vigente)) **Indicador de Carga:** Adicionar uma prop `isLoading?: boolean` que, quando `true`, exiba uma sobreposição de carregamento ou um esqueleto dentro do corpo da tabela, fornecendo feedback visual durante a busca de dados.
 */
// src/components/shared/PaginatedDataTable.tsx