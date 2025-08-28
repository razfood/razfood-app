// src/middleware/handlers/index.ts
/**
 * @file Manifiesto (Barrel File) y API pública para los manejadores del middleware.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato exporta todos los manejadores de middleware de forma
 *              atómica y organizada, siguiendo la "Filosofía LEGO". Permite que el
 *              orquestador `middleware.ts` importe toda la lógica de negocio desde
 *              un único punto, mejorando la cohesión y mantenibilidad.
 */
import 'server-only';

export * from './i18n';
// Futuros handlers como ./auth, ./redirects, etc., serán exportados aquí.

/**
 * @module middleware-handlers
 * @description Punto de entrada para todos los módulos de lógica de middleware.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Generación Automática:** Este archivo es un candidato ideal para ser generado y mantenido por un script que lea la estructura de directorios, eliminando la necesidad de actualizaciones manuales y previniendo errores de omisión.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Cohesión de Módulo:** Agrupa todos los manejadores del pipeline de middleware, creando una API de lógica de negocio clara y desacoplada para el orquestador principal.
 * - ((Implementada)) **Escalabilidad:** Establece un patrón que facilita la adición de nuevos manejadores (como autenticación o redirecciones) al pipeline en el futuro sin modificar múltiples archivos.
 */
// src/middleware/handlers/index.ts
