// src/lib/types/database/tables/products.ts
/**
 * @file Define el contrato de datos atómico para la tabla `products`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla `products`.
 *              En el dominio de Restoralia, un "product" representa un ítem individual
 *              del menú (ej. un plato, una bebida) que pertenece a un menú (`site`).
 */
import { type Enums } from '../enums';

export type Products = {
  Row: {
    id: string;
    site_id: string;
    created_by: string | null;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    price: number; // NUMERIC se mapea a number en TypeScript
    status: Enums['product_status'];
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    site_id: string;
    created_by?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    image_url?: string | null;
    price: number;
    status?: Enums['product_status'];
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string | null;
    image_url?: string | null;
    price?: number;
    status?: Enums['product_status'];
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: 'products_created_by_fkey';
      columns: ['created_by'];
      isOneToOne: false;
      referencedRelation: 'profiles';
      referencedColumns: ['id'];
    },
    {
      foreignKeyName: 'products_site_id_fkey';
      columns: ['site_id'];
      isOneToOne: false;
      referencedRelation: 'sites';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module products_type
 * @description Contrato de datos para la tabla de productos (ítems del menú).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tabla de Categorías (`categories`):** Proponho implementar esta melhoria na próxima fase de refatoração do esquema SQL. Criar uma tabela `categories` e uma tabela de união `product_categories` para permitir que um produto pertença a múltiplas categorias (ex. "Vegano", "Pratos Principais"). O tipo `Products` seria então atualizado para refletir essa relação.
 * - ((Vigente)) **Campo de Custo:** Proponho adicionar uma coluna `cost: number` a este tipo e à tabela SQL para armazenar o custo do produto. Isso permitirá à plataforma calcular margens de lucro e realizar análises de engenharia de cardápio avançadas, uma característica de grande valor para os donos de restaurantes.
 */
// src/lib/types/database/tables/products.ts
