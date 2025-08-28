// src/messages/types.ts
/**
 * @file Contrato de datos para la arquitectura de mensajes atómicos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta es la Única Fuente de Verdad (SSoT) para la estructura de CUALQUIER
 *              archivo de mensajes .json en el directorio `src/messages`. Define los
 *              contratos que permiten a TypeScript entender nuestro sistema de carga dinámica.
 */
import { type AppLocale } from '@/lib/navigation';

/**
 * @public
 * @type MessageModule
 * @description Define la estructura que debe tener cada archivo .json de mensajes.
 *              Es un registro donde cada clave es un `AppLocale` soportado (ej. "es-ES"), y el valor
 *              es un objeto anidado de strings que contiene las traducciones.
 */
export type MessageModule = {
  [key in AppLocale]: Record<string, any>;
};

/**
 * @public
 * @type ManifestModule
 * @description Define la firma de una función dentro del `messagesManifest`.
 *              Es una función asíncrona que no toma argumentos y devuelve una
 *              promesa que resuelve a un objeto con una exportación `default`
 *              del tipo `MessageModule`. Este patrón es la clave para la carga
 *              diferida (lazy-loading) de los archivos de traducción.
 */
export type ManifestModule = () => Promise<{
  default: MessageModule;
}>;

/**
 * @module i18n-types
 * @description Contratos de tipo para el sistema de internacionalización modular (IMAS).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tipado Fuerte con Zod:** El tipo `MessageModule` usa `Record<string, any>`. Para una seguridad de tipos de élite, se podría crear una factoría de tipos genérica que infiera la estructura a partir de un schema de Zod, garantizando que el contenido de los archivos JSON coincida perfectamente con un contrato predefinido.
 * - ((Vigente)) **Generación Automática de Manifiesto:** Proponer la creación de un script (`pnpm gen:i18n:manifest`) que escanee el directorio `/messages` y genere automáticamente el archivo `manifest.ts`, eliminando la posibilidad de errores humanos al registrar nuevos namespaces.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Fundación de Seguridad de Tipos:** Este aparato establece los contratos `MessageModule` y `ManifestModule`, que son la base para toda la infraestructura de i18n, garantizando que los componentes que la consumen lo hagan de manera tipo-segura.
 * - ((Implementada)) **Adhesión a Principios Atómicos:** Este archivo cumple perfectamente con el Principio de Responsabilidad Única (SRP), ya que su única función es definir tipos.
 */
// src/messages/types.ts
