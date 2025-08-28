// src/components/campaigns/CampaignsPageHeader.tsx
'use client';

/**
 * @file Orquestador de UI para el encabezado de la página de gestión de productos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
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

export interface CampaignsPageHeaderProps {
  site: SiteInfo;
  onCreateProduct: (formData: FormData) => Promise<void>;
  isCreatePending: boolean;
}

/**
 * @public
 * @component CampaignsPageHeader
 * @description Ensambla la UI del encabezado de la página de gestión de productos.
 */
export function CampaignsPageHeader({
  site,
  onCreateProduct,
  isCreatePending,
}: CampaignsPageHeaderProps): React.ReactElement {
  clientLogger.trace('[CampaignsPageHeader] Renderizando ensamblador de UI.');
  const t = useTranslations('CampaignsPage');
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
            {t('createCampaignButton')}
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
 * @module campaigns-page-header
 * @description Componente de encabezado para la página de gestión de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Filtros y Ordenamiento:** Proponho adicionar componentes de filtro por `status` e um seletor para `sortBy` neste cabeçalho, seguindo o padrão de design estabelecido no módulo de `sites`.
 * - ((Vigente)) **Componente `ViewSwitcher`:** Proponho adicionar um componente para alternar entre a visualização em tabela e uma futura visualização em grade (`grid`), persistindo a preferência do usuário.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Erro de Contrato (TS2322):** A interface de props foi atualizada para aceitar `onCreateProduct` e `isCreatePending`, resolvendo o erro de compilação e permitindo que a lógica do hook `useCampaignsPage` seja corretamente conectada ao `CreateProductDialog`.
 * - ((Implementada)) **Feedback de UI de Élite:** O botão "Crear Producto" agora é desabilitado durante a operação de criação (`isCreatePending`), fornecendo um feedback visual claro ao usuário e prevenindo submissões duplicadas.
 */
// src/components/campaigns/CampaignsPageHeader.tsx
