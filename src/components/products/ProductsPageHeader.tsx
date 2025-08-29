// src/components/products/ProductsPageHeader.tsx
'use client';

/**
 * @file Orquestador de UI para el encabezado de la página de gestión de productos.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato de UI es un ensamblador puro. Compone el título de la
 *              página, la navegación, y conecta la lógica de creación de productos
 *              al diálogo correspondiente. Es un componente controlado, que recibe
 *              toda su lógica y estado a través de props.
 */

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { useDialogState } from '@/lib/hooks/ui/useDialogState';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';
import { clientLogger } from '@/lib/logger';
import type { Tables } from '@/lib/types/database';

type SiteInfo = Pick<Tables<'sites'>, 'id' | 'name' | 'subdomain'>;

export interface ProductsPageHeaderProps {
  site: SiteInfo;
  onCreateProduct: (formData: FormData) => Promise<void>;
  isCreatePending: boolean;
}

/**
 * @public
 * @component ProductsPageHeader
 * @description Ensambla la UI del encabezado de la página de gestión de productos.
 * @param {ProductsPageHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function ProductsPageHeader({
  site,
  onCreateProduct,
  isCreatePending,
}: ProductsPageHeaderProps): React.ReactElement {
  clientLogger.trace('[ProductsPageHeader] Renderizando ensamblador de UI.');
  const t = useTranslations('ProductsPage');
  const { isOpen, open, setIsOpen } = useDialogState();

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-4">
            <Link href="/dashboard/sites">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToSitesButton')}
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {t.rich('pageTitle', {
              siteName: site.name,
              span: (chunks) => <span className="text-primary">{chunks}</span>,
            })}
          </h1>
          <p className="text-muted-foreground">{t('pageDescription')}</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Button onClick={open} className="w-full sm:w-auto" disabled={isCreatePending}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('createProductButton')}
          </Button>
        </div>
      </div>
      <CreateProductDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        siteId={site.id}
        onCreate={onCreateProduct}
        isPending={isCreatePending}
      />
    </>
  );
}

/**
 * @module products-page-header
 * @description Componente de encabezado para la página de gestión de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Filtros y Ordenamiento:** Adicionar componentes de UI para filtrar os produtos por `status` e um seletor para `sortBy`. Estes controles seriam conectados às funções `setStatusFilter` e `setSortBy` do hook `useProductsPage`, tornando o cabeçalho o centro de controle para a visualização de dados.
 * - ((Vigente)) **Componente `ViewSwitcher`:** Adicionar um componente para alternar entre a visualização em tabela (`PaginatedDataTable`) e uma futura visualização em grade (`ProductsDataGrid`), persistindo a preferência do usuário na URL através do hook `useUrlStateSync`.
 * - ((Vigente)) **Botão de Ações em Massa:** Quando a seleção de linhas for implementada na tabela, um botão de "Ações" (`DropdownMenu`) deve aparecer aqui condicionalmente, oferecendo opções como "Arquivar Selecionados" ou "Excluir Selecionados".
 */
// src/components/products/ProductsPageHeader.tsx
