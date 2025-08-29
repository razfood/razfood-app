// src/lib/actions/sites/create.action.ts
'use server';
import 'server-only';

/**
 * @file Server Action atómica para la creación de nuevos sitios (menús).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta Server Action encapsula la lógica de negocio para crear un
 *              nuevo sitio (menú). Ahora utiliza Prisma para un acceso a datos tipo-seguro.
 */

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { createAuditLog, createPersistentErrorLog } from '@/lib/actions/_helpers/error-log.helper';
import { type ActionResult } from '@/lib/validators';
import { CreateSiteClientSchema } from '@/lib/validators/site.schemas';
import { requireWorkspacePermission } from '@/lib/auth/user-permissions';
import { createClient } from '@/lib/supabase/server'; // Aún necesario para obtener el usuario
import { slugify } from '@/lib/utils';

/**
 * @public
 * @async
 * @function createSiteAction
 * @description Crea un nuevo sitio (menú) dentro de un workspace.
 * @param {FormData} formData - Los datos del formulario.
 * @returns {Promise<ActionResult<import('@prisma/client').sites, { errorId: string }>>} El sitio creado o un error.
 */
export async function createSiteAction(
  formData: FormData,
): Promise<ActionResult<import('@prisma/client').sites, { errorId: string }>> {
  logger.trace('[Action:CreateSite] Inicio de la creación de sitio.');
  const supabase = await createClient(); // Aún se necesita para la sesión
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

    const newSite = await prisma.sites.create({
      data: {
        name: name || subdomain,
        subdomain,
        description,
        workspace_id: workspaceId,
        owner_id: user.id,
        status: 'draft',
      },
    });

    logger.info(`[Action:CreateSite] Sitio ${newSite.id} creado con éxito por usuario ${user.id}.`);

    await createAuditLog('site.created', {
      userId: user.id,
      targetEntityId: newSite.id,
      metadata: { name: newSite.name, workspaceId },
    });

    revalidatePath('/dashboard/sites');

    return { success: true, data: newSite };
  } catch (error) {
    let errorCode = 'error_unexpected';
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Violación de restricción única
        errorCode = 'error_subdomain_conflict';
        logger.warn(`[Action:CreateSite] Conflicto de subdominio: ${formData.get('subdomain')}`);
      }
    }

    const errorId = await createPersistentErrorLog('createSiteAction', error as Error, {
      formData: Object.fromEntries(formData),
    });
    logger.error(`[Action:CreateSite] Fallo inesperado. Error ID: ${errorId}`);
    return { success: false, error: errorCode, data: { errorId } };
  }
}

/**
 * @module create-site-action
 * @description Server Action para la creación de sitios (menús).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Transaccionalidad con `$transaction`:** Envolver a criação do site (`prisma.sites.create`) e a criação do log de auditoria (`createAuditLog`) dentro de um `prisma.$transaction([])`. Isso garantirá que a criação do site e o seu registro de auditoria sejam uma operação atómica: ou ambos têm sucesso, ou ambos falham.
 * - ((Vigente)) **Abstração da Sessão:** Criar um helper `getCurrentUser()` que encapsule a lógica de `createClient().auth.getUser()` para reduzir a duplicação e manter esta ação focada puramente na lógica de negócio do site.
 */
// src/lib/actions/sites/create.action.ts
