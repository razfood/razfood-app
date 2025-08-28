// src/app/[locale]/dashboard/sites/[siteId]/products/products-client.tsx
/**
 * @file Orquestador de UI de élite para la página de gestión de productos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es un componente de presentación 100% puro que consume
 *              el hook soberano `useProductsPage`. Su única responsabilidad es ensamblar
 *              la UI, delegando toda la lógica de estado y acciones al hook.
 */
'use client';

import React from 'react';
import { useFormatter, useTranslations } from 'next-intl';

import { useProductsPage, type UseProductsPageProps } from '@/lib/hooks/useProductsPage';
import { PaginatedDataTable } from '@/components/shared/PaginatedDataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { ProductsPageHeader } from '@/components/products/ProductsPageHeader';
import { getProductsColumns } from '@/components/products/products-columns';
import { clientLogger } from '@/lib/logging';

/**
 * @public
 * @component ProductsClient
 * @description Componente de presentación puro que ensambla la UI para la página de gestión de productos.
 * @param {UseProductsPageProps} props - Propiedades iniciales pasadas desde el cargador de datos del servidor.
 * @returns {React.ReactElement}
 */
export function ProductsClient(props: UseProductsPageProps): React.ReactElement {
  clientLogger.trace('[ProductsClient] Renderizando orquestador de UI puro.');

  const {
    t,
    products,
    isPending,
    isSyncing,
    mutatingId,
    searchTerm,
    setSearchTerm,
    // Aquí se recibirán los filtros y ordenamiento en el futuro
    handleCreateProduct,
    handleDeleteProduct,
  } = useProductsPage(props);

  const tDialogs = useTranslations('Dialogs');

  const columns = React.useMemo(
    () =>
      getProductsColumns({
        t,
        tDialogs,
        onDelete: handleDeleteProduct,
        isPending,
        mutatingId,
      }),
    [t, tDialogs, handleDeleteProduct, isPending, mutatingId],
  );

  return (
    <div className="flex flex-col gap-6">
      <ProductsPageHeader
        site={props.site}
        onCreateProduct={handleCreateProduct}
        isCreatePending={isPending && (mutatingId?.startsWith('optimistic-') ?? false)}
      />
      <div className="w-full md:w-1/3">
        <SearchInput
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          clearAriaLabel={t('search.clear_aria')}
          isLoading={isSyncing}
        />
      </div>
      <PaginatedDataTable
        columns={columns}
        data={products}
        noResultsText={t('table.empty_state')}
        page={props.page}
        totalCount={props.totalCount}
        limit={props.limit}
        basePath={`/dashboard/sites/${props.site.id}/products`}
        searchQuery={searchTerm}
      />
    </div>
  );
}
/**
 * @module products-client
 * @description Orquestador de UI para la página de gestión de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Contexto de Página (`ProductsPageContext`):** Proponho, para uma arquitetura de élite e para eliminar completamente o "prop drilling", que o valor de retorno do hook `useProductsPage` seja fornecido através de um `ProductsPageContext`. Isso permitiria que componentes filhos, como `ProductsPageHeader`, consumissem o estado e as ações diretamente, sem a necessidade de passar um grande número de props.
 * - ((Vigente)) **Conexão de Filtros e Ordenação:** Proponho, como próximo passo lógico, conectar os estados `statusFilter` e `sortBy` do hook `useProductsPage` ao `ProductsPageHeader` e à factoría `getProductsColumns` para ativar a funcionalidade completa de filtragem e ordenação na UI.
 */
// src/app/[locale]/dashboard/sites/[siteId]/products/products-client.tsx
