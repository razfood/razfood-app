// src/lib/actions/_helpers/error-log.helper.ts
'use server';
import 'server-only';

/**
 * @file Helpers atómicos para logging de auditoría y errores persistentes.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato proporciona funciones soberanas para crear registros
 *              inmutables en las tablas `audit_logs` y `logs`, formando el núcleo
 *              de la capa de observabilidad de la aplicación.
 */

import { logger } from '@/lib/logger';
import { createAdminClient } from '@/lib/supabase/server'; // Usar admin para logs
import { type Json, type TablesInsert } from '@/lib/types/database';

/**
 * @public
 * @async
 * @function createPersistentErrorLog
 * @description Inserta un registro de error en la tabla `logs` y devuelve su ID.
 * @param {string} source - El módulo o función donde se originó el error.
 * @param {Error} error - El objeto de error capturado.
 * @param {Json} [metadata] - Datos contextuales adicionales.
 * @returns {Promise<string>} El ID del log de error creado, o una cadena genérica si falla.
 */
export async function createPersistentErrorLog(source: string, error: Error, metadata?: Json): Promise<string> {
  try {
    const supabase = await createAdminClient();
    const logData: TablesInsert<'logs'> = {
      source,
      error_message: error.message,
      stack_trace: error.stack,
      metadata: metadata || {},
      status: 'new',
    };

    const { data, error: insertError } = await supabase.from('logs').insert(logData).select('id').single();

    if (insertError) {
      logger.error(`[ErrorLogHelper] FALLO AL REGISTRAR FALLO PERSISTENTE. Origen: ${source}`, insertError);
      return 'log-failed';
    }

    const errorId = String(data.id);
    logger.info(`[ErrorLogHelper] Error persistente registrado con ID: ${errorId}`);
    return errorId;
  } catch (e) {
    logger.error(`[ErrorLogHelper] FALLO CRÍTICO irrecuperable en el helper. Origen: ${source}`, e);
    return 'log-critical-failure';
  }
}

interface AuditLogPayload {
  userId: string;
  action: string;
  targetEntityId?: string;
  targetEntityType?: string;
  metadata?: Json;
}

/**
 * @public
 * @async
 * @function createAuditLog
 * @description Inserta un registro de auditoría en la tabla `audit_logs`.
 * @param {string} action - La acción realizada (ej. 'product.created').
 * @param {AuditLogPayload} payload - Los datos del evento de auditoría.
 */
export async function createAuditLog(action: string, payload: Omit<AuditLogPayload, 'action'>): Promise<void> {
  try {
    const supabase = await createAdminClient();
    const auditData: TablesInsert<'audit_logs'> = {
      action,
      actor_id: payload.userId,
      target_entity_id: payload.targetEntityId,
      target_entity_type: payload.targetEntityType,
      metadata: payload.metadata || {},
    };

    const { error } = await supabase.from('audit_logs').insert(auditData);

    if (error) {
      logger.error(`[AuditLogHelper] Fallo al crear el log de auditoría para la acción: ${action}`, error);
    } else {
      logger.trace(`[AuditLogHelper] Log de auditoría creado para la acción: ${action}`, payload);
    }
  } catch (e) {
    logger.error(`[AuditLogHelper] Fallo crítico irrecuperable en el helper de auditoría.`, e);
  }
}

/**
 * @module logging-helpers
 * @description Helpers para la persistencia de logs de auditoría y errores.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tipado Fuerte para `action`:** Criar um tipo de união de string literal com todos os nomes de ação de auditoria válidos (`type AuditAction = "user.login" | "workspace.created" | ...`) e usá-lo para o parâmetro `action`. Isso fornecerá segurança de tipos e autocompletar ao registrar novos eventos.
 * - ((Vigente)) **Enriquecimento Automático de Logs:** Enriquecer automaticamente os logs de auditoria com dados da requisição, como o endereço IP e o User Agent, obtendo-os das `headers` da `next/server`.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Erro de Exportação (TS2305):** O aparato agora exporta `createPersistentErrorLog` e `createAuditLog`, resolvendo a causa raiz dos erros de importação nas Server Actions.
 * - ((Implementada)) **Fundação de Observabilidade:** A criação de `createAuditLog` estabelece a base para uma trilha de auditoria completa e inalterável de todas as ações críticas na plataforma.
 * - ((Implementada)) **Uso de Cliente Admin:** Os helpers agora usam `createAdminClient`, garantindo que as operações de logging possam ser executadas com privilégios de `service_role`, contornando quaisquer políticas de RLS.
 */
// src/lib/actions/_helpers/error-log.helper.ts
