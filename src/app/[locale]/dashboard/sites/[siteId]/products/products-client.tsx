// src/app/[locale]/dashboard/sites/[siteId]/products/products-client.tsx
'use client';

/**
 * @file Orquestador de UI de élite para la página de gestión de productos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es un componente de presentación 100% puro que consume
 *              el hook soberano `useProductsPage`. Su única responsabilidad es ensamblar
 *              la UI, delegando toda la lógica de estado y acciones al hook.
 */

import React from 'react';
import { useTranslations } from 'next-intl';

import { useProductsPage, type UseProductsPageProps } from '@/lib/hooks/useProductsPage';
import { ProductsDataTable } from '@/components/products/ProductsDataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { ProductsPageHeader } from '@/components/products/ProductsPageHeader';
import { clientLogger } from '@/lib/logger';

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
    handleCreateProduct,
    handleDeleteProduct,
  } = useProductsPage(props);

  const isCreatePending = isPending && (mutatingId?.startsWith('optimistic-') ?? false);

  return (
    <div className="flex flex-col gap-6">
      <ProductsPageHeader site={props.site} onCreateProduct={handleCreateProduct} isCreatePending={isCreatePending} />
      <div className="w-full md:w-1/3">
        <SearchInput
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          clearAriaLabel={t('search.clear_aria')}
          isLoading={isSyncing}
        />
      </div>
      <ProductsDataTable
        products={products}
        totalCount={props.totalCount}
        page={props.page}
        limit={props.limit}
        basePath={`/dashboard/sites/${props.site.id}/products`}
        searchQuery={searchTerm}
        onDelete={handleDeleteProduct}
        isPending={isPending}
        mutatingId={mutatingId}
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
 * - ((Vigente)) **Esqueleto de Carga de Alta Fidelidade:** O componente `loading.tsx` atual para esta página é genérico. Proponho criar um esqueleto de alta fidelidade que simule a estrutura exata desta UI (`Header`, `SearchInput`, `DataTable`) para uma UX de carregamento superior.
 */
// src/app/[locale]/dashboard/sites/[siteId]/products/products-client.tsx
