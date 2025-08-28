// src/lib/data/sites/dashboard.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos atómico para consultas de sitios (menús) en contextos autenticados.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta es la Única Fuente de Verdad para obtener datos de sitios (menús)
 *              en un contexto donde el usuario está autenticado y sus permisos
 *              ya han sido validados.
 */

import { cache } from 'react';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';

/**
 * @public
 * @async
 * @function getSitesForWorkspace
 * @description Obtiene todos los sitios (menús) pertenecientes a un workspace específico.
 */
export const getSitesForWorkspace = cache(async (workspaceId: string): Promise<Tables<'sites'>[]> => {
  logger.trace(`[Cache MISS] [Data:SitesDashboard] Obteniendo sitios para workspace: ${workspaceId}`);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(`[Data:SitesDashboard] Fallo al obtener sitios para el workspace ${workspaceId}`, error);
    return [];
  }
});

/**
 * @public
 * @async
 * @function getSiteByIdForMember
 * @description Obtiene un sitio por su ID, pero solo si el usuario especificado es miembro del workspace al que pertenece el sitio.
 * @param {string} siteId - El ID del sitio a obtener.
 * @param {string} userId - El ID del usuario que debe ser miembro.
 * @returns {Promise<Tables<'sites'> | null>} El sitio si se encuentra y el usuario tiene acceso, de lo contrario null.
 */
export const getSiteByIdForMember = cache(async (siteId: string, userId: string): Promise<Tables<'sites'> | null> => {
  logger.trace(`[Cache MISS] [Data:SitesDashboard] Obteniendo sitio ${siteId} para miembro ${userId}`);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sites')
      .select('*, workspace_members!inner(user_id)')
      .eq('id', siteId)
      .eq('workspace_members.user_id', userId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        throw error;
      }
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { workspace_members, ...siteData } = data;
    return siteData as Tables<'sites'>;
  } catch (error) {
    logger.error(`[Data:SitesDashboard] Fallo al obtener el sitio ${siteId} para el miembro ${userId}`, error);
    return null;
  }
});

/**
 * @module sites-dashboard-data
 * @description Capa de acceso a datos para sitios (menús) en contextos autenticados.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Paginação:** Para usuários que pertençam a um grande número de workspaces, será necessário adicionar paginação à consulta `getWorkspacesForUser`.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Consulta com Autorização Aninhada:** A nova função `getSiteByIdForMember` utiliza um `inner join` implícito do Supabase (`workspace_members!inner`) para combinar a obtenção de dados e a autorização em uma única e eficiente consulta. Se a membresia não existir, a consulta não retorna nada, garantindo a segurança por desenho.
 */
// src/lib/data/sites/dashboard.data.ts
