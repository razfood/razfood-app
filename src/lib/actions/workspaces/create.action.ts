// src/lib/actions/workspaces/create.action.ts
'use server';
import 'server-only';

/**
 * @file Server Action para la creación de nuevos workspaces.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta Server Action ha sido refactorizada a un estándar de élite.
 *              Ahora actúa como un cliente seguro para la API de GraphQL, delegando
 *              toda la lógica de negocio a la mutación `createWorkspace`. Cumple con
 *              la arquitectura "API como SSoT".
 */

import { z } from 'zod';
import { logger } from '@/lib/logger';
import { type ActionResult } from '@/lib/validators/common.schemas';
import { type Tables } from '@/lib/types/database';
import { executeGraphql } from '@/lib/graphql/server-client';

const CreateWorkspaceInputSchema = z.object({
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  icon: z.string().optional(),
});

type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceInputSchema>;

const CREATE_WORKSPACE_MUTATION = `
  mutation CreateWorkspace($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
      name
      icon
      createdAt
    }
  }
`;

/**
 * @public
 * @async
 * @function createWorkspaceAction
 * @description Crea un nuevo workspace invocando la mutación de GraphQL.
 * @param {CreateWorkspaceInput} input - Los datos para crear el workspace.
 * @returns {Promise<ActionResult<Tables<'workspaces'>, { errorId?: string }>>} El workspace creado o un error.
 */
export async function createWorkspaceAction(
  input: CreateWorkspaceInput,
): Promise<ActionResult<Tables<'workspaces'>, { errorId?: string }>> {
  logger.trace('[Action:CreateWorkspace] Invocando mutación GraphQL.');

  try {
    // La validación de Zod aquí es una primera línea de defensa,
    // aunque el resolver también validará.
    const validation = CreateWorkspaceInputSchema.safeParse(input);
    if (!validation.success) {
      logger.warn('[Action:CreateWorkspace] Validación de cliente fallida.', {
        errors: validation.error.flatten(),
      });
      return { success: false, error: 'error_invalid_data' };
    }

    const result = await executeGraphql<{ createWorkspace: Tables<'workspaces'> }>({
      query: CREATE_WORKSPACE_MUTATION,
      variables: { input: validation.data },
    });

    return { success: true, data: result.createWorkspace };
  } catch (error) {
    logger.error('[Action:CreateWorkspace] La mutación GraphQL falló.', { error });
    // En el futuro, podríamos mapear códigos de error de GraphQL a claves de i18n.
    return { success: false, error: (error as Error).message || 'error_unexpected' };
  }
}

/**
 * @module create-workspace-action
 * @description Server Action-cliente para la creación de workspaces.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Geração de Tipos com `graphql-codegen`:** A definição manual da query como string e do tipo de retorno `T` é sub-ótima. A implementação de `graphql-codegen` gerará funções e tipos seguros para esta mutação, eliminando a possibilidade de desincronização entre o cliente e o esquema da API.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Cliente de API (API as SSoT):** A Server Action foi refatorada para ser um cliente puro da nossa API de GraphQL, delegando toda a lógica de negócio e acesso a dados. Isto solidifica a nossa arquitetura de élite.
 * - ((Implementada)) **Desacoplamento e SRP:** A ação agora tem a única responsabilidade de expor uma operação de negócio ao cliente web de forma segura, sem se preocupar com os detalhes da sua implementação.
 */
// src/lib/actions/workspaces/create.action.ts
