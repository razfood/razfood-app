// src/lib/actions/orders/update-status.action.ts
'use server';
import 'server-only';

/**
 * @file Server Action atómica para actualizar el estado de un pedido.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta Server Action encapsula la lógica de negocio para modificar el
 *              estado de un pedido. Es una operación de seguridad crítica que valida
 *              que el usuario tenga permisos sobre el workspace del pedido antes de
 *              ejecutar la actualización.
 */

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { requireWorkspacePermission } from '@/lib/auth/user-permissions';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { type ActionResult } from '@/lib/validators';
import { createAuditLog, createPersistentErrorLog } from '@/lib/actions/_helpers/error-log.helper';
import { type Enums } from '@/lib/types/database';

const orderStatusEnumValues = z.enum([
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
]);

const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid('ID de pedido inválido.'),
  status: orderStatusEnumValues,
});

/**
 * @public
 * @async
 * @function updateOrderStatusAction
 * @description Actualiza el estado de un pedido existente.
 * @param {FormData} formData - Los datos que deben cumplir con `UpdateOrderStatusSchema`.
 * @returns {Promise<ActionResult<void, { errorId: string }>>} El resultado de la operación.
 */
export async function updateOrderStatusAction(formData: FormData): Promise<ActionResult<void, { errorId: string }>> {
  logger.trace('[Action:UpdateOrderStatus] Inicio de la actualización de estado de pedido.');

  try {
    const rawData = Object.fromEntries(formData);
    const validation = UpdateOrderStatusSchema.safeParse(rawData);

    if (!validation.success) {
      logger.warn('[Action:UpdateOrderStatus] Validación de datos fallida.', {
        errors: validation.error.flatten(),
      });
      return { success: false, error: 'error_invalid_data' };
    }

    const { orderId, status } = validation.data;
    const supabase = await createClient();

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('workspace_id, status')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      logger.warn(`[Action:UpdateOrderStatus] Pedido no encontrado: ${orderId}`);
      return { success: false, error: 'error_order_not_found' };
    }

    const permissionCheck = await requireWorkspacePermission(order.workspace_id, ['owner', 'admin', 'member']);
    if (!permissionCheck.success) {
      // El helper ya loguea la razón específica (unauthenticated, forbidden)
      return { success: false, error: 'error_permission_denied' };
    }
    const { user } = permissionCheck.data;

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (updateError) throw updateError;

    logger.info(
      `[Action:UpdateOrderStatus] Estado del pedido ${orderId} actualizado a '${status}' por usuario ${user.id}.`,
    );

    await createAuditLog('order.status.updated', {
      userId: user.id,
      targetEntityId: orderId,
      metadata: { from: order.status, to: status, workspaceId: order.workspace_id },
    });

    revalidatePath('/dashboard/orders', 'layout');

    return { success: true, data: undefined };
  } catch (error) {
    const errorId = await createPersistentErrorLog('updateOrderStatusAction', error as Error, {
      formData: Object.fromEntries(formData),
    });
    logger.error(`[Action:UpdateOrderStatus] Fallo inesperado. Error ID: ${errorId}`);
    return { success: false, error: 'error_unexpected', data: { errorId } };
  }
}

/**
 * @module update-order-status-action
 * @description Server Action para la actualización del estado de los pedidos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Máquina de Estados Finita (FSM):** A validação atual permite qualquer transição de estado (ex: de 'delivered' para 'pending'). A implementação de élite seria validar a transição de estado. Por exemplo, um pedido não pode passar de 'pending' para 'delivered' sem passar por 'preparing'. Isso deve ser implementado como uma função de validação antes da atualização.
 * - ((Vigente)) **Notificaciones en Tiempo Real:** Após a atualização do estado, esta ação deveria inserir um evento em uma tabela `notifications` que seria escutada pelo cliente (dashboard) via Supabase Realtime para notificar outros usuários da mudança, além da revalidação do path.
 * - ((Vigente)) **Transaccionalidad con RPC:** Mover a lógica de atualização e criação de log de auditoria para uma única função RPC de PostgreSQL para garantir a atomicidade completa da operação.
 */
// src/lib/actions/orders/update-status.action.ts
