// src/lib/types/database/tables/visitor_logs.ts
/**
 * @file Define el contrato de datos atómico para la tabla `visitor_logs`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla `visitor_logs`,
 *              diseñada para la ingesta de alta frecuencia de datos de telemetría de visitantes.
 */
import { type Json } from '../_shared';

export type VisitorLogs = {
  Row: {
    id: string;
    session_id: string;
    customer_id: string | null;
    fingerprint: string;
    ip_address: string | null;
    geo_data: Json | null;
    user_agent: string | null;
    utm_params: Json | null;
    referrer: string | null;
    landing_page: string | null;
    browser_context: Json | null;
    is_bot: boolean;
    created_at: string;
  };
  Insert: {
    id?: string;
    session_id: string;
    customer_id?: string | null;
    fingerprint: string;
    ip_address?: string | null;
    geo_data?: Json | null;
    user_agent?: string | null;
    utm_params?: Json | null;
    referrer?: string | null;
    landing_page?: string | null;
    browser_context?: Json | null;
    is_bot?: boolean;
    created_at?: string;
  };
  Update: {
    // Los logs de visitantes son inmutables por diseño, solo se enriquecen.
    // Futuras actualizaciones (ej. marcar como abusador) podrían añadirse aquí.
    id?: string;
    fingerprint?: string;
    browser_context?: Json | null;
  };
  Relationships: [
    {
      foreignKeyName: 'visitor_logs_customer_id_fkey';
      columns: ['customer_id'];
      isOneToOne: false;
      referencedRelation: 'profiles';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module visitor_logs_type
 * @description Contrato de datos para la tabla de telemetría de visitantes.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Campo `is_known_abuser`:** Proponho implementar esta melhoria na próxima fase de refatoração do esquema SQL. Adicionar um campo booleano `is_known_abuser` para marcar IPs ou fingerprints associados a atividades maliciosas, permitindo um bloqueio proativo no middleware.
 * - ((Vigente)) **Tipado Fuerte para `JSONB`:** Proponho criar schemas Zod específicos para `geo_data`, `utm_params` e `browser_context` e usar `z.infer` para substituir `Json`, garantindo a integridade e consistência dos dados de telemetria armazenados.
 */
// src/lib/types/database/tables/visitor_logs.ts
