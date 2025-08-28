// src/messages/manifest.ts
/**
 * @file Manifiesto de Importación Dinámica y Única Fuente de Verdad (SSoT) para los módulos de mensajes.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este archivo mapea cada namespace de la aplicación a una función de importación
 *              dinámica que carga el archivo de mensajes correspondiente. Este patrón de
 *              "carga diferida" (lazy-loading) es fundamental para el rendimiento,
 *              ya que asegura que solo se carguen en el servidor las traducciones
 *              necesarias para la petición actual.
 *              ESTE ARCHIVO SERÁ POBLADO A MEDIDA QUE SE CREEN LOS NAMESPACES.
 */
import { type ManifestModule } from './types';

/**
 * @public
 * @constant messagesManifest
 * @description Registro canónico de todos los namespaces de traducción.
 *              La clave es el namespace (ej. "pages.LoginPage") y el valor es
 *              una función que devuelve una promesa de importación dinámica.
 */
export const messagesManifest: Record<string, ManifestModule> = {
  // EJEMPLO DE CÓMO SE VERÁ EN EL FUTURO:
  // "pages.login": () => import("./pages/login.json"),
  // "components.shared.buttons": () => import("./components/shared/buttons.json"),
};

/**
 * @module i18n-manifest
 * @description Manifiesto para la carga dinámica de módulos de traducción.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Generación Automática:** Implementar un script en `package.json` (`pnpm gen:i18n:manifest`) que escanee el directorio `/messages` y regenere este manifiesto automáticamente. Esto elimina el mantenimiento manual, previene errores humanos y asegura que el manifiesto esté siempre sincronizado con la estructura de archivos, cumpliendo con los más altos estándares de DX (Developer Experience). Propondré la implementación de este script una vez que la estructura de mensajes se estabilice.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Infraestructura de Carga Diferida:** Establece la arquitectura fundamental para el sistema de i18n modular y performante (IMAS).
 * - ((Implementada)) **Cumplimiento de Contrato:** Este manifiesto implementa el contrato `ManifestModule` definido en `types.ts`, garantizando la seguridad de tipos.
 */
// src/messages/manifest.ts
