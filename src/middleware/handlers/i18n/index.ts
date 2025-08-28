// src/middleware/handlers/i18n/index.ts
/**
 * @file Manejador de internacionalización (i18n) de élite para el middleware.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato implementa la lógica de detección de locale. Prioriza una cookie de
 *              depuración, luego la cookie de preferencia del usuario, y finalmente
 *              recurre a un locale por defecto. Pasa el control al middleware de `next-intl`
 *              y adjunta una cabecera `x-app-locale` para observabilidad.
 */
import { type NextRequest, type NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { logger } from '@/lib/logger';
import { type AppLocale, localePrefix, locales, pathnames } from '@/lib/navigation';
import { defaultLocale } from '@/i18n';

/**
 * @public
 * @async
 * @function handleI18n
 * @description Orquesta la detección de locale y ejecuta el middleware de `next-intl`.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {Promise<NextResponse>} La respuesta modificada por el middleware de i18n.
 */
export async function handleI18n(request: NextRequest): Promise<NextResponse> {
  logger.trace('[I18N_HANDLER] Iniciando detección de locale.');

  // Lógica de Override para Depuración: Una cookie `DEBUG_LOCALE` fuerza un locale específico.
  const debugLocaleCookie = request.cookies.get('DEBUG_LOCALE');
  if (debugLocaleCookie && locales.includes(debugLocaleCookie.value as AppLocale)) {
    const forcedLocale = debugLocaleCookie.value as AppLocale;
    logger.warn(`[I18N_HANDLER] MODO OVERRIDE ACTIVO. Forzando locale a '${forcedLocale}' vía cookie DEBUG_LOCALE.`);

    const handle = createIntlMiddleware({
      locales,
      localePrefix,
      pathnames,
      defaultLocale: forcedLocale,
    });
    const response = handle(request);
    response.headers.set('x-app-locale', forcedLocale);
    return response;
  }

  const handle = createIntlMiddleware({
    locales,
    localePrefix,
    pathnames,
    defaultLocale: defaultLocale,
  });

  const response = handle(request);
  const detectedLocale = response.headers.get('x-next-intl-locale') || defaultLocale;
  response.headers.set('x-app-locale', detectedLocale);

  logger.info('[I18N_HANDLER] Procesamiento de next-intl completado.', {
    detectedLocale,
  });

  return response;
}

/**
 * @module i18n-handler
 * @description Manejador de middleware para la internacionalización.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Detección por GeoIP:** Implementar una llamada al servicio `geoip.service.ts` para detectar el país del usuario a través de su IP y seleccionar el `defaultLocale` más apropiado, antes de recurrir al fallback global. Esto proporciona una UX de primer contacto superior.
 * - ((Vigente)) **Detección por Cabecera `Accept-Language`:** Integrar la librería `negotiator` para parsear la cabecera `Accept-Language` del navegador como un mecanismo de fallback adicional antes de usar el `defaultLocale` global.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Lógica de i18n Aislada (SRP):** Se aísla toda la lógica de `next-intl` en un manejador atómico, manteniendo el `middleware.ts` principal como un orquestador limpio.
 * - ((Implementada)) **DX de Élite:** Se incluye la lógica para la cookie de depuración `DEBUG_LOCALE`, una herramienta invaluable para probar diferentes idiomas.
 * - ((Implementada)) **Full Observabilidad:** El manejador registra cada paso de su lógica, desde el inicio hasta la detección final, y añade una cabecera `x-app-locale` a la respuesta para facilitar la depuración.
 */
// src/middleware/handlers/i18n/index.ts
