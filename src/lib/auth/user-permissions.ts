// src/lib/auth/user-permissions.ts
'use server';
import 'server-only';

/**
 * @file Aparato soberano para la validación de permisos de usuario.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este módulo es la Única Fuente de Verdad para la lógica de autorización
 *              en el lado del servidor. Proporciona funciones de guardia (guards) reutilizables
 *              que validan si el usuario actual tiene los permisos necesarios para
 *              actuar sobre una entidad específica.
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { type Enums, type Tables } from '@/lib/types/database';
import { type User } from '@supabase/supabase-js';

type ActionResult<TSuccess, TError = string> = { success: true; data: TSuccess } | { success: false; error: TError };

type PermissionCheckResult<T> = ActionResult<{ user: User; entity: T }>;

/**
 * @public
 * @async
 * @function requireWorkspacePermission
 * @description Valida si el usuario actual tiene uno de los roles requeridos en un workspace.
 * @param {string} workspaceId - El ID del workspace a verificar.
 * @param {Enums<'workspace_role'>[]} requiredRoles - Un array de roles permitidos.
 * @returns {Promise<PermissionCheckResult<Tables<'workspaces'>>>} Un objeto con el resultado de la validación.
 */
export async function requireWorkspacePermission(
  workspaceId: string,
  requiredRoles: Enums<'workspace_role'>[],
): Promise<PermissionCheckResult<Tables<'workspaces'>>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn('[AuthGuard] Intento de acceso sin autenticación a workspace.', { workspaceId });
    return { success: false, error: 'unauthenticated' };
  }

  const { data: membership, error } = await supabase
    .from('workspace_members')
    .select('role, workspaces(*)')
    .eq('user_id', user.id)
    .eq('workspace_id', workspaceId)
    .single();

  if (error || !membership || !membership.workspaces) {
    logger.warn('[AuthGuard] Usuario no es miembro o workspace no existe.', {
      userId: user.id,
      workspaceId,
    });
    return { success: false, error: 'forbidden' };
  }

  if (!requiredRoles.includes(membership.role)) {
    logger.warn('[AuthGuard] Permiso denegado por rol insuficiente.', {
      userId: user.id,
      workspaceId,
      userRole: membership.role,
      requiredRoles,
    });
    return { success: false, error: 'forbidden' };
  }

  logger.trace('[AuthGuard] Permiso concedido para workspace.', { userId: user.id, workspaceId });
  return { success: true, data: { user, entity: membership.workspaces } };
}

/**
 * @public
 * @async
 * @function getActiveWorkspace
 * @description Obtiene el workspace activo del usuario (placeholder, asume el primero).
 * @returns {Promise<Tables<'workspaces'> | null>} El workspace activo.
 */
export async function getActiveWorkspace(): Promise<Tables<'workspaces'> | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspaces(*)')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  return membership?.workspaces ?? null;
}

/**
 * @module user-permissions
 * @description Capa de lógica de autorización de la aplicación.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Gestão de Workspace Ativo:** A função `getActiveWorkspace` é um placeholder. A implementação de élite seria armazenar o `active_workspace_id` nas `user_preferences` ou em um cookie seguro, e esta função leria esse valor para obter o workspace correto.
 * - ((Vigente)) **Cache de Permissões:** Para otimizar o desempenho, as permissões de um usuário para uma determinada requisição poderiam ser cacheadas (usando `React.cache`) para evitar consultas repetidas à base de dados dentro do mesmo ciclo de renderização.
 * - ((Vigente)) **Guardas de Permissão Adicionais:** Criar guardas mais granulares, como `requireProductPermission`, que validem a propriedade em cascata (usuário -> workspace -> site -> produto), para uma segurança de defesa em profundidade.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Dependência Crítica (TS2307):** A criação deste módulo e da função `requireWorkspacePermission` resolve a dependência faltante que impedia a compilação da `updateOrderStatusAction`.
 * - ((Implementada)) **Lógica de Autorização Centralizada (DRY):** Estabelece o padrão canônico para a verificação de permissões, eliminando a necessidade de duplicar esta lógica de segurança crítica em múltiplas Server Actions.
 */
// src/lib/auth/user-permissions.ts
