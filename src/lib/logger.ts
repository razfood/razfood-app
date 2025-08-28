// src/lib/logger.ts
/**
 * @file Provee un sistema de logging centralizado para la aplicación Meta-Bite.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Al abstraer los métodos de la consola, podemos redirigir fácilmente los logs a servicios de terceros en el futuro. Separa el logger de servidor (con integración a Sentry) del logger de cliente (wrapper de consola).
 */
import * as Sentry from '@sentry/nextjs';

type LogLevel = 'trace' | 'info' | 'warn' | 'error';

function logToServerConsole(level: LogLevel, message: string, ...context: any[]) {
  if (process.env.NODE_ENV !== 'development') return;
  const timestamp = new Date().toISOString();
  const logMessage = `[${level.toUpperCase()}] [${timestamp}] ${message}`;

  const consoleMethod = {
    trace: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };
  consoleMethod[level](logMessage, ...context);
}

/**
 * @public
 * @constant logger
 * @description Logger canónico para uso en **entornos de servidor** (Server Components, Actions, API Routes). Envía logs a Sentry en producción.
 */
export const logger = {
  trace: (message: string, ...context: any[]) => {
    logToServerConsole('trace', message, ...context);
  },
  info: (message: string, ...context: any[]) => {
    logToServerConsole('info', message, ...context);
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, { level: 'info', extra: { context } });
    }
  },
  warn: (message: string, ...context: any[]) => {
    logToServerConsole('warn', message, ...context);
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, { level: 'warning', extra: { context } });
    }
  },
  error: (message: string, ...context: any[]) => {
    logToServerConsole('error', message, ...context);
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, { level: 'error', extra: { context } });
    }
  },
};

/**
 * @public
 * @constant clientLogger
 * @description Logger ligero para uso exclusivo en **Client Components**. Es un wrapper simple de `console` y no tiene dependencias de Sentry.
 */
export const clientLogger = {
  trace: console.debug.bind(console, '[TRACE]'),
  info: console.info.bind(console, '[INFO]'),
  warn: console.warn.bind(console, '[WARN]'),
  error: console.error.bind(console, '[ERROR]'),
};

/**
 * @module logger
 * @description Módulo de logging centralizado para Meta-Bite.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) Integración con un servicio de observabilidad de terceros más avanzado (ej. Datadog) para trazas distribuidas.
 * - ((Vigente)) Agregar un `request ID` a cada log para facilitar el seguimiento de trazas completas de una petición.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) Adopción del patrón de separación de loggers cliente/servidor del proyecto ConvertiKit.
 * - ((Implementada)) Estructuración de logs de servidor con timestamp y severidad para facilitar el análisis.
 * - ((Implementada)) Integración base con Sentry para reporte de logs en producción.
 */
