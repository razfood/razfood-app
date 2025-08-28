// src/lib/types/database/tables/audit_logs.ts
/**
 * @file Define el contrato de datos atómico para la tabla `audit_logs`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla `audit_logs`,
 *              que proporciona un registro de auditoría inmutable de todas las acciones
 *              críticas realizadas en la plataforma.
 */
import { type Json } from '../_shared';

export type AuditLogs = {
  Row: {
    id: number;
    created_at: string;
    actor_id: string | null;
    action: string;
    target_entity_id: string | null;
    target_entity_type: string | null;
    metadata: Json | null;
    ip_address: string | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    actor_id?: string | null;
    action: string;
    target_entity_id?: string | null;
    target_entity_type?: string | null;
    metadata?: Json | null;
    ip_address?: string | null;
  };
  Update: never; // Los logs de auditoría son inmutables (append-only).
  Relationships: [
    {
      foreignKeyName: 'audit_logs_actor_id_fkey';
      columns: ['actor_id'];
      isOneToOne: false;
      referencedRelation: 'profiles';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module audit_logs_type
 * @description Contrato de datos para la tabla de logs de auditoría.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tipado Fuerte para `action`:** Proponho implementar esta melhoria na próxima fase de refatoração de tipos. Criar um tipo de união de string literal com todos os nomes de ação válidos (ex: `type AuditAction = "user.login" | "workspace.created" | ...`) e usá-lo para a propriedade `action`. Isso fornecerá segurança de tipos e autocompletar ao registrar novos eventos de auditoria.
 * - ((Vigente)) **Visualizador de Logs no Admin Panel:** Proponho desenvolver uma interface no futuro painel de administração (`/admin/audit-logs`) que permita aos administradores pesquisar, filtrar e visualizar esses logs para fins de segurança e depuração.
 */
// src/lib/types/database/tables/audit_logs.ts
