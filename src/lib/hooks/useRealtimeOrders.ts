// src/lib/hooks/useRealtimeOrders.ts
'use client';

/**
 * @file Hook soberano para suscribirse a cambios en tiempo real en la tabla de pedidos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato de lógica de cliente encapsula toda la complejidad de
 *              gestionar una suscripción en tiempo real con Supabase. Se suscribe a
 *              cambios en la tabla `orders` para un workspace específico y ejecuta
 *              callbacks cuando se detectan nuevos pedidos o actualizaciones.
 */

import { useEffect } from 'react';
import { type RealtimeChannel } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/client';
import { type Tables } from '@/lib/types/database';
import { clientLogger } from '@/lib/logger';

interface UseRealtimeOrdersProps {
  workspaceId: string;
  onNewOrder: (newOrder: Tables<'orders'>) => void;
  onUpdateOrder: (updatedOrder: Tables<'orders'>) => void;
}

/**
 * @public
 * @function useRealtimeOrders
 * @description Gestiona una suscripción en tiempo real a la tabla de pedidos.
 * @param {UseRealtimeOrdersProps} props - El ID del workspace y los callbacks para los eventos.
 */
export function useRealtimeOrders({ workspaceId, onNewOrder, onUpdateOrder }: UseRealtimeOrdersProps) {
  useEffect(() => {
    if (!workspaceId) return;

    const supabase = createClient();
    const channelName = `orders:workspace=${workspaceId}`;
    clientLogger.trace(`[useRealtimeOrders] Suscribiéndose al canal: ${channelName}`);

    const channel: RealtimeChannel = supabase
      .channel(channelName)
      .on<Tables<'orders'>>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          clientLogger.info('[useRealtimeOrders] Nuevo pedido recibido en tiempo real.', payload.new);
          onNewOrder(payload.new);
        },
      )
      .on<Tables<'orders'>>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          clientLogger.info('[useRealtimeOrders] Actualización de pedido recibida en tiempo real.', payload.new);
          onUpdateOrder(payload.new);
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          clientLogger.info(`[useRealtimeOrders] Conectado exitosamente al canal ${channelName}`);
        }
        if (status === 'CHANNEL_ERROR') {
          clientLogger.error(`[useRealtimeOrders] Error de conexión con el canal ${channelName}`);
        }
        if (status === 'TIMED_OUT') {
          clientLogger.warn(`[useRealtimeOrders] Se agotó el tiempo de espera para conectar al canal ${channelName}`);
        }
      });

    // Función de limpieza de élite para desuscribirse cuando el componente se desmonta.
    return () => {
      clientLogger.trace(`[useRealtimeOrders] Desuscribiéndose del canal: ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [workspaceId, onNewOrder, onUpdateOrder]);
}

/**
 * @module use-realtime-orders
 * @description Hook de lógica para la funcionalidad de pedidos en tiempo real.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Gestão de Reconexão Robusta:** A implementação atual depende da gestão de reconexão da SDK do Supabase. Proponho adicionar uma lógica de "heartbeat" personalizada ou um "health check" que monitore o status da conexão e exiba um indicador visual na UI (ex: um ícone de status de conexão no dashboard) se a conexão em tempo real for perdida.
 * - ((Vigente)) **Filtros de Canal Dinâmicos:** Se o dashboard permitir filtros (ex: por `site_id` dentro do workspace), o filtro de canal do Supabase (`filter: ...`) poderia ser atualizado dinamicamente para que o cliente receba apenas os eventos relevantes, otimizando o tráfego de rede.
 * - ((Vigente)) **Tipado de Payload de Evento:** O tipo `payload` do Supabase é um tanto genérico. Criar um tipo `OrderChangeEvent` mais estrito que valide a estrutura esperada do `payload.new` adicionaria uma camada extra de segurança de tipos.
 */
// src/lib/hooks/useRealtimeOrders.ts
