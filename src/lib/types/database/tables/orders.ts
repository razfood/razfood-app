// src/lib/types/database/tables/orders.ts
/**
 * @file Define el contrato de datos atómico para la tabla `orders`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla `orders`.
 *              Cada registro representa un pedido completo realizado por un cliente.
 */
import { type Json } from '../_shared';
import { type Enums } from '../enums';

export type Orders = {
  Row: {
    id: string;
    site_id: string | null;
    workspace_id: string;
    customer_id: string | null;
    status: Enums['order_status'];
    subtotal: number;
    tax: number;
    total: number;
    delivery_address: Json | null;
    payment_intent_id: string | null;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    site_id?: string | null;
    workspace_id: string;
    customer_id?: string | null;
    status?: Enums['order_status'];
    subtotal: number;
    tax: number;
    total: number;
    delivery_address?: Json | null;
    payment_intent_id?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    status?: Enums['order_status'];
    delivery_address?: Json | null;
    payment_intent_id?: string | null;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: 'orders_customer_id_fkey';
      columns: ['customer_id'];
      isOneToOne: false;
      referencedRelation: 'profiles';
      referencedColumns: ['id'];
    },
    {
      foreignKeyName: 'orders_site_id_fkey';
      columns: ['site_id'];
      isOneToOne: false;
      referencedRelation: 'sites';
      referencedColumns: ['id'];
    },
    {
      foreignKeyName: 'orders_workspace_id_fkey';
      columns: ['workspace_id'];
      isOneToOne: false;
      referencedRelation: 'workspaces';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module orders_type
 * @description Contrato de datos para la tabla de pedidos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tipado Fuerte para `delivery_address`:** Proponho implementar esta melhoria na próxima fase de refatoração de tipos. Criar um `DeliveryAddressSchema` em Zod e usar `z.infer` para substituir o tipo `Json` genérico. Isso garantirá que o endereço de entrega sempre tenha uma estrutura consistente (rua, cidade, código postal, etc.).
 * - ((Vigente)) **Campo de Tipo de Pedido:** Proponho adicionar uma coluna `order_type: ENUM('delivery', 'pickup', 'dine_in')`. Isso permitirá à plataforma diferenciar os tipos de pedido, uma funcionalidade essencial para a lógica de operações do restaurante.
 */
// src/lib/types/database/tables/orders.ts
