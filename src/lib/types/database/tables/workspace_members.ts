// src/lib/types/database/tables/workspace_members.ts
/**
 * @file Define el contrato de datos atómico para la tabla de unión `workspace_members`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla `workspace_members`.
 *              Modela la relación "muchos a muchos" entre usuarios y workspaces,
 *              definiendo el rol de cada miembro dentro de un workspace específico.
 */
import { type Enums } from '../enums';

export type WorkspaceMembers = {
  Row: {
    id: string;
    workspace_id: string;
    user_id: string;
    role: Enums['workspace_role'];
    created_at: string;
  };
  Insert: {
    id?: string;
    workspace_id: string;
    user_id: string;
    role: Enums['workspace_role'];
    created_at?: string;
  };
  Update: {
    id?: string;
    role?: Enums['workspace_role']; // Típicamente, solo el rol es actualizable.
  };
  Relationships: [
    {
      foreignKeyName: 'workspace_members_user_id_fkey';
      columns: ['user_id'];
      isOneToOne: false;
      referencedRelation: 'profiles';
      referencedColumns: ['id'];
    },
    {
      foreignKeyName: 'workspace_members_workspace_id_fkey';
      columns: ['workspace_id'];
      isOneToOne: false;
      referencedRelation: 'workspaces';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module workspace_members_type
 * @description Contrato de datos para la tabla de membresías de workspaces.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Estado de Membresía:** Proponho implementar esta melhoria na próxima fase de refatoração do esquema SQL. Adicionar um campo `status: ENUM('active', 'deactivated')` a este tipo e à tabela SQL correspondente. Isso permitirá que os administradores desativem temporariamente o acesso de um membro sem o remover do workspace, uma funcionalidade essencial para a gestão de equipes.
 * - ((Vigente)) **Auditoría de Invitación:** Proponho adicionar um campo `invited_by: string | null` (UUID referenciando `profiles.id`) para registrar quem convidou cada membro. Isso melhorará a auditoria e a rastreabilidade, fornecendo dados valiosos para análises de crescimento viral.
 */
// src/lib/types/database/tables/workspace_members.ts
