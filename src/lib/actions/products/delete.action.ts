// src/lib/actions/products/delete.action.ts
'use server';
import 'server-only';

/**
 * @file Server Action atómica para la eliminación de productos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta Server Action encapsula la lógica de negocio para eliminar un
 *              producto de forma permanente. Valida que el usuario tenga permisos
 *              suficientes (owner o admin) en el workspace correspondiente
 *              antes de ejecutar la operación destructiva.
 */

import { revalidatePath } from 'next/cache';

import { requireSitePermission } from '@/lib/auth/user-permissions';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { type ActionResult, DeleteProductClientSchema } from '@/lib/validators';
import { createAuditLog, createPersistentErrorLog } from '@/lib/actions/_helpers/error-log.helper';

/**
 * @public
 * @async
 * @function deleteProductAction
 * @description Elimina un producto de forma permanente.
 * @param {FormData} formData - Los datos del formulario que deben cumplir con `DeleteProductClientSchema`.
 * @returns {Promise<ActionResult<void, { errorId: string }>>} El resultado de la operación.
 */
export async function deleteProductAction(formData: FormData): Promise<ActionResult<void, { errorId: string }>> {
  logger.trace('[Action:DeleteProduct] Inicio de la eliminación de producto.');

  try {
    const rawData = Object.fromEntries(formData);
    const validation = DeleteProductClientSchema.safeParse(rawData);

    if (!validation.success) {
      logger.warn('[Action:DeleteProduct] Validación de datos fallida.', {
        errors: validation.error.flatten(),
      });
      return { success: false, error: 'error_invalid_data' };
    }

    const { productId } = validation.data;
    const supabase = await createClient(); // Correcto: await para obtener el cliente

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('site_id, name')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      logger.warn(`[Action:DeleteProduct] Producto no encontrado: ${productId}`);
      return { success: false, error: 'error_product_not_found' };
    }

    // Para una operación destructiva, requerimos un nivel de permiso más alto.
    const permissionCheck = await requireSitePermission(product.site_id, ['owner', 'admin']);
    if (!permissionCheck.success) {
      return { success: false, error: 'error_permission_denied' };
    }
    const { user } = permissionCheck.data;

    logger.trace(`[Action:DeleteProduct] Permisos validados para eliminar producto ${productId}.`, { userId: user.id });

    const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);

    if (deleteError) throw deleteError;

    logger.info(`[Action:DeleteProduct] Producto eliminado con éxito: ${productId}`);

    await createAuditLog('product.deleted', {
      userId: user.id,
      targetEntityId: productId,
      metadata: { productName: product.name, siteId: product.site_id },
    });

    revalidatePath(`/dashboard/sites/${product.site_id}/products`);

    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog('deleteProductAction', error as Error, {
      formData: Object.fromEntries(formData),
    });
    logger.error(`[Action:DeleteProduct] Fallo inesperado. Error ID: ${errorId}`);
    return { success: false, error: 'error_unexpected', data: { errorId } };
  }
}

/**
 * @module delete-product-action
 * @description Server Action para la eliminación de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Soft Deletes (Archivado):** Proponho implementar uma `archiveProductAction` que mude o `status` do produto para 'archived' em vez de uma exclusão permanente. A exclusão permanente (`hard delete`) poderia então ser uma ação separada, de maior privilégio, ou executada por um job de limpeza em itens arquivados há mais de 30 dias. Esta é uma prática de élite para a recuperação de dados.
 * - ((Vigente)) **Transacción RPC para Eliminación en Cascada:** Se um produto tivesse entidades dependentes (ex: `product_variants`), a lógica de eliminação deveria ser movida para uma função RPC de PostgreSQL para garantir que todas as entidades relacionadas sejam eliminadas numa única transação atómica.
 */
// src/lib/actions/products/delete.action.ts
