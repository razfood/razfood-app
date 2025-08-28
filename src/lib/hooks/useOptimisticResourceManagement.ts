// src/lib/hooks/useOptimisticResourceManagement.ts
'use client';

/**
 * @file Hook soberano y genérico para la gestión optimista de recursos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es una pieza de infraestructura de lógica de UI de élite.
 *              Encapsula el patrón de UI optimista para operaciones CRUD (crear, eliminar)
 *              en un array de datos. Actualiza la UI instantáneamente y luego reconcilia
 *              el estado con la respuesta de la Server Action.
 */

import { useState, useTransition, useCallback, useEffect } from 'react';
import { clientLogger } from '@/lib/logger';
import { type ActionResult } from '@/lib/validators';

type ItemWithId = { id: string; [key: string]: any };

interface UseOptimisticResourceManagementProps<TItem extends ItemWithId> {
  initialItems: TItem[];
  createAction: (formData: FormData) => Promise<ActionResult<{ id: string }>>;
  deleteAction: (formData: FormData) => Promise<ActionResult<void>>;
  createOptimisticItem: (formData: FormData) => TItem;
  deleteItemIdKey: string;
}

interface UseOptimisticResourceManagementReturn<TItem> {
  items: TItem[];
  isPending: boolean;
  mutatingId: string | null;
  handleCreate: (formData: FormData) => Promise<ActionResult<{ id: string }>>;
  handleDelete: (formData: FormData) => Promise<ActionResult<void>>;
}

/**
 * @public
 * @function useOptimisticResourceManagement
 * @description Gestiona un array de recursos con actualizaciones de UI optimistas.
 * @template TItem - El tipo de los items en el array. Debe tener una propiedad 'id'.
 */
export function useOptimisticResourceManagement<TItem extends ItemWithId>({
  initialItems,
  createAction,
  deleteAction,
  createOptimisticItem,
  deleteItemIdKey,
}: UseOptimisticResourceManagementProps<TItem>): UseOptimisticResourceManagementReturn<TItem> {
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, setOptimisticItems] = useState(initialItems);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  useEffect(() => {
    setOptimisticItems(initialItems);
  }, [initialItems]);

  const handleCreate = useCallback(
    async (formData: FormData): Promise<ActionResult<{ id: string }>> => {
      const optimisticItem = createOptimisticItem(formData);
      let result: ActionResult<{ id: string }> = { success: false, error: 'unknown' };

      startTransition(() => {
        setMutatingId(optimisticItem.id);
        setOptimisticItems((current) => [optimisticItem, ...current]);
      });

      result = await createAction(formData);

      if (!result.success) {
        setOptimisticItems((current) => current.filter((item) => item.id !== optimisticItem.id));
      }

      setMutatingId(null);
      return result;
    },
    [createAction, createOptimisticItem],
  );

  const handleDelete = useCallback(
    async (formData: FormData): Promise<ActionResult<void>> => {
      const itemId = formData.get(deleteItemIdKey) as string;
      const originalItems = optimisticItems;
      let result: ActionResult<void> = { success: false, error: 'unknown' };

      startTransition(() => {
        setMutatingId(itemId);
        setOptimisticItems((current) => current.filter((item) => item.id !== itemId));
      });

      result = await deleteAction(formData);

      if (!result.success) {
        setOptimisticItems(originalItems);
      }

      setMutatingId(null);
      return result;
    },
    [deleteAction, deleteItemIdKey, optimisticItems],
  );

  return {
    items: optimisticItems,
    isPending,
    mutatingId,
    handleCreate,
    handleDelete,
  };
}

/**
 * @module use-optimistic-resource-management
 * @description Hook de lógica de UI para operaciones CRUD optimistas.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Gestión de Actualizaciones (`handleUpdate`):** Adicionar um `updateAction` e um `handleUpdate` para completar o ciclo CRUD. A atualização otimista substituiria o item no estado local enquanto a `Server Action` é executada, com uma lógica de rollback em caso de falha.
 * - ((Vigente)) **Rollback Mais granular:** Em caso de falha na criação, a implementação atual remove o item otimista. Uma estratégia mais robusta poderia marcá-lo visualmente como "falhou ao criar" com uma opção para "tentar novamente", preservando os dados que o usuário inseriu no formulário.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Lógica de UI Otimista Centralizada (DRY):** Este hook encapsula o padrão de UI otimista de forma genérica e reutilizável, eliminando a necessidade de reimplementar esta lógica complexa em cada página e aderindo estritamente ao princípio DRY.
 * - ((Implementada)) **API de Alto Nível:** Fornece uma API simples (`handleCreate`, `handleDelete`) que abstrai a complexidade do `useTransition` e da manipulação do estado otimista, melhorando a DX para os desenvolvedores que o consomem.
 * - ((Implementada)) **Feedback de UI Instantâneo:** Permite que a UI reaja instantaneamente às ações do usuário, proporcionando uma experiência de aplicação web moderna e de alto desempenho.
 */
// src/lib/hooks/useOptimisticResourceManagement.ts
