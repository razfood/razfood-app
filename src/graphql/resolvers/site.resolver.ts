// src/graphql/resolvers/site.resolver.ts
/**
 * @file Implementa los resolvers para el dominio de Site (Menú).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.2.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato contiene la lógica de negocio que resuelve las queries
 *              y mutaciones definidas en `site.schema.ts`.
 */

import { GraphQLError } from 'graphql';
import { logger } from '@/lib/logger';
import { type GqlContext } from '@/graphql/context';
import { requireWorkspacePermission } from '@/lib/auth/user-permissions';
import { getSitesForWorkspace, getSiteByIdForMember } from '@/lib/data/sites/dashboard.data';
import { createSiteAction } from '@/lib/actions/sites/create.action';

export const siteResolvers = {
  Query: {
    /**
     * @description Obtiene los menús para un workspace específico.
     * @throws {GraphQLError} Si el usuario no está autenticado o no tiene permisos.
     */
    sitesForWorkspace: async (_: any, { workspaceId }: { workspaceId: string }, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] sitesForWorkspace: Iniciando obtención para workspace ID: ${workspaceId}`);
      const { user } = context;

      if (!user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

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
    site: async (_: any, { id }: { id: string }, context: GqlContext) => {
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
     * @description Crea un nuevo menú dentro de un workspace.
     * @throws {GraphQLError} Si el usuario no está autenticado o si la creación falla.
     */
    createSite: async (
      _: any,
      {
        input,
      }: { input: { workspaceId: string; name: string; subdomain: string; description?: string; icon?: string } },
      context: GqlContext,
    ) => {
      logger.trace('[GQL.Resolver] createSite: Iniciando creación.', { input });
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
    owner: async (parent: any, _: any, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] Site.owner: Resolviendo para site ${parent.id}`);
      return await context.loaders.userLoader.load(parent.owner_id);
    },
    workspace: async (parent: any, _: any, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] Site.workspace: Resolviendo para site ${parent.id}`);
      // Lógica de Placeholder para Dataloader:
      // return await context.loaders.workspaceLoader.load(parent.workspace_id);
      return { id: parent.workspace_id || 'ws_placeholder_1', name: 'Mi Restaurante Principal' };
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
 * - ((Vigente)) **Integração com Dataloader para `workspace`:** Criar a função de batch `getWorkspacesByIds` e o `workspaceLoader` correspondente para otimizar a resolução do campo `workspace`.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Lógica de Negócio Real em `createSite`:** A mutação agora é totalmente funcional, consumindo a `createSiteAction` soberana. Isso garante que a criação de menús seja segura, validada e auditada.
 * - ((Implementada)) **Reutilização de Lógica (DRY):** Ao invocar a Server Action, o resolver atua como uma camada de controle fina, mantendo a lógica de negócio principal centralizada e reutilizável.
 */
// src/graphql/resolvers/site.resolver.ts
