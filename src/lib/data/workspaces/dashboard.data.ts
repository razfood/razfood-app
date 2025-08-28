// src/lib/data/workspaces/dashboard.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos para consultas de workspaces desde el dashboard/API.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
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

    // El resultado es un array de { workspaces: ... }, por lo que necesitamos mapearlo.
    return data.map((item) => item.workspaces).filter(Boolean) as Tables<'workspaces'>[];
  } catch (error) {
    logger.error(`[Data:WorkspacesDashboard] Fallo al obtener workspaces para el usuario ${userId}`, error);
    return [];
  }
});

/**
 * @module workspaces-dashboard-data
 * @description Capa de acceso a datos para workspaces en contextos autenticados.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Paginação:** Para usuários que pertençam a um grande número de workspaces, será necessário adicionar paginação a esta consulta.
 * - ((Vigente)) **Obtenção por ID com Verificação de Membro:** Criar uma função `getWorkspaceByIdForMember(workspaceId, userId)` que obtenha um único workspace apenas se o usuário for membro, para ser usada pelo resolver `workspace(id)`.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Lógica de Dados para API:** Cria a primeira peça de lógica de dados real necessária para que o resolver `myWorkspaces` da API de GraphQL funcione.
 */
// src/lib/data/workspaces/dashboard.data.ts
