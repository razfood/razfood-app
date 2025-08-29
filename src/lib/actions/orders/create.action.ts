// src/lib/actions/orders/create.action.ts
'use server';
import 'server-only';

/**
 * @file Server Action atómica y transaccional para la creación de nuevos pedidos.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta Server Action es el núcleo del flujo transaccional de Restoralia.
 *              Encapsula la lógica de negocio para crear un nuevo pedido, validando
 *              los datos, recalculando totales en el servidor para máxima seguridad,
 *              e insertando los registros correspondientes en las tablas `orders` y
 *              `order_items` de forma segura.
 */

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { createPersistentErrorLog, createAuditLog } from '@/lib/actions/_helpers/error-log.helper';
import { type ActionResult } from '@/lib/validators';
import { type TablesInsert } from '@/lib/types/database';
import type { CartItem } from '@/stores/useCartStore';

const CreateOrderClientSchema = z.object({
  cartItems: z.string().min(1, 'El carrito no puede estar vacío.'),
  siteId: z.string().uuid('ID de sitio inválido.'),
  workspaceId: z.string().uuid('ID de workspace inválido.'),
});

/**
 * @public
 * @async
 * @function createOrderAction
 * @description Crea un nuevo pedido con sus ítems correspondientes. Recalcula el total en el servidor.
 * @param {FormData} formData - Datos del formulario que deben cumplir con `CreateOrderClientSchema`.
 * @returns {Promise<ActionResult<{ orderId: string }, { errorId: string }>>} El resultado de la operación.
 */
export async function createOrderAction(
  formData: FormData,
): Promise<ActionResult<{ orderId: string }, { errorId: string }>> {
  logger.trace('[Action:CreateOrder] Inicio de la creación de pedido.');
  const supabase = await createClient();

  try {
    const rawData = Object.fromEntries(formData);
    const validation = CreateOrderClientSchema.safeParse(rawData);

    if (!validation.success) {
      logger.warn('[Action:CreateOrder] Validación de datos fallida.', { errors: validation.error.flatten() });
      return { success: false, error: 'error_invalid_data' };
    }

    const { siteId, workspaceId } = validation.data;
    const cartItems: CartItem[] = JSON.parse(validation.data.cartItems);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const productIds = cartItems.map((item) => item.id);
    const { data: productsFromDb, error: productsError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds);

    if (productsError) throw productsError;

    // Recalculo de seguridad en el servidor
    const serverCalculatedTotal = cartItems.reduce((total, cartItem) => {
      const dbProduct = productsFromDb.find((p) => p.id === cartItem.id);
      if (!dbProduct) throw new Error(`Producto con ID ${cartItem.id} no encontrado en la base de datos.`);
      // Utiliza el precio de la DB, no del cliente.
      return total + Number(dbProduct.price) * cartItem.quantity;
    }, 0);

    const orderData: TablesInsert<'orders'> = {
      workspace_id: workspaceId,
      site_id: siteId,
      customer_id: user?.id ?? null,
      total: serverCalculatedTotal,
      subtotal: serverCalculatedTotal, // Asume que no hay impuestos por ahora
      tax: 0,
      status: 'pending',
    };

    const { data: newOrder, error: orderError } = await supabase.from('orders').insert(orderData).select('id').single();

    if (orderError) throw orderError;

    const orderItemsData: TablesInsert<'order_items'>[] = cartItems.map((item) => {
      const dbProduct = productsFromDb.find((p) => p.id === item.id);
      return {
        order_id: newOrder.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: Number(dbProduct!.price), // Guarda el precio en el momento de la compra
      };
    });

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
    if (itemsError) throw itemsError;

    logger.info(`[Action:CreateOrder] Pedido ${newOrder.id} creado con éxito.`);

    await createAuditLog('order.created', {
      userId: user?.id || 'system-anonymous',
      targetEntityId: newOrder.id,
      metadata: { total: serverCalculatedTotal, items: cartItems.length, workspaceId },
    });

    return { success: true, data: { orderId: newOrder.id } };
  } catch (error) {
    const errorId = await createPersistentErrorLog('createOrderAction', error as Error, {
      formData: Object.fromEntries(formData),
    });
    logger.error(`[Action:CreateOrder] Fallo inesperado. Error ID: ${errorId}`);
    return { success: false, error: 'error_unexpected', data: { errorId } };
  }
}

/**
 * @module create-order-action
 * @description Server Action para la creación de pedidos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Transaccionalidad con RPC:** A lógica atual de múltiplas inserções sequenciais não é atômica. A melhoria de élite mais crítica é mover toda esta lógica para uma única função de banco de dados PostgreSQL (`CREATE OR REPLACE FUNCTION create_new_order...`) e invocar essa função via `.rpc()` do Supabase para garantir atomicidade.
 * - ((Vigente)) **Integración con Pagos (Stripe):** Antes de inserir na base de dados, esta ação deve criar um `PaymentIntent` com o provedor de pagamentos. O `client_secret` do `PaymentIntent` seria retornado ao cliente para que ele possa completar o pagamento no frontend.
 * - ((Vigente)) **Cálculo de Impostos:** Adicionar lógica para calcular impostos (`tax`) com base na localização do restaurante ou do cliente, e refletir isso no `total`.
 */
// src/lib/actions/orders/create.action.ts
