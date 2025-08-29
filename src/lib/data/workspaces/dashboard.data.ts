// src/lib/data/workspaces/dashboard.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos para consultas de workspaces desde el dashboard/API.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta es la Única Fuente de Verdad para obtener datos de workspaces
 *              en un contexto donde el usuario está autenticado. Incluye lógica de
 *              permisos implícita al filtrar por el ID del usuario.
 */

import { cache } from 'react';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';

/**
 * @public
 * @async
 * @function getWorkspacesForUser
 * @description Obtiene todos los workspaces a los que pertenece un usuario específico.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<Tables<'workspaces'>[]>} Una promesa que resuelve con un array de workspaces.
 */
export const getWorkspacesForUser = cache(async (userId: string): Promise<Tables<'workspaces'>[]> => {
  logger.trace(`[Cache MISS] [Data:WorkspacesDashboard] Obteniendo workspaces para usuario: ${userId}`);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('workspace_members').select('workspaces(*)').eq('user_id', userId);

    if (error) {
      throw error;
    }

    // El resultado es un array de { workspaces: ... | null }, por lo que necesitamos mapearlo y filtrarlo.
    return data.map((item) => item.workspaces).filter(Boolean) as Tables<'workspaces'>[];
  } catch (error) {
    logger.error(`[Data:WorkspacesDashboard] Fallo al obtener workspaces para el usuario ${userId}`, error);
    return [];
  }
});

/**
 * @public
 * @async
 * @function getWorkspaceByIdForMember
 * @description Obtiene un workspace por su ID, solo si el usuario especificado es miembro.
 * @param {string} workspaceId - El ID del workspace a obtener.
 * @param {string} userId - El ID del usuario que debe ser miembro.
 * @returns {Promise<Tables<'workspaces'> | null>} El workspace si se encuentra y el usuario tiene acceso, de lo contrario null.
 */
export const getWorkspaceByIdForMember = cache(
  async (workspaceId: string, userId: string): Promise<Tables<'workspaces'> | null> => {
    logger.trace(`[Cache MISS] [Data:WorkspacesDashboard] Obteniendo workspace ${workspaceId} para miembro ${userId}`);
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('workspaces')
        .select('*, workspace_members!inner(user_id)')
        .eq('id', workspaceId)
        .eq('workspace_members.user_id', userId)
        .single();

      if (error) {
        // PGRST116: "exact one row expected, but 0 rows returned" -> Resultado esperado si no hay acceso o no existe.
        if (error.code !== 'PGRST116') {
          throw error;
        }
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { workspace_members, ...workspaceData } = data;
      return workspaceData as Tables<'workspaces'>;
    } catch (error) {
      logger.error(
        `[Data:WorkspacesDashboard] Fallo al obtener workspace ${workspaceId} para miembro ${userId}`,
        error,
      );
      return null;
    }
  },
);

/**
 * @module workspaces-dashboard-data
 * @description Capa de acceso a datos para workspaces en contextos autenticados.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Paginação para `getWorkspacesForUser`:** Para usuários que pertençam a um grande número de workspaces, será necessário adicionar paginação a esta consulta para evitar a sobrecarga do cliente.
 * - ((Vigente)) **Função de Batch para Dataloader:** Criar uma função `getWorkspacesByIds(ids: string[])` que obtenha múltiplos workspaces em uma única consulta, para ser consumida por um futuro `workspaceLoader` no contexto GraphQL.
 */
// src/lib/data/workspaces/dashboard.data.ts
