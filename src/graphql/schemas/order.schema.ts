// src/graphql/schemas/order.schema.ts
/**
 * @file Define la porción del esquema GraphQL para el dominio de Order (Pedido).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato define los tipos, queries y mutaciones relacionadas
 *              con los pedidos, completando el modelado de los dominios de negocio
 *              centrales en nuestra API.
 */

export const orderTypeDefs = `#graphql
  # ENUM para el estado de un pedido, reflejando el de la base de datos.
  enum OrderStatus {
    pending
    confirmed
    preparing
    out_for_delivery
    delivered
    cancelled
  }

  # Representa una línea de ítem dentro de un pedido.
  type OrderItem {
    id: ID!
    product: Product # Puede ser nulo si el producto fue eliminado
    quantity: Int!
    priceAtPurchase: Float!
  }

  # El tipo principal para un Order (Pedido).
  type Order {
    id: ID!
    status: OrderStatus!
    subtotal: Float!
    tax: Float!
    total: Float!
    customer: User
    items: [OrderItem!]!
    workspace: Workspace!
    site: Site
    createdAt: String! # ISO 8601
    updatedAt: String # ISO 8601
  }

  # --- Queries ---
  extend type Query {
    ordersForWorkspace(workspaceId: ID!): [Order!]!
    order(id: ID!): Order
  }

  # --- Mutations ---
  # La creación de pedidos se maneja a través de una Server Action separada
  # debido a la complejidad de la integración con pagos.
  # Se añadirán mutaciones para la gestión de estados.
  extend type Mutation {
    updateOrderStatus(orderId: ID!, status: OrderStatus!): Order!
  }
`;

/**
 * @module order-schema
 * @description Módulo de schema GraphQL para la entidad Order.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Paginação de Pedidos:** A query `ordersForWorkspace` deve ser paginada para lidar eficientemente com workspaces que possuam um histórico de pedidos muito grande.
 * - ((Vigente)) **Input de `createOrder`:** Embora a criação principal seja via Server Action, poderia ser útil expor uma mutação `createOrder` na API de GraphQL para casos de uso internos ou de administração, utilizando um `CreateOrderInput` bem definido.
 * - ((Vigente)) **Filtros de Query Avançados:** Adicionar argumentos à query `ordersForWorkspace` para permitir a filtragem por status, intervalo de datas ou cliente, tornando a API mais poderosa para a construção de relatórios.
 */
// src/graphql/schemas/order.schema.ts
