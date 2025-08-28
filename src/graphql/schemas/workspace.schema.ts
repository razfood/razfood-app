// src/graphql/schemas/workspace.schema.ts
/**
 * @file Define la porción del esquema GraphQL para el dominio de Workspace.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato define los tipos, queries y mutaciones relacionadas
 *              con los workspaces. Es el primer bloque de construcción de nuestro
 *              esquema GraphQL modular.
 */

export const workspaceTypeDefs = `#graphql
  # ENUMs reflejan los de la base de datos para consistencia.
  enum WorkspaceRole {
    owner
    admin
    member
  }

  # Representa un usuario simplificado, exponiendo solo datos públicos seguros.
  type User {
    id: ID!
    fullName: String
    avatarUrl: String
  }

  # Representa la membresía de un usuario en un workspace.
  type WorkspaceMember {
    user: User!
    role: WorkspaceRole!
    joinedAt: String! # ISO 8601
  }

  # El tipo principal para un Workspace (Restaurante).
  type Workspace {
    id: ID!
    name: String!
    icon: String
    owner: User!
    members: [WorkspaceMember!]!
    createdAt: String! # ISO 8601
  }

  # Input para la creación de un nuevo workspace.
  input CreateWorkspaceInput {
    name: String!
    icon: String
  }

  # --- Queries ---
  extend type Query {
    myWorkspaces: [Workspace!]!
    workspace(id: ID!): Workspace
  }

  # --- Mutations ---
  extend type Mutation {
    createWorkspace(input: CreateWorkspaceInput!): Workspace!
    # Futuras mutaciones como updateWorkspace, inviteMember, etc. irán aquí.
  }
`;

/**
 * @module workspace-schema
 * @description Módulo de schema GraphQL para la entidad Workspace.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Paginação de Membros:** Para workspaces com um grande número de membros, a query `members` no tipo `Workspace` deve ser paginada (ex: `members(limit: Int, offset: Int)`), seguindo as melhores práticas de design de API para evitar payloads excessivamente grandes.
 * - ((Vigente)) **Tipos de Input para Atualização:** Criar um `UpdateWorkspaceInput` que torne todos os campos opcionais, permitindo atualizações parciais através de uma mutação `updateWorkspace`.
 * - ((Vigente)) **Diretivas de Autorização:** Implementar diretivas de schema personalizadas (ex: `@hasRole(role: "owner")`) para definir os requisitos de permissão de forma declarativa diretamente no schema, tornando as regras de negócio mais claras e desacoplando a lógica de autorização dos resolvers.
 */
// src/graphql/schemas/workspace.schema.ts
