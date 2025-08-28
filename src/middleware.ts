// src/middleware.ts
/**
 * @file Orquestador de Middleware de Élite.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este es el punto de entrada para todas las peticiones (excepto assets y API routes).
 *              Implementa un patrón de pipeline secuencial, donde cada "handler" es un aparato
 *              atómico con una única responsabilidad. Actualmente, solo invoca el handler de i18n.
 */
import { type NextRequest, type NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { handleI18n } from '@/middleware/handlers';

/**
 * @public
 * @async
 * @function middleware
 * @description El pipeline de middleware principal. Orquesta la ejecución secuencial de handlers.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {Promise<NextResponse>} La respuesta final, posiblemente modificada por los handlers.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  logger.trace('==> [MIDDLEWARE_PIPELINE] START <==', {
    path: request.nextUrl.pathname,
  });

  // El pipeline se ejecuta aquí. Cada handler puede devolver una respuesta (terminando el pipeline)
  // o pasar la respuesta al siguiente.
  const response = await handleI18n(request);
  // Futuros handlers se añadirían aquí:
  // response = await handleAuth(request, response);
  // response = await handleTelemetry(request, response);

  logger.trace('==> [MIDDLEWARE_PIPELINE] END <==', {
    path: request.nextUrl.pathname,
    status: response.status,
  });

  return response;
}

/**
 * @public
 * @constant config
 * @description Configuración del matcher para el middleware. Excluye rutas de API y
 *              archivos estáticos para un rendimiento óptimo.
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

/**
 * @module middleware
 * @description Orquestador principal del pipeline de middleware.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Factoría de Pipeline:** Abstraer la lógica de encadenamiento de handlers a una función `createMiddlewarePipeline([...handlers])`. Esto haría que añadir, quitar o reordenar handlers sea una simple modificación de un array de configuración, mejorando la mantenibilidad y adhiriéndose al principio de "Configuración sobre Código".
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Activación del Pilar de i18n:** Este aparato activa toda la infraestructura de internacionalización construida en los pasos anteriores.
 * - ((Implementada)) **Arquitectura de Pipeline Escalable:** Se establece un patrón de diseño limpio y modular que permite añadir fácilmente nueva lógica de middleware (auth, redirects, etc.) en el futuro sin refactorizar el código existente.
 * - ((Implementada)) **Full Observabilidad:** Se ha añadido logging de `trace` al inicio y final del pipeline para una visibilidad completa del flujo de peticiones.
 */
// src/middleware.ts
