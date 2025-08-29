// src/components/orders/OrdersKanbanView.tsx
'use client';

/**
 * @file Orquestador de UI para el tablero Kanban de pedidos en tiempo real.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es un componente de presentación 100% puro que consume
 *              el hook soberano `useOrdersKanban` para obtener toda su lógica y estado.
 *              Su única responsabilidad es ensamblar la UI del tablero Kanban, incluyendo
 *              el contexto de arrastrar y soltar.
 */

import React from 'react';
import { useTranslations } from 'next-intl';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import { useOrdersKanban } from '@/lib/hooks/useOrdersKanban';
import { type DashboardOrder } from '@/lib/data/orders/dashboard.data';
import { type Enums } from '@/lib/types/database';
import { clientLogger } from '@/lib/logger';
import { KanbanColumn } from './KanbanColumn';
import { DraggableOrderCard } from './DraggableOrderCard';

const KANBAN_COLUMNS: Enums<'order_status'>[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];

interface OrdersKanbanViewProps {
  initialOrders: DashboardOrder[];
  workspaceId: string;
}

/**
 * @public
 * @component OrdersKanbanView
 * @description Ensambla y renderiza el tablero Kanban interactivo para la gestión de pedidos.
 * @param {OrdersKanbanViewProps} props - Propiedades iniciales para el tablero.
 * @returns {React.ReactElement}
 */
export function OrdersKanbanView({ initialOrders, workspaceId }: OrdersKanbanViewProps): React.ReactElement {
  clientLogger.trace('[OrdersKanbanView] Renderizando orquestador de UI del tablero Kanban.');
  const sensors = useSensors(useSensor(PointerSensor));
  const { ordersByStatus, handleDragEnd } = useOrdersKanban({
    initialOrders,
    workspaceId,
  });

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex-1 flex gap-6 overflow-x-auto p-1 h-full">
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
 * - ((Vigente)) **Abstração de Componentes (Atomicidad Radical):** Extrair `KanbanColumn` e `DraggableOrderCard` para seus próprios arquivos de componentes atómicos (`src/components/orders/`). Isso melhorará drasticamente a organização do código, a testabilidade individual e o cumprimento estrito do SRP.
 * - ((Vigente)) **Feedback Visual de Arrastre (`DragOverlay`):** Melhorar a UX visualizando um "fantasma" do `OrderCard` enquanto ele está sendo arrastado, utilizando o componente `<DragOverlay>` do `dnd-kit`. Isso evita a refração do layout e proporciona uma experiência mais fluida.
 * - ((Vigente)) **Scroll Automático:** Implementar a funcionalidade de auto-scroll quando um cartão é arrastado para perto das bordas horizontais do contêiner, uma característica de UX de élite para quadros Kanban largos.
 */
// src/components/orders/OrdersKanbanView.tsx
