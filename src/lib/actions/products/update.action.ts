// src/lib/actions/products/update.action.ts
'use server';
import 'server-only';

/**
 * @file Server Action atómica para la actualización de productos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta Server Action encapsula la lógica de negocio para modificar un
 *              producto existente. Valida los permisos del usuario sobre el sitio al que
 *              pertenece el producto, sanea y valida los datos de entrada, y maneja
 *              actualizaciones parciales de forma segura.
 */

import { revalidatePath } from 'next/cache';

import { requireSitePermission } from '@/lib/auth/user-permissions';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { type ActionResult, UpdateProductClientSchema } from '@/lib/validators';
import { createAuditLog, createPersistentErrorLog } from '@/lib/actions/_helpers/error-log.helper';

/**
 * @public
 * @async
 * @function updateProductAction
 * @description Actualiza los datos de un producto existente.
 * @param {FormData} formData - Los datos del formulario que deben cumplir con `UpdateProductClientSchema`.
 * @returns {Promise<ActionResult<void, { errorId: string }>>} El resultado de la operación.
 */
export async function updateProductAction(formData: FormData): Promise<ActionResult<void, { errorId: string }>> {
  logger.trace('[Action:UpdateProduct] Inicio de la actualización de producto.');

  try {
    const rawData = Object.fromEntries(formData);
    const validation = UpdateProductClientSchema.safeParse(rawData);

    if (!validation.success) {
      logger.warn('[Action:UpdateProduct] Validación de datos fallida.', {
        errors: validation.error.flatten(),
      });
      return { success: false, error: 'error_invalid_data' };
    }

    const { productId, ...updateData } = validation.data;
    const supabase = await createClient();

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('site_id')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      logger.warn(`[Action:UpdateProduct] Producto no encontrado: ${productId}`);
      return { success: false, error: 'error_product_not_found' };
    }

    const permissionCheck = await requireSitePermission(product.site_id, ['owner', 'admin', 'member']);
    if (!permissionCheck.success) {
      return { success: false, error: 'error_permission_denied' };
    }
    const { user } = permissionCheck.data;

    logger.trace(`[Action:UpdateProduct] Permisos validados para producto ${productId}.`, { userId: user.id });

    const { error: updateError } = await supabase
      .from('products')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (updateError) throw updateError;

    logger.info(`[Action:UpdateProduct] Producto actualizado con éxito: ${productId}`);

    await createAuditLog('product.updated', {
      userId: user.id,
      targetEntityId: productId,
      metadata: { changes: updateData, siteId: product.site_id },
    });

    revalidatePath(`/dashboard/sites/${product.site_id}/products`);

    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog('updateProductAction', error as Error, {
      formData: Object.fromEntries(formData),
    });
    logger.error(`[Action:UpdateProduct] Fallo inesperado. Error ID: ${errorId}`);
    return { success: false, error: 'error_unexpected', data: { errorId } };
  }
}

/**
 * @module update-product-action
 * @description Server Action para la actualización de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Manejo de Concurrencia (Optimistic Locking):** Proponho adicionar uma coluna `version` (ou usar `updated_at`) à tabela `products`. A Server Action receberia a versão que o cliente está editando. A cláusula `UPDATE` verificaria se a versão no banco de dados ainda é a mesma, prevenindo a sobrescrita de alterações concorrentes e lançando um erro `error_concurrency_conflict`.
 * - ((Vigente)) **Validación de Unicidad de Slug (si se edita el nombre):** Se o nome for alterado, o slug deveria ser regenerado. Uma lógica mais robusta garantiria que o novo slug não entre em conflito com outro produto no mesmo site, idealmente dentro de uma transação RPC para garantir atomicidade.
 * - ((Vigente)) **Auditoría Granular:** O log de auditoria atualmente armazena todo o objeto `updateData`. Uma melhoria de élite seria registrar apenas os campos que realmente mudaram, comparando o estado `before` e `after` da atualização para um log mais preciso e conciso.
 */
// src/lib/actions/products/update.action.ts
