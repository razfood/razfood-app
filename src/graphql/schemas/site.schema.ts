// src/graphql/schemas/site.schema.ts
/**
 * @file Define la porción del esquema GraphQL para el dominio de Site (Menú).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato define los tipos, queries y mutaciones relacionadas
 *              con los menús (sites). Es el segundo módulo de dominio de nuestro
 *              esquema GraphQL.
 */

export const siteTypeDefs = `#graphql
  # ENUM para el estado de un menú, reflejando el de la base de datos.
  enum SiteStatus {
    draft
    published
    archived
  }

  # El tipo principal para un Site (Menú).
  type Site {
    id: ID!
    name: String!
    subdomain: String
    customDomain: String
    icon: String
    description: String
    status: SiteStatus!
    owner: User!
    workspace: Workspace!
    createdAt: String! # ISO 8601
    updatedAt: String # ISO 8601
  }

  # Input para la creación de un nuevo menú.
  input CreateSiteInput {
    workspaceId: ID!
    name: String!
    subdomain: String!
    description: String
    icon: String
  }

  # --- Queries ---
  extend type Query {
    sitesForWorkspace(workspaceId: ID!): [Site!]!
    site(id: ID!): Site
  }

  # --- Mutations ---
  extend type Mutation {
    createSite(input: CreateSiteInput!): Site!
    # Futuras mutaciones como updateSite, publishSite, etc. irán aquí.
  }
`;

/**
 * @module site-schema
 * @description Módulo de schema GraphQL para la entidad Site (Menú).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Paginação de Sites:** A query `sitesForWorkspace` deve ser paginada (`sitesForWorkspace(workspaceId: ID!, limit: Int, offset: Int)`) para lidar eficientemente com workspaces que possuam um grande número de menús.
 * - ((Vigente)) **Campo de Relação com Produtos:** Adicionar um campo `products: [Product!]!` ao tipo `Site`. Este campo será resolvido com paginação para buscar os itens do menu associados, criando uma API GraphQL verdadeiramente relacional.
 * - ((Vigente)) **Mutação de Publicação:** Criar uma mutação `publishSite(id: ID!)` separada que mude o `status` para `published`. Separar esta lógica da mutação de atualização (`updateSite`) permite um controle de permissões mais granular e uma intenção de negócio mais clara.
 */
// src/graphql/schemas/site.schema.ts
