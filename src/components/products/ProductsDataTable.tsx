// src/components/products/ProductsDataTable.tsx
'use client';

/**
 * @file Orquesta y ensambla la tabla de datos de productos con columnas dinámicas.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este componente de cliente es un orquestador de UI de élite. Recibe
 *              los datos y la lógica de un hook soberano, consume la factoría de
 *              columnas para construir las definiciones dinámicamente, y ensambla el
 *              componente genérico `PaginatedDataTable` para renderizar la vista completa.
 */

import React from 'react';
import { useTranslations } from 'next-intl';

import { PaginatedDataTable } from '@/components/shared/PaginatedDataTable';
import { clientLogger } from '@/lib/logger';
import { getProductsColumns, type ProductRow } from './products-columns';

export interface ProductsDataTableProps {
  products: ProductRow[];
  totalCount: number;
  page: number;
  limit: number;
  basePath: string;
  searchQuery?: string;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  mutatingId: string | null;
}

/**
 * @public
 * @component ProductsDataTable
 * @description Ensambla y renderiza la tabla de productos con paginación y acciones.
 * @param {ProductsDataTableProps} props - Propiedades para configurar la tabla y sus acciones.
 * @returns {React.ReactElement} El componente de tabla de datos paginada.
 */
export function ProductsDataTable({
  products,
  totalCount,
  page,
  limit,
  basePath,
  searchQuery,
  onDelete,
  isPending,
  mutatingId,
}: ProductsDataTableProps): React.ReactElement {
  clientLogger.trace('[ProductsDataTable] Renderizando orquestador de tabla de datos.');
  const t = useTranslations('ProductsPage');
  const tDialogs = useTranslations('Dialogs');

  const memoizedColumns = React.useMemo(
    () =>
      getProductsColumns({
        t,
        tDialogs,
        onDelete,
        isPending,
        mutatingId,
      }),
    [t, tDialogs, onDelete, isPending, mutatingId],
  );

  return (
    <PaginatedDataTable
      columns={memoizedColumns}
      data={products}
      noResultsText={t('table.empty_state')}
      page={page}
      totalCount={totalCount}
      limit={limit}
      basePath={basePath}
      searchQuery={searchQuery}
    />
  );
}

/**
 * @module products-data-table
 * @description Orquestador de UI para la tabla de datos de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Ações em Massa:** Adicionar um cabeçalho à tabela que apareça condicionalmente quando uma ou mais linhas forem selecionadas. Este cabeçalho conteria botões para ações em massa (ex: "Excluir Selecionados"), invocando uma futura `deleteMultipleProductsAction`.
 * - ((Vigente)) **Componente de Visualização Alternativa:** Criar um `ProductsDataGrid.tsx` que renderize os produtos como uma grade de cartões. Este orquestador poderia então renderizar condicionalmente a tabela ou a grade com base em um estado de `viewMode` gerenciado pelo hook `useProductsPage`.
 * - ((Vigente)) **Abstração de Props de Ação:** Para uma DX ainda melhor, as props relacionadas a ações (`onDelete`, `isPending`, `mutatingId`) poderiam ser agrupadas em um único objeto `actionProps`, simplificando a assinatura do componente.
 */
// src/components/products/ProductsDataTable.tsx
