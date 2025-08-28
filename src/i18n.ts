// src/i18n.ts
/**
 * @file Orquestador de Internacionalización (i18n) de élite.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado para alinearse con la API de `next-intl` v3+.
 *              Consume el manifiesto de mensajes, carga dinámicamente los módulos para el
 *              locale actual y reconstruye la estructura de objetos anidados que `next-intl`
 *              requiere.
 */
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { setNestedProperty } from "@/lib/helpers/set-nested-property.helper";
import { logger } from "@/lib/logger";
import { type AppLocale, locales } from "@/lib/navigation";
import { messagesManifest } from "@/messages/manifest";

export const defaultLocale: AppLocale = "es-ES";

export default getRequestConfig(async ({ locale }) => {
  const typedLocale = locale as AppLocale;

  if (!locales.includes(typedLocale)) {
    logger.warn(`[I18N] Intento de acceso con locale no válido: ${locale}`);
    notFound();
  }

  const namespaces = Object.keys(
    messagesManifest,
  ) as (keyof typeof messagesManifest)[];

  try {
    const modulePromises = namespaces.map((ns) => messagesManifest[ns]());
    const modules = await Promise.all(modulePromises);

    const messages = modules.reduce(
      (acc, module, index) => {
        const namespace = namespaces[index];
        const localeMessages = module.default?.[typedLocale];

        if (localeMessages) {
          setNestedProperty(acc, namespace, localeMessages);
        } else {
          logger.warn(
            `[I18N] Faltan traducciones para el namespace '${namespace}' en el locale '${typedLocale}'.`,
          );
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    // --- INICIO DE REFACTORIZACIÓN DE API (next-intl v3+) ---
    // El objeto devuelto ahora debe incluir explícitamente el `locale`
    // para cumplir con el contrato `RequestConfig`.
    return {
      locale: typedLocale,
      messages,
      timeZone: "America/Sao_Paulo",
    };
    // --- FIN DE REFACTORIZACIÓN DE API ---

  } catch (error) {
    logger.error("[I18N] Fallo crítico al ensamblar mensajes.", {
      locale: typedLocale,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      locale: typedLocale,
      messages: {}
    };
  }
});

/**
 * @module i18n-orchestrator
 * @description Motor de configuración para `next-intl`.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Validación de Schema en Build:** Integrar la validación del `i18nSchema` de Zod aquí.
 * - ((Vigente)) **Gestión de TimeZone Dinámica:** Obtener la `timeZone` dinámicamente a partir de datos de GeoIP.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolución de Regresión Crítica (TS2345):** Se ha añadido la propiedad `locale` al objeto de retorno de `getRequestConfig`. Esto alinea la implementación con el contrato de tipo `RequestConfig` de `next-intl` v3+, resolviendo el error de compilación.
 * - ((Implementada)) **Alineación con API de `next-intl` v3+:** El código ahora cumple con el contrato de la versión actual de la librería.
 */
// src/i18n.ts