// src/components/orders/OrdersKanbanView.tsx
'use client';

/**
 * @file Orquestador de UI para el tablero Kanban de pedidos en tiempo real.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a un estándar de élite. Ahora es
 *              un componente de presentación 100% puro que consume el hook soberano
 *              `useOrdersKanban` para obtener toda su lógica y estado. Su única
 *              responsabilidad es ensamblar la UI del tablero Kanban.
 */

import React from 'react';
import { useTranslations } from 'next-intl';
import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import { type DashboardOrder } from '@/lib/data/orders/dashboard.data';
import { type Enums } from '@/lib/types/database';
import { OrderCard } from './OrderCard';
import { cn } from '@/lib/utils';
import { useOrdersKanban } from '@/lib/hooks/useOrdersKanban';

const KANBAN_COLUMNS: Enums<'order_status'>[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];

const DraggableOrderCard = ({ order }: { order: DashboardOrder }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
    data: { order },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={cn(isDragging && 'opacity-50')}>
      <OrderCard order={order} />
    </div>
  );
};

const KanbanColumn = ({
  status,
  orders,
  children,
}: {
  status: Enums<'order_status'>;
  orders: DashboardOrder[];
  children: React.ReactNode;
}) => {
  const t = useTranslations('OrdersDashboard');
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80">
      <div
        className={cn(
          'bg-card p-4 rounded-lg shadow-sm border h-full flex flex-col transition-colors duration-300',
          isOver ? 'border-primary ring-2 ring-primary/50' : '',
        )}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <span>{t(`statuses.${status}`)}</span>
          <span className="text-sm font-normal bg-muted text-muted-foreground rounded-full px-2 py-1">
            {orders.length}
          </span>
        </h2>
        <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-2">{children}</div>
      </div>
    </div>
  );
};

interface OrdersKanbanViewProps {
  initialOrders: DashboardOrder[];
  workspaceId: string;
}

export function OrdersKanbanView({ initialOrders, workspaceId }: OrdersKanbanViewProps): React.ReactElement {
  const sensors = useSensors(useSensor(PointerSensor));
  const { ordersByStatus, handleDragEnd } = useOrdersKanban({
    initialOrders,
    workspaceId,
  });

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex-1 flex gap-6 overflow-x-auto p-1">
        {KANBAN_COLUMNS.map((status) => (
          <KanbanColumn key={status} status={status} orders={ordersByStatus[status] || []}>
            {(ordersByStatus[status] || []).map((order) => (
              <DraggableOrderCard key={order.id} order={order} />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </DndContext>
  );
}

/**
 * @module OrdersKanbanView
 * @description Componente de cliente para el tablero de gestión de pedidos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Feedback Visual de Arrastre:** Melhorar a UX visualizando um "fantasma" (`DragOverlay` do dnd-kit) do `OrderCard` enquanto ele está sendo arrastado, em vez do elemento original.
 * - ((Vigente)) **Abstração de Componentes:** Extrair `KanbanColumn` e `DraggableOrderCard` para seus próprios arquivos de componentes atómicos para melhorar ainda mais a organização e o SRP.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Desacoplamento Completo (SRP):** Toda a lógica de estado, interações e efeitos em tempo real foi abstraída para o hook soberano `useOrdersKanban`. Este componente agora é um orquestador de UI 100% puro e declarativo.
 * - ((Implementada)) **Conexão com Tempo Real:** Ao consumir o `useOrdersKanban`, este componente agora é capaz de receber e renderizar atualizações em tempo real, completando a funcionalidade central do Dashboard de Operações.
 */
// src/components/orders/OrdersKanbanView.tsx
