// src/graphql/schemas/product.schema.ts
/**
 * @file Define la porción del esquema GraphQL para el dominio de Product (Ítem de Menú).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato define los tipos, queries y mutaciones relacionadas
 *              con los productos (ítems de menú).
 */

export const productTypeDefs = `#graphql
  # ENUM para el estado de un producto, reflejando el de la base de datos.
  enum ProductStatus {
    available
    unavailable
    sold_out
  }

  # El tipo principal para un Product (Ítem de Menú).
  type Product {
    id: ID!
    name: String!
    slug: String!
    description: String
    imageUrl: String
    price: Float! # Usar Float para valores monetarios en GraphQL
    status: ProductStatus!
    site: Site!
    createdBy: User
    createdAt: String! # ISO 8601
    updatedAt: String # ISO 8601
  }

  # Input para la creación de un nuevo producto.
  input CreateProductInput {
    siteId: ID!
    name: String!
    description: String
    price: Float!
    status: ProductStatus = available
  }

  # --- Queries ---
  extend type Query {
    productsForSite(siteId: ID!): [Product!]!
    product(id: ID!): Product
  }

  # --- Mutations ---
  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    # Futuras mutaciones como updateProduct, deleteProduct, etc. irán aquí.
  }
`;

/**
 * @module product-schema
 * @description Módulo de schema GraphQL para la entidad Product.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Paginação de Produtos:** A query `productsForSite` deve ser paginada para lidar eficientemente com menús que possuam um grande número de itens.
 * - ((Vigente)) **Campo de Relação com Modificadores:** Adicionar um campo `modifierGroups: [ModifierGroup!]!` ao tipo `Product` para buscar as opções de personalização associadas, criando uma API GraphQL verdadeiramente relacional e completa.
 * - ((Vigente)) **Mutação de Atualização Robusta:** Criar uma mutação `updateProduct(id: ID!, input: UpdateProductInput!)` com um `UpdateProductInput` onde todos os campos são opcionais, permitindo atualizações parciais.
 */
// src/graphql/schemas/product.schema.ts
