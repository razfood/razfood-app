// src/lib/types/database/_supabase.manual.ts
/**
 * @file Manifiesto de Tipos Manuales para la Base de Datos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato define tipos para entidades que no son generadas
 *              automáticamente por la CLI de Supabase, como las Vistas (`Views`).
 *              Actúa como una capa de aumentación sobre los tipos generados,
 *              permitiendo una cobertura de tipos del 100% del esquema.
 */
import { type Database as GeneratedDB } from './_supabase.generated';

export type ManualDatabaseDefs = {
  public: {
    Views: {
      // EJEMPLO de cómo se verá en el futuro:
      // user_profiles_with_email: {
      //   Row: {
      //     app_role: GeneratedDB["public"]["Enums"]["app_role"] | null;
      //     email: string | null;
      //     // ... otros campos de la vista
      //   };
      // };
      [_ in never]: never; // Placeholder para indicar que no hay vistas definidas aún.
    };
  };
};

/**
 * @module supabase-manual-types
 * @description Contenedor para definiciones de tipos manuales que aumentan los tipos generados.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Creación de Vistas:** Definir y crear Vistas en la base de datos (ej. para obtener conteos agregados o unir datos frecuentemente) y luego definir sus tipos correspondientes aquí.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Arquitectura de Tipos Extensible:** Establece el patrón para extender los tipos generados por Supabase de una manera limpia y desacoplada.
 */
// src/lib/types/database/_supabase.manual.ts
