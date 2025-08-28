// src/lib/types/database/tables/logs.ts
/**
 * @file Define el contrato de datos atómico para la tabla `logs`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla `logs`,
 *              que proporciona un registro persistente de errores críticos de la aplicación
 *              para auditoría y depuración a largo plazo.
 */
import { type Json } from '../_shared';

export type Logs = {
  Row: {
    id: number;
    created_at: string;
    source: string;
    error_message: string;
    stack_trace: string | null;
    metadata: Json | null;
    status: string; // 'new', 'acknowledged', 'resolved'
  };
  Insert: {
    id?: number;
    created_at?: string;
    source: string;
    error_message: string;
    stack_trace?: string | null;
    metadata?: Json | null;
    status?: string;
  };
  Update: {
    id?: number;
    status?: string; // Típicamente, solo el estado del error se actualiza.
  };
  Relationships: []; // No tiene relaciones directas con otras tablas.
};

/**
 * @module logs_type
 * @description Contrato de datos para la tabla de logs de errores del sistema.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tipado Fuerte para `status`:** Proponho implementar esta melhoria na próxima fase de refatoração do esquema SQL. Criar um `ENUM('new', 'acknowledged', 'resolved')` para a coluna `status` e refletir essa mudança aqui. Isso garantirá a integridade dos dados e evitará estados inválidos.
 * - ((Vigente)) **Relación con `profiles`:** Proponho adicionar uma coluna `resolved_by: string | null` (UUID referenciando `profiles.id`) para auditar qual administrador resolveu um erro específico, uma funcionalidade chave para um painel de administração de élite.
 */
// src/lib/types/database/tables/logs.ts
