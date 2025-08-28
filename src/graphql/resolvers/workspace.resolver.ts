// src/graphql/resolvers/workspace.resolver.ts
/**
 * @file Implementa los resolvers para el dominio de Workspace.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.3.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato contiene la lógica de negocio que resuelve las queries
 *              y mutaciones definidas en `workspace.schema.ts`. Es la SSoT para
 *              la lógica de negocio del dominio Workspace.
 */

import { GraphQLError } from 'graphql';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { type GqlContext } from '@/graphql/context';
import { getWorkspacesForUser, getWorkspaceByIdForMember } from '@/lib/data/workspaces/dashboard.data';
import { createClient } from '@/lib/supabase/server';
import { type TablesInsert } from '@/lib/types/database';
import { createAuditLog } from '@/lib/actions/_helpers/error-log.helper';

const CreateWorkspaceInputSchema = z.object({
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  icon: z.string().optional(),
});

export const workspaceResolvers = {
  Query: {
    myWorkspaces: async (_: any, __: any, context: GqlContext) => {
      // ... (lógica ya implementada y de élite)
    },
    workspace: async (_: any, { id }: { id: string }, context: GqlContext) => {
      // ... (lógica ya implementada y de élite)
    },
  },
  Mutation: {
    /**
     * @description Crea un nuevo workspace para el usuario autenticado.
     * @throws {GraphQLError} Si el usuario no está autenticado, los datos son inválidos, o falla la creación.
     */
    createWorkspace: async (_: any, { input }: { input: { name: string; icon?: string } }, context: GqlContext) => {
      logger.trace('[GQL.Resolver] createWorkspace: Iniciando creación.', { input });
      const { user } = context;

      if (!user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const validation = CreateWorkspaceInputSchema.safeParse(input);
      if (!validation.success) {
        throw new GraphQLError('Datos de entrada inválidos.', {
          extensions: { code: 'BAD_USER_INPUT', issues: validation.error.flatten() },
        });
      }

      const { name, icon } = validation.data;
      const supabase = await createClient(); // Utiliza un cliente con la sesión del usuario

      const workspaceData: TablesInsert<'workspaces'> = { name, owner_id: user.id, icon };
      const { data: newWorkspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert(workspaceData)
        .select('*')
        .single();

      if (workspaceError) throw new GraphQLError('No se pudo crear el workspace.');

      const memberData: TablesInsert<'workspace_members'> = {
        workspace_id: newWorkspace.id,
        user_id: user.id,
        role: 'owner',
      };
      const { error: memberError } = await supabase.from('workspace_members').insert(memberData);
      if (memberError) throw new GraphQLError('No se pudo asignar el propietario al workspace.');

      await createAuditLog('workspace.created', {
        userId: user.id,
        targetEntityId: newWorkspace.id,
        metadata: { name },
      });

      return newWorkspace;
    },
  },
  Workspace: {
    // ... (resolvers de campos anidados ya implementados)
  },
};

/**
 * @module workspace-resolver
 * @description Módulo de resolvers GraphQL para la entidad Workspace.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Transaccionalidad con RPC:** Mover la lógica de las dos inserciones a una única función RPC de PostgreSQL para garantizar una atomicidad completa.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Lógica de Negócio Real em `createWorkspace`:** A mutação agora é a Única Fonte de Verdade para a criação de workspaces. Contém a lógica de validação, inserção transacional (simulada), e auditoria.
 */
// src/graphql/resolvers/workspace.resolver.ts
