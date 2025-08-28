// src/lib/types/database/tables/order_items.ts
/**
 * @file Define el contrato de datos atómico para la tabla de unión `order_items`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla `order_items`,
 *              que modela la relación "muchos a muchos" entre pedidos y productos.
 */
export type OrderItems = {
  Row: {
    id: string;
    order_id: string;
    product_id: string | null;
    quantity: number;
    price_at_purchase: number;
    created_at: string;
  };
  Insert: {
    id?: string;
    order_id: string;
    product_id?: string | null;
    quantity: number;
    price_at_purchase: number;
    created_at?: string;
  };
  Update: {
    // Los ítems de un pedido son generalmente inmutables una vez creados.
    // Se podría permitir la actualización de la cantidad en ciertos estados del pedido.
    id?: string;
    quantity?: number;
  };
  Relationships: [
    {
      foreignKeyName: 'order_items_order_id_fkey';
      columns: ['order_id'];
      isOneToOne: false;
      referencedRelation: 'orders';
      referencedColumns: ['id'];
    },
    {
      foreignKeyName: 'order_items_product_id_fkey';
      columns: ['product_id'];
      isOneToOne: false;
      referencedRelation: 'products';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module order_items_type
 * @description Contrato de datos para la tabla de ítems de pedido.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Almacenamiento de Nombre y Modificadores:** Proponho implementar esta melhoria na próxima fase de refatoração do esquema SQL. Adicionar colunas `product_name_at_purchase: string` e `modifiers: JSONB` a este tipo e à tabela SQL. Isso tornará cada item do pedido autocontido e imutável, garantindo que os recibos históricos possam ser gerados com precisão, mesmo que o produto original seja alterado ou excluído.
 * - ((Vigente)) **Notas del Ítem:** Proponho adicionar uma coluna `notes: TEXT | null` para que os clientes possam adicionar instruções especiais para itens individuais (ex: "sem picles").
 */
// src/lib/types/database/tables/order_items.ts
