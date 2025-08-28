// src/lib/types/database/tables/profiles.ts
/**
 * @file Define el contrato de datos atómico para la tabla `profiles`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla
 *              `profiles` en la base de datos de Restoralia. Es la SSoT para
 *              la forma de los datos de un perfil de usuario.
 */
import { type Json } from '../_shared';
import { type Enums } from '../enums';

export type Profiles = {
  Row: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    app_role: Enums['app_role'];
    plan_type: Enums['plan_type'];
    has_completed_onboarding: boolean;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id: string;
    email: string;
    full_name?: string | null;
    avatar_url?: string | null;
    app_role?: Enums['app_role'];
    plan_type?: Enums['plan_type'];
    has_completed_onboarding?: boolean;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    email?: string;
    full_name?: string | null;
    avatar_url?: string | null;
    app_role?: Enums['app_role'];
    plan_type?: Enums['plan_type'];
    has_completed_onboarding?: boolean;
    created_at?: string;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: 'profiles_id_fkey';
      columns: ['id'];
      isOneToOne: true;
      referencedRelation: 'users';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module profiles_type
 * @description Contrato de datos para la tabla de perfiles de usuario.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tipado Fuerte para Preferencias:** Cuando se añada la columna `preferences JSONB` a la tabla, este tipo deberá ser actualizado para usar un tipo inferido de un `ProfilePreferencesSchema` de Zod en lugar de `Json`, para una seguridad de tipos de élite.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Puente Tipo-Seguro DB-App:** Se crea la primera definición de tipo de tabla, estableciendo el patrón para el resto de la infraestructura de tipos.
 * - ((Implementada)) **Consumo de Tipos ENUM:** El tipo `Profiles` consume los tipos de `Enums`, garantizando que propiedades como `app_role` solo puedan tener valores válidos.
 * - ((Implementada)) **Sincronización con Esquema SQL:** El tipo refleja con precisión la estructura definida en `db/04_tables/01_profiles.sql`.
 */
// src/lib/types/database/tables/profiles.ts
