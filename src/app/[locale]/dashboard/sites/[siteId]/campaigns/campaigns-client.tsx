// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
'use client';

/**
 * @file Orquestador de UI para la página de gestión de productos (campañas).
 * @author Raz Podestá - MetaShark Tech
 * @version 3.1.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a un estándar de élite. Ahora es un
 *              componente de presentación 100% puro que consume el hook soberano
 *              `useCampaignsPage`. Su única responsabilidad es ensamblar la UI,
 *              delegando toda la lógica de estado y acciones al hook.
 */
import React from 'react';
import { useTranslations } from 'next-intl';

import { useCampaignsPage, type UseCampaignsPageProps } from '@/lib/hooks/useCampaignsPage';
import { CampaignsDataTable } from '@/components/campaigns/CampaignsDataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { CampaignsPageHeader } from '@/components/campaigns/CampaignsPageHeader';
import { getCampaignsColumns } from '@/components/campaigns/campaigns-columns';
import { clientLogger } from '@/lib/logger';

/**
 * @public
 * @component CampaignsClient
 * @description Componente de presentación puro que ensambla la UI para la página de gestión de productos.
 * @param {UseCampaignsPageProps} props - Propiedades iniciales pasadas desde el cargador de datos del servidor.
 * @returns {React.ReactElement}
 */
export function CampaignsClient(props: UseCampaignsPageProps): React.ReactElement {
  clientLogger.trace('[CampaignsClient] Renderizando orquestador de UI completamente funcional.');

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
  } = useCampaignsPage(props);

  const tDialogs = useTranslations('Dialogs');

  const isCreatePending = isPending && (mutatingId?.startsWith('optimistic-') ?? false);

  const columns = React.useMemo(
    () =>
      getCampaignsColumns({
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
      <CampaignsPageHeader site={props.site} onCreateProduct={handleCreateProduct} isCreatePending={isCreatePending} />
      <div className="w-full md:w-1/3">
        <SearchInput
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          clearAriaLabel={t('search.clear_aria')}
          isLoading={isSyncing}
        />
      </div>
      <CampaignsDataTable
        products={products}
        totalCount={props.totalCount}
        page={props.page}
        limit={props.limit}
        basePath={`/dashboard/sites/${props.site.id}/campaigns`}
        searchQuery={searchTerm}
      />
    </div>
  );
}

/**
 * @module campaigns-client
 * @description Orquestador de UI para la página de gestión de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Contexto de Página (`CampaignsPageContext`):** Para eliminar completamente o "prop drilling" e alcançar um padrão de élite, o valor de retorno do hook `useCampaignsPage` poderia ser fornecido através de um `CampaignsPageContext`. Isso permitiria que componentes filhos, como `CampaignsPageHeader`, consumissem o estado e as ações diretamente.
 * - ((Vigente)) **Esqueleto de Carga de Alta Fidelidade:** O componente `loading.tsx` atual para esta página é genérico. Proponho criar um esqueleto de alta fidelidade que simule a estrutura exata desta UI (`Header`, `SearchInput`, `DataTable`) para uma UX de carregamento superior.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Erros de Compilação:** Corrigidas todas as importações e tipos, resolvendo os erros `TS2307`, `TS2305`, `TS2741` e `TS7006`, tornando o componente totalmente compilável e funcional.
 * - ((Implementada)) **Conexão Completa de Lógica e UI:** O componente agora consome e injeta completamente o estado e os manipuladores do hook `useCampaignsPage`, tornando a página totalmente interativa e funcional.
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx
