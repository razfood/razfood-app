// src/lib/data/orders/dashboard.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos atómico para el dashboard de operaciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
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
 * - ((Vigente)) **Paginação:** Para workspaces com um alto volume de pedidos, será crucial implementar a paginação (`.range()`) nesta consulta para evitar a sobrecarga do servidor e do cliente.
 * - ((Vigente)) **Filtros por Período de Tempo:** Adicionar parâmetros opcionais `startDate` e `endDate` para permitir que o dashboard filtre pedidos dentro de um intervalo de datas específico.
 * - ((Vigente)) **Seleção de Colunas Granular:** O `select('*')` é conveniente, mas para otimização máxima, a consulta deve ser refinada para selecionar apenas as colunas estritamente necessárias, reduzindo o tamanho do payload.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Consulta Enriquecida de Élite:** A consulta agora realiza um `JOIN` aninhado para obter os dados completos dos produtos dentro dos `order_items`, eliminando a necessidade de futuras consultas N+1 e fornecendo todos os dados necessários para o `OrderCard` em uma única chamada eficiente.
 * - ((Implementada)) **Tipo de Dados Robusto:** O tipo `DashboardOrder` foi atualizado para refletir com precisão a nova estrutura de dados aninhada, garantindo a segurança de tipos de ponta a ponta.
 */
// src/lib/data/orders/dashboard.data.ts
