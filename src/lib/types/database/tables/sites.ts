// src/lib/types/database/tables/sites.ts
/**
 * @file Define el contrato de datos atómico para la tabla `sites`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este tipo de TypeScript es la representación canónica de la tabla `sites`.
 *              En el dominio de Restoralia, un "site" representa un Menú Digital
 *              o un Punto de Venta, que actúa como contenedor de productos.
 */
import { type Enums } from '../enums';

export type Sites = {
  Row: {
    id: string;
    workspace_id: string;
    owner_id: string | null;
    name: string;
    subdomain: string | null;
    custom_domain: string | null;
    icon: string | null;
    description: string | null;
    status: Enums['site_status'];
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    workspace_id: string;
    owner_id?: string | null;
    name: string;
    subdomain?: string | null;
    custom_domain?: string | null;
    icon?: string | null;
    description?: string | null;
    status?: Enums['site_status'];
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    subdomain?: string | null;
    custom_domain?: string | null;
    icon?: string | null;
    description?: string | null;
    status?: Enums['site_status'];
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: 'sites_owner_id_fkey';
      columns: ['owner_id'];
      isOneToOne: false;
      referencedRelation: 'profiles';
      referencedColumns: ['id'];
    },
    {
      foreignKeyName: 'sites_workspace_id_fkey';
      columns: ['workspace_id'];
      isOneToOne: false;
      referencedRelation: 'workspaces';
      referencedColumns: ['id'];
    },
  ];
};

/**
 * @module sites_type
 * @description Contrato de datos para la tabla de sitios (menús).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Soporte para Múltiples Dominios:** Proponho implementar esta melhoria na próxima fase de refatoração do esquema SQL. Abstrair a gestão de domínios para uma tabela de união `site_domains (site_id, domain, is_primary)`. Isso permitirá que um único menu seja acessível a partir de múltiplos domínios personalizados, uma característica de elite para cadeias de restaurantes ou white-labeling.
 * - ((Vigente)) **Campo de Tema:** Proponho adicionar uma coluna `theme: JSONB` para armazenar personalizações de estilo específicas do menu (cores, fontes, logo), que sobrescreveriam o `BrandKit` do workspace. Isso permitirá a personalização granular de cada ponto de venda.
 */
// src/lib/types/database/tables/sites.ts
