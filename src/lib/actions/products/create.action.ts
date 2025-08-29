// src/lib/actions/products/create.action.ts
'use server';
import 'server-only';

/**
 * @file Server Action atómica para la creación de nuevos productos (ítems de menú).
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta Server Action encapsula la lógica de negocio para crear un nuevo producto.
 *              Valida los permisos del usuario, sanea y valida los datos de entrada,
 *              interactúa con la base de datos de forma segura, y gestiona los efectos
 *              secundarios como la auditoría y la revalidación de caché.
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { slugify } from '@/lib/utils';
import { createAuditLog, createPersistentErrorLog } from '@/lib/actions/_helpers/error-log.helper';
import { type ActionResult } from '@/lib/validators';
import { type TablesInsert } from '@/lib/types/database';
import { CreateProductClientSchema } from '@/lib/validators/product.schemas';
import { requireSitePermission } from '@/lib/auth/user-permissions';

/**
 * @public
 * @async
 * @function createProductAction
 * @description Crea un nuevo producto asociado a un sitio (menú).
 * @param {FormData} formData - Los datos del formulario que deben cumplir con `CreateProductClientSchema`.
 * @returns {Promise<ActionResult<{ id: string }, { errorId: string }>>} El resultado de la operación.
 */
export async function createProductAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }, { errorId: string }>> {
  logger.trace('[Action:CreateProduct] Inicio de la creación de producto.');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn('[Action:CreateProduct] Intento de creación sin sesión.');
    return { success: false, error: 'error_unauthorized' };
  }

  try {
    const rawData = Object.fromEntries(formData);
    const validation = CreateProductClientSchema.safeParse(rawData);

    if (!validation.success) {
      logger.warn('[Action:CreateProduct] Validación de datos fallida.', {
        errors: validation.error.flatten(),
      });
      return { success: false, error: 'error_invalid_data' };
    }

    const { name, price, description, siteId } = validation.data;

    const permissionCheck = await requireSitePermission(siteId, ['owner', 'admin', 'member']);
    if (!permissionCheck.success) {
      return { success: false, error: 'error_permission_denied' };
    }

    const slug = slugify(name);

    const productData: TablesInsert<'products'> = {
      name,
      price,
      description: description || null,
      site_id: siteId,
      created_by: user.id,
      slug,
    };

    const { data: newProduct, error } = await supabase.from('products').insert(productData).select('id').single();

    if (error) {
      if (error.code === '23505') {
        logger.warn('[Action:CreateProduct] Conflicto de slug.', { siteId, slug, userId: user.id });
        return { success: false, error: 'error_slug_conflict' };
      }
      throw error;
    }

    logger.info(`[Action:CreateProduct] Producto creado con éxito: ${newProduct.id}`);

    await createAuditLog('product.created', {
      userId: user.id,
      targetEntityId: newProduct.id,
      metadata: { name, siteId, workspaceId: permissionCheck.data.entity.workspace_id },
    });

    revalidatePath(`/dashboard/sites/${siteId}/products`);

    return { success: true, data: { id: newProduct.id } };
  } catch (error) {
    const errorId = await createPersistentErrorLog('createProductAction', error as Error, {
      formData: Object.fromEntries(formData),
    });
    logger.error(`[Action:CreateProduct] Fallo inesperado. Error ID: ${errorId}`);
    return { success: false, error: 'error_unexpected', data: { errorId } };
  }
}

/**
 * @module create-product-action
 * @description Server Action para la creación de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Slug Único Garantizado:** A geração atual de `slug` é básica. Uma melhoria de élite seria mover esta lógica para uma função RPC de PostgreSQL (`create_product_with_unique_slug`) que, em caso de colisão, adicione um sufixo numérico (ex: `hamburguesa-clasica-2`) de forma atómica.
 * - ((Vigente)) **Transaccionalidad con RPC:** Mover a lógica de inserção do produto e a criação do log de auditoria para uma única função RPC para garantir a atomicidade completa da operação.
 */
// src/lib/actions/products/create.action.ts
