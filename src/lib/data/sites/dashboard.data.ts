// src/lib/data/sites/dashboard.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos atómico para consultas de sitios (menús) en contextos autenticados.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
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
 * @description Obtiene todos los sitios (menús) pertenecientes a un workspace específico, utilizando cacheo a nivel de request.
 * @param {string} workspaceId - El ID del workspace cuyos sitios se van a obtener.
 * @returns {Promise<Tables<'sites'>[]>} Una promesa que resuelve con un array de sitios.
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
 *              Esta es una consulta de seguridad por diseño.
 * @param {string} siteId - El ID del sitio a obtener.
 * @param {string} userId - El ID del usuario que debe ser miembro.
 * @returns {Promise<Tables<'sites'> | null>} El sitio si se encuentra y el usuario tiene acceso, de lo contrario null.
 */
export const getSiteByIdForMember = cache(async (siteId: string, userId: string): Promise<Tables<'sites'> | null> => {
  logger.trace(`[Cache MISS] [Data:SitesDashboard] Obteniendo sitio ${siteId} para miembro ${userId}`);
  try {
    const supabase = await createClient();
    // Esta consulta utiliza un JOIN implícito para validar la membresía.
    const { data, error } = await supabase
      .from('sites')
      .select('*, workspace_members!inner(user_id)')
      .eq('id', siteId)
      .eq('workspace_members.user_id', userId)
      .single();

    if (error) {
      // PGRST116: "exact one row expected, but 0 rows returned" es el resultado esperado si no hay acceso o el sitio no existe.
      // No se considera un error de aplicación, por lo que no se loguea como tal.
      if (error.code !== 'PGRST116') {
        throw error; // Lanza errores inesperados de la base de datos.
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
 * - ((Vigente)) **Paginação para `getSitesForWorkspace`:** Para workspaces com um grande número de menús, será crucial adicionar paginação (`.range()`) a esta consulta para evitar a sobrecarga do cliente e do servidor. A função aceitaria `page` e `limit` como parâmetros.
 * - ((Vigente)) **Função de Batch para Dataloader:** Criar uma função `getSitesByIds(ids: string[])` que obtenha múltiplos sites em uma única consulta, para ser consumida por um futuro `siteLoader` no contexto GraphQL e otimizar queries aninhadas.
 */
// src/lib/data/sites/dashboard.data.ts
