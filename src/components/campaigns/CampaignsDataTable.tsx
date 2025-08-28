// src/components/campaigns/CampaignsDataTable.tsx
'use client';

/**
 * @file Orquesta y ensambla la tabla de datos de productos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este componente de cliente es un orquestador de UI. Recibe los datos y
 *              configuración de paginación desde un Server Component, consume las
 *              definiciones de columna y ensambla el componente genérico
 *              `PaginatedDataTable` para renderizar la vista completa.
 */

import React from 'react';
import { useTranslations } from 'next-intl';

import { PaginatedDataTable } from '@/components/shared/PaginatedDataTable';
import { logger } from '@/lib/logger';
import { columns, type ProductRow } from './campaigns-columns';

export interface CampaignsDataTableProps {
  products: ProductRow[];
  totalCount: number;
  page: number;
  limit: number;
  basePath: string;
  searchQuery?: string;
}

/**
 * @public
 * @component CampaignsDataTable
 * @description Ensambla y renderiza la tabla de productos con paginación.
 * @param {CampaignsDataTableProps} props - Propiedades para configurar la tabla.
 * @returns {React.ReactElement} El componente de tabla de datos paginada.
 */
export function CampaignsDataTable({
  products,
  totalCount,
  page,
  limit,
  basePath,
  searchQuery,
}: CampaignsDataTableProps): React.ReactElement {
  logger.trace('[CampaignsDataTable] Renderizando orquestador de tabla de datos.');
  const t = useTranslations('CampaignsPage');

  const memoizedColumns = React.useMemo(() => columns, []);

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
 * @module campaigns-data-table
 * @description Orquestador de UI para la tabla de datos de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Conexión de Acciones Reales:** Proponho, na próxima fase, que este componente receba os handlers `onDelete`, `onDuplicate`, e `onArchive` de um hook de nível superior (`useCampaignsPage`). Estes handlers invocarão as Server Actions correspondentes. A definição de colunas (`campaigns-columns.tsx`) será então atualizada para receber e utilizar estas funções.
 * - ((Vigente)) **Implementación de UI Otimista:** Uma vez que as ações estejam conectadas, a UI será atualizada instantaneamente ao apagar ou arquivar um produto, enquanto a requisição ao servidor é processada em segundo plano, proporcionando uma UX de élite.
 * - ((Vigente)) **Seleção de Linhas para Ações em Massa:** Proponho adicionar a funcionalidade de seleção de linhas (checkboxes) para permitir ações em massa, como "Arquivar Selecionados" ou "Excluir Selecionados".
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Orquestador de UI Atómico:** Este componente cumpre a sua única responsabilidade de ensamblar a tabela, seguindo o padrão de "Dumb Component" que recebe dados e configuração, e delega a renderização complexa a componentes genéricos.
 * - ((Implementada)) **Adesão ao DRY:** Ao consumir `PaginatedDataTable` e `campaigns-columns`, este componente evita a duplicação de lógica de renderização de tabelas, paginação ou definição de colunas, aderindo estritamente ao princípio Don't Repeat Yourself.
 * - ((Implementada)) **Full Internacionalização:** O componente é 100% agnóstico ao conteúdo, recebendo todos os seus textos da camada de i18n e passando-os para os seus filhos.
 */
// src/components/campaigns/CampaignsDataTable.tsx
