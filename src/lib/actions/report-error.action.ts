// src/lib/actions/report-error.action.ts
/**
 * @file Registra un error crítico y persistente en la base de datos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta Server Action es la Única Fuente de Verdad para la persistencia de errores. Es invocada por los manejadores de errores en el backend para crear un registro auditable de fallos del sistema.
 */
'use server';
import 'server-only';

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { type Json, type TablesInsert } from '@/lib/types/database'; // Estos tipos serán definidos más adelante

/**
 * @public
 * @async
 * @function reportErrorToDb
 * @description Inserta un registro de error en la tabla `logs` y devuelve su ID para trazabilidad.
 * @param {string} source - El módulo o función donde se originó el error.
 * @param {Error} error - El objeto de error capturado.
 * @param {Json} [metadata] - Datos contextuales adicionales sobre el error.
 * @returns {Promise<string>} El ID del log de error creado, o una cadena genérica si el registro falla.
 */
export async function reportErrorToDb(source: string, error: Error, metadata?: Json): Promise<string> {
  try {
    const supabase = createClient();
    // NOTA: La tabla 'logs' y el tipo 'TablesInsert<"logs">' deben existir en el esquema de la base de datos para que esto funcione.
    const logData: any = {
      // Usamos 'any' temporalmente hasta que los tipos de DB estén definidos
      source,
      error_message: error.message,
      stack_trace: error.stack,
      metadata: metadata || {},
      status: 'new',
    };

    const { data, error: insertError } = await supabase.from('logs').insert(logData).select('id').single();

    if (insertError) {
      logger.error(`[reportErrorToDb] FALLO AL REGISTRAR FALLO PERSISTENTE. Origen: ${source}`, insertError);
      return 'db-log-failed';
    }

    const errorId = String(data.id);
    logger.info(`[reportErrorToDb] Error persistente registrado con ID: ${errorId}`);
    return errorId;
  } catch (e) {
    logger.error(`[reportErrorToDb] FALLO CRÍTICO irrecuperable en el helper. Origen: ${source}`, e);
    return 'log-critical-failure';
  }
}

/**
 * @module reportErrorToDb
 * @description Server Action para la persistencia de errores críticos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) Crear la tabla `logs` en la base de datos de Supabase para habilitar esta funcionalidad.
 * - ((Vigente)) Integrar notificaciones (ej. email o Slack) que se disparen a través de un trigger de Supabase cuando se inserte un nuevo error en la tabla.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) Creación del endpoint de backend para la persistencia de errores.
 * - ((Implementada)) Devolución del ID del log para trazabilidad completa desde la UI hasta la base de datos.
 * - ((Implementada)) Manejo de errores robusto que previene que un fallo en el logging detenga la ejecución principal.
 */
