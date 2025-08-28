// src/lib/actions/orders/update-status.action.ts
'use server';
import 'server-only';

/**
 * @file Server Action atómica para actualizar el estado de un pedido.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
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
import { type ActionResult } from '@/lib/validators/common.schemas';
import { createAuditLog, createPersistentErrorLog } from '@/lib/actions/_helpers/error-log.helper';
import { order_status } from '@/lib/types/database/enums';

const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid('ID de pedido inválido.'),
  status: z.enum(order_status, { invalid_type_error: 'Estado de pedido inválido.' }),
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
      return { success: false, error: 'error_order_not_found' };
    }

    const permissionCheck = await requireWorkspacePermission(order.workspace_id, ['owner', 'admin', 'member']);
    if (!permissionCheck.success) {
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
 * - ((Vigente)) **Máquina de Estados Finita (FSM):** A validação atual permite qualquer transição de estado. A implementação de élite seria validar a transição de estado. Por exemplo, um pedido não pode passar de 'pending' para 'delivered' sem passar por 'preparing'.
 * - ((Vigente)) **Notificaciones en Tiempo Real:** Após a atualização do estado, esta ação deveria inserir um evento em uma tabela `notifications`. O cliente (dashboard) estaria escutando essa tabela via Supabase Realtime para notificar outros usuários.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Erros de Compilação:** Corrigidas todas as importações (`TS2307`, `TS2305`), tornando a ação compilável e funcional.
 * - ((Implementada)) **Validação de Schema de Élite:** O schema de Zod agora consome diretamente o ENUM `order_status` do nosso tipo de base de dados, garantindo que apenas estados válidos possam ser processados e eliminando a duplicação de constantes.
 * - ((Implementada)) **Lógica de Autorização Robusta:** A ação agora utiliza o helper `requireWorkspacePermission`, garantindo que a lógica de segurança seja centralizada e consistente.
 */
// src/lib/actions/orders/update-status.action.ts
