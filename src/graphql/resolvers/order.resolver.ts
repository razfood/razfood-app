// src/graphql/resolvers/order.resolver.ts
/**
 * @file Implementa los resolvers para el dominio de Order (Pedido).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato contiene la lógica de negocio que resuelve las queries
 *              y mutaciones definidas en `order.schema.ts`.
 */

import { GraphQLError } from 'graphql';
import { logger } from '@/lib/logger';
import { type GqlContext } from '@/graphql/context';
import { requireWorkspacePermission } from '@/lib/auth/user-permissions';
import { getActiveOrdersByWorkspaceId } from '@/lib/data/orders/dashboard.data';
import { updateOrderStatusAction } from '@/lib/actions/orders/update-status.action';
import { type Enums, type Tables } from '@/lib/types/database';

export const orderResolvers = {
  Query: {
    /**
     * @description Obtiene los pedidos para un workspace específico.
     * @throws {GraphQLError} Si el usuario no está autenticado o no tiene permisos.
     */
    ordersForWorkspace: async (_: unknown, { workspaceId }: { workspaceId: string }, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] ordersForWorkspace: Iniciando obtención para workspace ID: ${workspaceId}`);

      const permissionCheck = await requireWorkspacePermission(workspaceId, ['owner', 'admin', 'member']);
      if (!permissionCheck.success) {
        throw new GraphQLError('Acceso denegado al workspace.', { extensions: { code: 'FORBIDDEN' } });
      }

      return await getActiveOrdersByWorkspaceId(workspaceId);
    },
  },
  Mutation: {
    /**
     * @description Actualiza el estado de un pedido, delegando a la Server Action.
     * @throws {GraphQLError} Si la acción falla o el usuario no está autenticado.
     */
    updateOrderStatus: async (
      _: unknown,
      { orderId, status }: { orderId: string; status: Enums<'order_status'> },
      context: GqlContext,
    ) => {
      logger.trace(`[GQL.Resolver] updateOrderStatus: Delegando a action para ID ${orderId}.`, { status });
      if (!context.user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('status', status);

      const result = await updateOrderStatusAction(formData);
      if (!result.success) {
        throw new GraphQLError(result.error, { extensions: { code: 'ACTION_FAILED', errorId: result.data?.errorId } });
      }

      // TODO: Se debe obtener y devolver el pedido actualizado desde la capa de datos.
      return { id: orderId, status, total: 0, subtotal: 0, tax: 0, created_at: new Date().toISOString() };
    },
  },
  Order: {
    /**
     * @description Resuelve el campo `customer` de un Pedido usando Dataloader.
     */
    customer: async (parent: Tables<'orders'>, _: unknown, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] Order.customer: Resolviendo para pedido ${parent.id} via Dataloader.`);
      if (!parent.customer_id) return null;
      return await context.loaders.userLoader.load(parent.customer_id);
    },
  },
};

/**
 * @module order-resolver
 * @description Módulo de resolvers GraphQL para la entidad Order.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Query `order(id)`:** Implementar a função de dados `getOrderById` (com validação de permissão) e o resolver correspondente para obter um único pedido.
 * - ((Vigente)) **Abstração de Permissões:** Criar uma função de guarda de permissão `requireOrderPermission` que encapsule a lógica complexa de verificar se o usuário é o cliente OU um membro do workspace do pedido.
 * - ((Vigente)) **Retorno de Mutação Completo:** A mutação `updateOrderStatus` atualmente retorna dados de placeholder. Ela deve ser refatorada para fazer uma chamada `getOrderById` após a atualização para retornar o objeto de pedido completo e atualizado.
 */
// src/graphql/resolvers/order.resolver.ts
