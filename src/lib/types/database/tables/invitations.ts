// src/lib/types/database/tables/invitations.ts
/**
 * @file Define el contrato de datos atómico para la tabla `invitations`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla `invitations`,
 *              que gestiona el ciclo de vida de las invitaciones de usuarios a workspaces.
 */
import { type Enums } from '../enums';

export type Invitations = {
  Row: {
    id: string;
    workspace_id: string;
    invited_by: string;
    invitee_email: string;
    role: Enums['workspace_role'];
    status: Enums['invitation_status'];
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    workspace_id: string;
    invited_by: string;
    invitee_email: string;
    role: Enums['workspace_role'];
    status?: Enums['invitation_status'];
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    status?: Enums['invitation_status'];
    updated_at?: string | null;
    // Otras propiedades no deberían ser actualizables directamente.
  };
  Relationships: [
    {
      foreignKeyName: 'invitations_invited_by_fkey';
      columns: ['invited_by'];
      isOneToOne: false;
      referencedRelation: 'profiles';
      referencedColumns: ['id'];
    },
    {
      foreignKeyName: 'invitations_workspace_id_fkey';
      columns: ['workspace_id'];
      isOneToOne: false;
      referencedRelation: 'workspaces';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module invitations_type
 * @description Contrato de datos para la tabla de invitaciones a workspaces.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Token de Invitación Único:** Proponho implementar esta melhoria na próxima fase de refatoração do esquema SQL. Adicionar um campo `token: string` a este tipo e à tabela SQL correspondente. O link de convite no e-mail usaria este token em vez do ID, adicionando uma camada extra de segurança e permitindo a revogação de convites individuais.
 * - ((Vigente)) **Fecha de Expiración:** Proponho adicionar uma coluna `expires_at: string | null` para permitir que os convites expirem. Um job agendado no banco de dados (`pg_cron`) poderia atualizar o status dos convites expirados, mantendo o sistema limpo.
 */
// src/lib/types/database/tables/invitations.ts
