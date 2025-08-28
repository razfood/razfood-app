// src/lib/hooks/useOrdersKanban.ts
'use client';

/**
 * @file Hook soberano para la lógica del tablero Kanban de pedidos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este hook es el "cerebro" del dashboard de operaciones. Encapsula
 *              toda la lógica de estado para el tablero Kanban, incluyendo la gestión
 *              de arrastrar y soltar, actualizaciones optimistas y la integración con
 *              el sistema de tiempo real para recibir actualizaciones en vivo.
 */

import { useState, useMemo, useTransition, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { type DragEndEvent } from '@dnd-kit/core';
import toast from 'react-hot-toast';

import { useRealtimeOrders } from '@/lib/hooks/useRealtimeOrders';
import { type DashboardOrder } from '@/lib/data/orders/dashboard.data';
import { type Enums, type Tables } from '@/lib/types/database';
import { updateOrderStatusAction } from '@/lib/actions/orders/update-status.action';
import { clientLogger } from '@/lib/logger';

interface UseOrdersKanbanProps {
  initialOrders: DashboardOrder[];
  workspaceId: string;
}

/**
 * @public
 * @function useOrdersKanban
 * @description Orquesta la lógica completa para el tablero Kanban de pedidos.
 * @param {UseOrdersKanbanProps} props - Propiedades iniciales para el estado del tablero.
 * @returns Un objeto con el estado computado y los manejadores de eventos.
 */
export function useOrdersKanban({ initialOrders, workspaceId }: UseOrdersKanbanProps) {
  const t = useTranslations('OrdersDashboard');
  const [isPending, startTransition] = useTransition();
  const [orders, setOrders] = useState<DashboardOrder[]>(initialOrders);

  const onNewOrder = useCallback(
    (newOrder: Tables<'orders'>) => {
      // Para renderizar correctamente, necesitamos enriquecer el nuevo pedido con los tipos anidados.
      const enrichedOrder: DashboardOrder = {
        ...newOrder,
        order_items: [], // La suscripción no devuelve joins, se podría hacer un fetch adicional si es necesario.
        profiles: null,
      };
      setOrders((current) => [enrichedOrder, ...current]);
      toast.success(t('toasts.new_order_received'));
    },
    [t],
  );

  const onUpdateOrder = useCallback((updatedOrder: Tables<'orders'>) => {
    setOrders((current) => current.map((o) => (o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o)));
  }, []);

  useRealtimeOrders({ workspaceId, onNewOrder, onUpdateOrder });

  const ordersByStatus = useMemo(() => {
    const grouped: Record<string, DashboardOrder[]> = {};
    initialOrders[0] &&
      Object.keys(grouped).forEach((status) => {
        grouped[status] = orders.filter((order) => order.status === status);
      });
    return grouped;
  }, [orders, initialOrders]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const orderId = active.id as string;
    const newStatus = over.id as Enums<'order_status'>;
    const originalOrders = [...orders];
    const draggedOrder = originalOrders.find((o) => o.id === orderId);

    if (!draggedOrder || draggedOrder.status === newStatus) return;

    setOrders((current) => current.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

    startTransition(async () => {
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('status', newStatus);
      const result = await updateOrderStatusAction(formData);

      if (!result.success) {
        clientLogger.error('[useOrdersKanban] Falló la actualización de estado. Revirtiendo UI.', {
          orderId,
          error: result.error,
        });
        toast.error(t('toasts.update_error'));
        setOrders(originalOrders);
      } else {
        toast.success(t('toasts.update_success'));
      }
    });
  };

  return {
    orders,
    ordersByStatus,
    handleDragEnd,
  };
}

/**
 * @module use-orders-kanban
 * @description Hook soberano para la lógica del tablero Kanban.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Fetch Adicional para Nuevos Pedidos:** O evento de `INSERT` do Supabase Realtime não inclui dados de `JOIN` (como `profiles` ou `order_items`). Proponho que o callback `onNewOrder` dispare uma Server Action `getOrderDetails(orderId)` para obter os dados enriquecidos e garantir que o novo `OrderCard` seja renderizado com todas as informações.
 * - ((Vigente)) **Prevenção de "Flickering":** Se um usuário arrasta um cartão e outro usuário o atualiza simultaneamente, pode ocorrer um "flicker". Proponho implementar uma lógica que ignore o evento de `UPDATE` em tempo real para um pedido que está sendo ativamente arrastado pelo usuário local (`mutatingId`).
 */
// src/lib/hooks/useOrdersKanban.ts
