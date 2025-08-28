// src/lib/types/database/tables/workspaces.ts
/**
 * @file Define el contrato de datos atómico para la tabla `workspaces`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla
 *              `workspaces`. Es la SSoT para la forma de los datos de un workspace
 *              (restaurante) en la aplicación Restoralia.
 */
export type Workspaces = {
  Row: {
    id: string;
    name: string;
    owner_id: string;
    icon: string | null;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    name: string;
    owner_id: string;
    icon?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    owner_id?: string;
    icon?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: 'workspaces_owner_id_fkey';
      columns: ['owner_id'];
      isOneToOne: false;
      referencedRelation: 'profiles';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module workspaces_type
 * @description Contrato de datos para la tabla de workspaces (restaurantes).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Contadores Denormalizados:** Proponho implementar esta melhoria na próxima fase de refatoração do esquema SQL. Adicionar colunas como `active_order_count` e `menu_item_count` diretamente neste tipo (e na tabela SQL correspondente). Manter estes contadores atualizados com triggers na base de dados otimizará drasticamente as consultas do dashboard, eliminando a necessidade de `COUNT(*)` dispendiosos.
 * - ((Vigente)) **Campo de `status`:** Proponho adicionar uma coluna `status` (`ENUM('active', 'inactive', 'suspended')`) para permitir aos administradores da plataforma gerir o estado dos workspaces. Esta é uma funcionalidade crítica para a moderação e gestão do serviço a longo prazo e deve ser implementada no esquema SQL e refletida aqui.
 */
// src/lib/types/database/tables/workspaces.ts
