// src/graphql/resolvers/workspace.resolver.ts
/**
 * @file Implementa los resolvers para el dominio de Workspace.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato contiene la lógica de control que resuelve las queries
 *              y mutaciones para el dominio Workspace. Actúa como una capa delgada,
 *              invocando la capa de datos para queries y las Server Actions para mutaciones.
 */

import { GraphQLError } from 'graphql';
import { logger } from '@/lib/logger';
import { type GqlContext } from '@/graphql/context';
import { getWorkspacesForUser, getWorkspaceByIdForMember } from '@/lib/data/workspaces/dashboard.data';
import { createWorkspaceAction } from '@/lib/actions/workspaces/create.action';

export const workspaceResolvers = {
  Query: {
    /**
     * @description Obtiene los workspaces a los que pertenece el usuario autenticado.
     * @throws {GraphQLError} Si el usuario no está autenticado.
     */
    myWorkspaces: async (_: unknown, __: unknown, context: GqlContext) => {
      logger.trace('[GQL.Resolver] myWorkspaces: Iniciando obtención para usuario autenticado.');
      const { user } = context;

      if (!user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      return await getWorkspacesForUser(user.id);
    },

    /**
     * @description Obtiene un workspace por ID, si el usuario autenticado es miembro.
     * @throws {GraphQLError} Si el usuario no está autenticado, o si el workspace no se encuentra o el usuario no tiene acceso.
     */
    workspace: async (_: unknown, { id }: { id: string }, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] workspace: Iniciando obtención para ID: ${id}`);
      const { user } = context;

      if (!user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const workspace = await getWorkspaceByIdForMember(id, user.id);
      if (!workspace) {
        throw new GraphQLError('Workspace no encontrado o acceso denegado.', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return workspace;
    },
  },
  Mutation: {
    /**
     * @description Crea un nuevo workspace delegando la lógica a la Server Action correspondiente.
     * @throws {GraphQLError} Si la Server Action devuelve un error.
     */
    createWorkspace: async (_: unknown, { input }: { input: { name: string; icon?: string } }, context: GqlContext) => {
      logger.trace('[GQL.Resolver] createWorkspace: Delegando a createWorkspaceAction.');
      const { user } = context;

      if (!user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const result = await createWorkspaceAction(input);

      if (!result.success) {
        throw new GraphQLError(result.error, {
          extensions: { code: 'BAD_USER_INPUT', errorDetails: result.data },
        });
      }

      return result.data;
    },
  },
  Workspace: {
    /**
     * @description Resuelve el campo `owner` de un Workspace usando Dataloader para optimización.
     */
    owner: async (parent: { owner_id: string }, _: unknown, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] Workspace.owner: Resolviendo para workspace via Dataloader.`);
      return await context.loaders.userLoader.load(parent.owner_id);
    },
    // El resolver para 'members' se implementará cuando se cree la capa de datos correspondiente.
  },
};

/**
 * @module workspace-resolver
 * @description Módulo de resolvers GraphQL para la entidad Workspace.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Resolver para `members`:** Implementar a função de dados `getMembersForWorkspace` e o resolver `Workspace.members`. Este resolver deverá incluir paginação para lidar com workspaces com um grande número de membros.
 * - ((Vigente)) **Mutaciones de Actualización y Eliminación:** Criar as `Server Actions` e as mutações GraphQL correspondentes para `updateWorkspace` e `deleteWorkspace`, completando o ciclo CRUD para a entidade Workspace.
 */
// src/graphql/resolvers/workspace.resolver.ts
