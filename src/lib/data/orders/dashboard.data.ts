// src/lib/data/orders/dashboard.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos atómico para el dashboard de operaciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta es la Única Fuente de Verdad para obtener los datos necesarios
 *              para el dashboard de operaciones en tiempo real. Utiliza consultas
 *              optimizadas y cacheo para un rendimiento de élite.
 */

import { cache } from 'react';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';

/**
 * @public
 * @typedef DashboardOrder
 * @description Tipo de datos enriquecido que representa un pedido en el dashboard,
 *              incluyendo sus ítems con los datos completos del producto y el perfil del cliente.
 *              Esta estructura está optimizada para evitar consultas N+1 en la UI.
 */
export type DashboardOrder = Tables<'orders'> & {
  order_items: (Tables<'order_items'> & {
    products: Tables<'products'> | null;
  })[];
  profiles: Pick<Tables<'profiles'>, 'full_name'> | null;
};

/**
 * @public
 * @async
 * @function getActiveOrdersByWorkspaceId
 * @description Obtiene todos los pedidos activos para un workspace, incluyendo datos anidados.
 *              Un pedido se considera "activo" si no está 'delivered' o 'cancelled'.
 * @param {string} workspaceId - El ID del workspace.
 * @returns {Promise<DashboardOrder[]>} Una promesa que resuelve con un array de pedidos para el dashboard.
 */
export const getActiveOrdersByWorkspaceId = cache(async (workspaceId: string): Promise<DashboardOrder[]> => {
  logger.trace(`[Cache MISS] [Data:OrdersDashboard] Obteniendo pedidos para workspace: ${workspaceId}`);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          *,
          products (*)
        ),
        profiles (full_name)
      `,
      )
      .eq('workspace_id', workspaceId)
      .not('status', 'in', '("delivered", "cancelled")')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data as DashboardOrder[]) || [];
  } catch (error) {
    logger.error(`[Data:OrdersDashboard] Fallo al obtener pedidos para workspace ${workspaceId}`, error);
    return [];
  }
});

/**
 * @module orders-dashboard-data
 * @description Capa de acceso a datos para el dashboard de pedidos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Paginação:** Para workspaces com um alto volume de pedidos ativos, será crucial implementar a paginação (`.range()`) nesta consulta para evitar a sobrecarga do servidor e do cliente, especialmente em dispositivos móveis.
 * - ((Vigente)) **Filtros por Período de Tempo:** Adicionar parâmetros opcionais `startDate` e `endDate` para permitir que o dashboard filtre pedidos dentro de um intervalo de datas específico, útil para análises de picos de operação.
 * - ((Vigente)) **Seleção de Colunas Granular:** O `select('*')` é conveniente, mas para otimização máxima, a consulta deve ser refinada para selecionar apenas as colunas estritamente necessárias para o `OrderCard`, reduzindo o tamanho do payload.
 */
// src/lib/data/orders/dashboard.data.ts
