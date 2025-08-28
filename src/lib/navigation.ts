// src/lib/navigation.ts
/**
 * @file Manifiesto de Enrutamiento y Única Fuente de Verdad (SSoT) para la navegación.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a un estándar de élite para alinearse con
 *              la API de `next-intl` v3+. Utiliza `createSharedPathnamesNavigation` para
 *              generar hooks de navegación tipados y conscientes del locale, resolviendo
 *              una incompatibilidad de API crítica.
 */
import {
  createSharedPathnamesNavigation,
  type Pathnames,
} from "next-intl/navigation";

/**
 * @public
 * @constant locales
 * @description Lista canónica de los locales soportados por la aplicación.
 */
export const locales = ["en-US", "es-ES", "pt-BR"] as const;
export type AppLocale = (typeof locales)[number];

/**
 * @public
 * @constant localePrefix
 * @description Estrategia para el prefijo de locale en la URL. 'as-needed' no añade prefijo para el locale por defecto.
 */
export const localePrefix = "as-needed";

/**
 * @public
 * @constant pathnames
 * @description Mapeo de rutas canónicas a sus posibles traducciones.
 */
export const pathnames = {
  "/": "/",
  "/login": "/login",
  "/signup": "/signup",
  "/dashboard": "/dashboard",
  "/checkout": "/checkout",
  "/builder/[creationId]": "/builder/[creationId]",
  "/auth-notice": "/auth-notice",
  "/forgot-password": "/forgot-password",
  "/reset-password": "/reset-password",
} satisfies Pathnames<typeof locales>;

// --- INICIO DE REFACTORIZACIÓN DE API ---
// Se reemplaza 'createLocalizedPathnamesNavigation' por la factoría canónica 'createSharedPathnamesNavigation'
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
// --- FIN DE REFACTORIZACIÓN DE API ---

/**
 * @public
 * @typedef Route
 * @description Tipo de élite para el enrutamiento. Asegura que solo rutas definidas
 *              en `pathnames` puedan ser utilizadas.
 */
type PathnameKeys = keyof typeof pathnames;
export type Route =
  | PathnameKeys
  | {
      pathname: PathnameKeys;
      params?: Record<string, string | number>;
    };

/**
 * @module navigation
 * @description Módulo de configuración de enrutamiento e internacionalización.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Rutas Dinámicas desde CMS:** El objeto `pathnames` podría ser generado dinámicamente a partir de un CMS para permitir slugs traducidos (ej. `/es/servicios`).
 * - ((Vigente)) **Generador de Sitemap:** Crear un script (`pnpm gen:sitemap`) que lea este manifiesto para generar un `sitemap.xml` siempre sincronizado.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolución de Regresión Crítica (TS2305):** Se ha reemplazado la API obsoleta por `createSharedPathnamesNavigation`, resolviendo la causa raíz del error de compilación.
 * - ((Implementada)) **Alineación con `next-intl` v3+:** El código ahora cumple con el contrato de la versión actual de la librería, garantizando su funcionamiento y futura mantenibilidad.
 */
// src/lib/navigation.ts