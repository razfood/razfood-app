// src/lib/actions/sites/create.action.ts
'use server';
import 'server-only';

/**
 * @file Server Action atómica para la creación de nuevos sitios (menús).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta Server Action encapsula la lógica de negocio para crear un
 *              nuevo sitio (menú), incluyendo validación de permisos y de datos.
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { createAuditLog, createPersistentErrorLog } from '@/lib/actions/_helpers/error-log.helper';
import { type ActionResult } from '@/lib/validators/common.schemas';
import { type Tables, type TablesInsert } from '@/lib/types/database';
import { CreateSiteClientSchema } from '@/lib/validators/site.schemas';
import { requireWorkspacePermission } from '@/lib/auth/user-permissions';

/**
 * @public
 * @async
 * @function createSiteAction
 * @description Crea un nuevo sitio (menú) dentro de un workspace.
 * @param {FormData} formData - Los datos del formulario.
 * @returns {Promise<ActionResult<Tables<'sites'>, { errorId: string }>>} El sitio creado o un error.
 */
export async function createSiteAction(
  formData: FormData,
): Promise<ActionResult<Tables<'sites'>, { errorId: string }>> {
  logger.trace('[Action:CreateSite] Inicio de la creación de sitio.');
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    logger.warn('[Action:CreateSite] Intento de creación sin sesión.');
    return { success: false, error: 'error_unauthorized' };
  }

  try {
    const rawData = Object.fromEntries(formData);
    const validation = CreateSiteClientSchema.safeParse(rawData);
    if (!validation.success) {
      logger.warn('[Action:CreateSite] Validación de datos fallida.', {
        errors: validation.error.flatten(),
      });
      return { success: false, error: 'error_invalid_data' };
    }
    const { name, subdomain, description, workspaceId } = validation.data;

    const permissionCheck = await requireWorkspacePermission(workspaceId, ['owner', 'admin']);
    if (!permissionCheck.success) {
      return { success: false, error: 'error_permission_denied' };
    }

    const siteData: TablesInsert<'sites'> = {
      name: name || subdomain, // Usar subdominio como fallback para el nombre
      subdomain,
      description,
      workspace_id: workspaceId,
      owner_id: user.id,
      status: 'draft',
    };

    const { data: newSite, error: siteError } = await supabase.from('sites').insert(siteData).select('*').single();

    if (siteError) {
      if (siteError.code === '23505') {
        logger.warn(`[Action:CreateSite] Conflicto de subdominio: ${subdomain}`);
        return { success: false, error: 'error_subdomain_conflict' };
      }
      throw siteError;
    }

    logger.info(`[Action:CreateSite] Sitio ${newSite.id} creado con éxito por usuario ${user.id}.`);

    await createAuditLog('site.created', {
      userId: user.id,
      targetEntityId: newSite.id,
      metadata: { name: newSite.name, workspaceId },
    });

    revalidatePath('/dashboard/sites');

    return { success: true, data: newSite };
  } catch (error) {
    const errorId = await createPersistentErrorLog('createSiteAction', error as Error, {
      formData: Object.fromEntries(formData),
    });
    logger.error(`[Action:CreateSite] Fallo inesperado. Error ID: ${errorId}`);
    return { success: false, error: 'error_unexpected', data: { errorId } };
  }
}

/**
 * @module create-site-action
 * @description Server Action para la creación de sitios (menús).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Transaccionalidad con RPC:** A criação do site e do log de auditoria poderiam ser envolvidas em uma única função RPC para garantir a atomicidade completa da operação.
 * - ((Vigente)) **Validação de Subdomínios Reservados:** Implementar uma lógica para verificar uma lista de subdomínios reservados (ex: "admin", "api", "status") e impedir sua utilização.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Lógica de Negócio Centralizada:** Cria um endpoint de lógica de negócio soberano para a criação de sites.
 * - ((Implementada)) **Segurança e Validação de Élite:** A ação integra validação de sessão, validação de permissões baseada em roles, e validação de dados com Zod.
 * - ((Implementada)) **Manejo de Erros Específico:** A ação captura e maneja especificamente o erro de conflito de subdomínio, fornecendo um feedback de erro claro para a camada de UI ou API.
 */
// src/lib/actions/sites/create.action.ts
