// src/lib/hooks/useOptimisticResourceManagement.ts
'use client';

/**
 * @file Hook soberano y genérico para la gestión optimista de recursos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
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
      clientLogger.trace('[Optimistic] Iniciando creación optimista.', { id: optimisticItem.id });
      let result: ActionResult<{ id: string }> = { success: false, error: 'unknown' };

      startTransition(() => {
        setMutatingId(optimisticItem.id);
        setOptimisticItems((current) => [optimisticItem, ...current]);
      });

      result = await createAction(formData);

      if (!result.success) {
        clientLogger.warn('[Optimistic] Creación fallida. Revirtiendo UI.', { id: optimisticItem.id });
        setOptimisticItems((current) => current.filter((item) => item.id !== optimisticItem.id));
      } else {
        clientLogger.trace('[Optimistic] Creación confirmada por el servidor.', { id: result.data.id });
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
      clientLogger.trace('[Optimistic] Iniciando eliminación optimista.', { id: itemId });
      let result: ActionResult<void> = { success: false, error: 'unknown' };

      startTransition(() => {
        setMutatingId(itemId);
        setOptimisticItems((current) => current.filter((item) => item.id !== itemId));
      });

      result = await deleteAction(formData);

      if (!result.success) {
        clientLogger.warn('[Optimistic] Eliminación fallida. Revirtiendo UI.', { id: itemId });
        setOptimisticItems(originalItems);
      } else {
        clientLogger.trace('[Optimistic] Eliminación confirmada por el servidor.', { id: itemId });
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
 * - ((Vigente)) **Rollback Mais Granular:** Em caso de falha na criação, a implementação atual remove o item otimista. Uma estratégia mais robusta poderia marcá-lo visualmente como "falhou ao criar" com uma opção para "tentar novamente", preservando os dados que o usuário inseriu no formulário.
 * - ((Vigente)) **Tipado Fuerte para `ActionResult`:** Em vez de retornar `{ success: false, error: 'unknown' }` como fallback, o hook poderia ser tipado para aceitar um `defaultError` específico do domínio, melhorando a segurança de tipos.
 */
// src/lib/hooks/useOptimisticResourceManagement.ts
