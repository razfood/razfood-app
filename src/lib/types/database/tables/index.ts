// src/lib/types/database/tables/index.ts
/**
 * @file Manifiesto (Barrel File) y API pública para todos los tipos de tabla.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ensambla y re-exporta todas las definiciones de tipo
 *              atómicas para las tablas de la base de datos de Restoralia. Es la
 *              Única Fuente de Verdad para acceder a los contratos de datos de las tablas.
 */

export * from './profiles';
export * from './workspaces';
export * from './workspace_members';
export * from './invitations';
export * from './sites';
export * from './products';
export * from './orders';
export * from './order_items';
export * from './visitor_logs';
export * from './audit_logs';
// Placeholder para la tabla de logs de errores que propusimos.
export * from './logs';

/**
 * @module database-table-types
 * @description Punto de entrada para todos los tipos de tabla de la base de datos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Generación Automática:** Este archivo es un candidato ideal para ser generado y mantenido por un script (`pnpm gen:db:manifests`) que lea la estructura del directorio, previniendo errores de omisión manual.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **API de Datos Cohesiva:** Crea una API pública limpia y centralizada para todos los tipos de tabla, mejorando la organización y la DX.
 * - ((Implementada)) **Fundación para `_supabase.generated.ts`:** La existencia de este archivo es un prerrequisito para que el ensamblador de tipos principal funcione.
 */
// src/lib/types/database/tables/index.ts
