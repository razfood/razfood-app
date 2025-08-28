// src/lib/hooks/useCampaignsPage.ts
'use client';

/**
 * @file Hook orquestador soberano para la página de gestión de productos (campañas).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este hook es el "cerebro" de la página de gestión de productos. Encapsula
 *              toda la lógica de estado, incluyendo filtros sincronizados con la URL,
 *              manejo de UI optimista para operaciones CRUD, y la invocación de Server
 *              Actions con feedback al usuario (toasts).
 */
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { createProductAction } from '@/lib/actions/products/create.action';
import { deleteProductAction } from '@/lib/actions/products/delete.action';
import { type ProductRow } from '@/components/campaigns/campaigns-columns';
import { useOptimisticResourceManagement } from '@/lib/hooks/useOptimisticResourceManagement';
import { useUrlStateSync } from '@/lib/hooks/ui/useUrlStateSync';
import { clientLogger } from '@/lib/logger';
import { type Tables } from '@/lib/types/database';

type ProductStatus = ProductRow['status'] | 'all';
type SortByOption = 'updated_at_desc' | 'name_asc';

type CampaignFiltersState = {
  q: string;
  status: ProductStatus;
  sort: SortByOption;
};

export interface UseCampaignsPageProps {
  initialProducts: ProductRow[];
  initialSearchQuery: string;
  site: Pick<Tables<'sites'>, 'id' | 'name' | 'subdomain'>;
  totalCount: number;
  page: number;
  limit: number;
  initialStatus?: ProductStatus;
  initialSortBy?: SortByOption;
}

/**
 * @public
 * @function useCampaignsPage
 * @description Orquesta la lógica completa para la página de gestión de productos.
 * @param {UseCampaignsPageProps} props - Propiedades iniciales para el estado de la página.
 * @returns Un objeto con el estado computado, los manejadores de eventos y las funciones de traducción.
 */
export function useCampaignsPage({
  initialProducts,
  initialSearchQuery,
  initialStatus,
  initialSortBy,
  site,
}: UseCampaignsPageProps) {
  clientLogger.trace('[useCampaignsPage] Hook soberano inicializado.');
  const t = useTranslations('CampaignsPage');
  const router = useRouter();

  const {
    state: filters,
    setState: setFilters,
    isSyncing,
  } = useUrlStateSync<CampaignFiltersState>({
    initialState: {
      q: initialSearchQuery,
      status: initialStatus || 'all',
      sort: initialSortBy || 'updated_at_desc',
    },
  });

  const createOptimisticProduct = (formData: FormData): ProductRow => {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    return {
      id: `optimistic-${Date.now()}`,
      name,
      price,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      site_id: site.id,
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      description: (formData.get('description') as string) || null,
      image_url: null,
    };
  };

  const {
    items: products,
    isPending,
    mutatingId,
    handleCreate,
    handleDelete,
  } = useOptimisticResourceManagement<ProductRow>({
    initialItems: initialProducts,
    createAction: createProductAction,
    deleteAction: deleteProductAction,
    createOptimisticItem: createOptimisticProduct,
    deleteItemIdKey: 'productId',
  });

  const handleCreateProduct = async (formData: FormData) => {
    const result = await handleCreate(formData);
    if (result.success) {
      toast.success(t('toasts.create_success'));
      router.refresh();
    } else {
      toast.error(t(`errors.${result.error}` as any, { errorId: result.data?.errorId }) || t('errors.unexpected'));
    }
  };

  const handleDeleteProduct = async (formData: FormData) => {
    const result = await handleDelete(formData);
    if (result.success) {
      toast.success(t('toasts.delete_success'));
    } else {
      toast.error(t(`errors.${result.error}` as any, { errorId: result.data?.errorId }) || t('errors.unexpected'));
    }
  };

  return {
    t,
    products,
    isPending,
    isSyncing,
    mutatingId,
    searchTerm: filters.q,
    setSearchTerm: (value: string) => setFilters((f) => ({ ...f, q: value })),
    statusFilter: filters.status,
    setStatusFilter: (status?: ProductStatus) => setFilters((f) => ({ ...f, status: status || 'all' })),
    sortBy: filters.sort,
    setSortBy: (sort: SortByOption) => setFilters((f) => ({ ...f, sort })),
    handleCreateProduct,
    handleDeleteProduct,
  };
}

/**
 * @module use-campaigns-page
 * @description Hook soberano para la lógica de la página de gestión de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Abstracción de Acciones:** Proponho criar um hook `useProductActions` que encapsule a lógica de chamar as Server Actions (`update`, `delete`, `archive`, `duplicate`) e mostrar os toasts. O `useCampaignsPage` consumiria este novo hook, simplificando ainda mais a sua lógica e melhorando a coesão.
 * - ((Vigente)) **Factoría de Items Optimistas Atómica:** Proponho extrair a lógica de `createOptimisticProduct` para um helper `optimisticItemFactory.ts`. Isso permitiria reutilizar a lógica de criação de itens otimistas em outros hooks, caso necessário, e manteria este hook mais focado na orquestração.
 * - ((Vigente)) **Tipado de Errores con `isActionError`:** Proponho utilizar um "type guard" `isActionError` para garantir que `result.error` seja uma chave de i18n válida antes de passá-la para `t()`, proporcionando uma segurança de tipos de élite.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Correção de Dependências:** Todas as importações foram corrigidas para apontar para os módulos corretos (`@/lib/actions/products/*`, `@/lib/logger`, etc.), resolvendo os erros `TS2307`.
 * - ((Implementada)) **Alinhamento de Tipos:** O tipo `Site` foi substituído pelo canônico `Tables<'sites'>`, e o contrato de props (`UseCampaignsPageProps`) foi atualizado para incluir todas as propriedades esperadas, resolvendo os erros `TS2305` e `TS2741`.
 * - ((Implementada)) **Consistência de Tipos:** A função `createOptimisticProduct` agora retorna um `price` do tipo `number`, alinhando-se com o tipo `ProductRow` da base de dados.
 */
// src/lib/hooks/useCampaignsPage.ts
