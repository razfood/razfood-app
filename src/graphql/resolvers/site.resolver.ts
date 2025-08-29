// src/graphql/resolvers/site.resolver.ts
/**
 * @file Implementa los resolvers para el dominio de Site (Menú).
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato contiene la lógica de control que resuelve las queries
 *              y mutaciones para el dominio Site. Actúa como una capa delgada,
 *              invocando la capa de datos para queries y las Server Actions para mutaciones.
 */

import { GraphQLError } from 'graphql';
import { logger } from '@/lib/logger';
import { type GqlContext } from '@/graphql/context';
import { requireWorkspacePermission } from '@/lib/auth/user-permissions';
import { getSitesForWorkspace, getSiteByIdForMember } from '@/lib/data/sites/dashboard.data';
import { createSiteAction } from '@/lib/actions/sites/create.action';
import { Tables } from '@/lib/types/database';

export const siteResolvers = {
  Query: {
    /**
     * @description Obtiene los menús para un workspace específico.
     * @throws {GraphQLError} Si el usuario no está autenticado o no tiene permisos.
     */
    sitesForWorkspace: async (_: unknown, { workspaceId }: { workspaceId: string }, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] sitesForWorkspace: Iniciando obtención para workspace ID: ${workspaceId}`);

      const permissionCheck = await requireWorkspacePermission(workspaceId, ['owner', 'admin', 'member']);
      if (!permissionCheck.success) {
        throw new GraphQLError('Acceso denegado al workspace.', { extensions: { code: 'FORBIDDEN' } });
      }

      return await getSitesForWorkspace(workspaceId);
    },

    /**
     * @description Obtiene un menú específico por su ID, si el usuario es miembro del workspace contenedor.
     * @throws {GraphQLError} Si el usuario no está autenticado, o si el sitio no se encuentra o el usuario no tiene acceso.
     */
    site: async (_: unknown, { id }: { id: string }, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] site: Iniciando obtención para ID: ${id}`);
      const { user } = context;

      if (!user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const site = await getSiteByIdForMember(id, user.id);

      if (!site) {
        throw new GraphQLError('Sitio no encontrado o acceso denegado.', { extensions: { code: 'NOT_FOUND' } });
      }

      return site;
    },
  },
  Mutation: {
    /**
     * @description Crea un nuevo menú delegando la lógica a la Server Action correspondiente.
     * @throws {GraphQLError} Si el usuario no está autenticado o si la creación falla.
     */
    createSite: async (
      _: unknown,
      {
        input,
      }: { input: { workspaceId: string; name: string; subdomain: string; description?: string; icon?: string } },
      context: GqlContext,
    ) => {
      logger.trace('[GQL.Resolver] createSite: Delegando a createSiteAction.');
      const { user } = context;

      if (!user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const formData = new FormData();
      formData.append('workspaceId', input.workspaceId);
      formData.append('name', input.name);
      formData.append('subdomain', input.subdomain);
      if (input.description) formData.append('description', input.description);
      if (input.icon) formData.append('icon', input.icon);

      const result = await createSiteAction(formData);

      if (!result.success) {
        throw new GraphQLError(result.error, {
          extensions: { code: 'BAD_USER_INPUT', errorDetails: result.data },
        });
      }

      return result.data;
    },
  },
  Site: {
    /**
     * @description Resuelve el campo `owner` de un Site usando Dataloader para optimización.
     */
    owner: async (parent: Tables<'sites'>, _: unknown, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] Site.owner: Resolviendo para site ${parent.id} via Dataloader.`);
      if (!parent.owner_id) return null;
      return await context.loaders.userLoader.load(parent.owner_id);
    },

    /**
     * @description Resuelve el campo `workspace` de un Site.
     */
    workspace: async (parent: Tables<'sites'>, _: unknown, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] Site.workspace: Resolviendo para site ${parent.id}.`);
      // Lógica de Placeholder para Dataloader:
      // return await context.loaders.workspaceLoader.load(parent.workspace_id);
      // Lógica temporal hasta que se implemente el Dataloader de workspace:
      const workspace = await getWorkspaceByIdForMember(parent.workspace_id, context.user!.id);
      if (!workspace) throw new GraphQLError('Workspace asociado no encontrado o acceso denegado.');
      return workspace;
    },
  },
};

/**
 * @module site-resolver
 * @description Módulo de resolvers GraphQL para la entidad Site.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Integração com Dataloader para `workspace`:** Criar a função de batch `getWorkspacesByIds` e o `workspaceLoader` correspondente para otimizar a resolução do campo `workspace`, eliminando a chamada direta à camada de dados aqui.
 * - ((Vigente)) **Mutaciones de Actualización y Publicación:** Criar as `Server Actions` e as mutações GraphQL correspondentes para `updateSite` e `publishSite`, completando o ciclo de vida da gestão de menús.
 */
// src/graphql/resolvers/site.resolver.ts
