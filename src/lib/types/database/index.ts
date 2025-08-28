// src/lib/types/database/index.ts
/**
 * @file Manifiesto de Tipos de Base de Datos Canónico y Ensamblador.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato fusiona los tipos generados automáticamente por Supabase
 *              (`_supabase.generated.ts`) con los tipos definidos manualmente
 *              (como Vistas en `_supabase.manual.ts`) para crear un único tipo `Database`
 *              que representa el esquema completo de la base de datos de Restoralia.
 *              También re-exporta los helpers de tipo compartidos.
 */
import { type Database as GeneratedDB } from './_supabase.generated';
import { type ManualDatabaseDefs } from './_supabase.manual'; // Será creado después
import { type Enums as ManualEnums } from './enums'; // Será creado después

/**
 * @public
 * @typedef Database
 * @description El tipo `Database` unificado y de élite. Es la Única Fuente de Verdad (SSoT)
 *              para la estructura completa del esquema de la base de datos.
 */
export type Database = GeneratedDB &
  ManualDatabaseDefs & {
    public: {
      Enums: ManualEnums;
    };
  };

export * from './_shared';

/**
 * @module database-types
 * @description Punto de entrada principal para todos los tipos relacionados con la base de datos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Automatización de Fusión:** Si la complejidad de los tipos manuales aumenta, se podría explorar un script de build que fusione automáticamente múltiples fuentes de tipos en este archivo, aunque la aproximación actual es robusta para la escala del proyecto.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Tipo `Database` Unificado:** Se crea el tipo `Database` centralizado, que será utilizado para instanciar todos los clientes de Supabase con seguridad de tipos de extremo a extremo.
 * - ((Implementada)) **Resolución de Dependencia Circular:** La existencia de este archivo resuelve la dependencia circular en `_shared.ts`, estabilizando la base de la infraestructura de tipos.
 * - ((Implementada)) **Arquitectura de Tipos Modular:** Sigue el patrón de élite de `convertikit` de separar los tipos generados, manuales y ensamblados.
 */
// src/lib/types/database/index.ts
