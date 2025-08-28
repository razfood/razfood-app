// src/lib/types/database/_shared.ts
/**
 * @file Helpers de tipo para la introspección del tipo Database.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato proporciona un conjunto de helpers de tipo genéricos y
 *              reutilizables para extraer tipos específicos (Tablas, Enums, Vistas, etc.)
 *              del objeto `Database` global. Es la piedra angular de la seguridad de
 *              tipos en toda la capa de datos.
 */
import { type Database as DB } from './index'; // Dependencia circular temporal, se resolverá al crear index.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Tables<T extends keyof DB['public']['Tables']> = DB['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof DB['public']['Tables']> = DB['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof DB['public']['Tables']> = DB['public']['Tables'][T]['Update'];

export type Enums<T extends keyof DB['public']['Enums']> = DB['public']['Enums'][T];

export type Views<T extends keyof DB['public']['Views']> = DB['public']['Views'][T]['Row'];

/**
 * @module database-type-helpers
 * @description Utilidades de tipo para el esquema de la base de datos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tipos de RPC:** Añadir un helper de tipo genérico `Rpc<T extends keyof DB["public"]["Functions"]>` para extraer los tipos de argumentos (`Args`) y de retorno (`Returns`) de las funciones RPC, completando la cobertura de tipos de la base de datos.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Fundación de Seguridad de Tipos:** Este aparato establece la base para la seguridad de tipos en toda la capa de datos. Es una dependencia crítica para todos los futuros archivos de tipos y módulos de datos.
 * - ((Implementada)) **Abstracción de Tipos (DRY):** Proporciona una forma limpia y reutilizable de acceder a los tipos anidados dentro de la definición de `Database`, evitando la repetición de tipos complejos.
 */
// src/lib/types/database/_shared.ts
