// src/graphql/schemas/index.ts
/**
 * @file Manifiesto (Barrel File) y ensamblador para todos los schemas de GraphQL.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es la Única Fuente de Verdad para la estructura completa
 *              del schema de GraphQL. Importa todos los schemas de dominio atómicos
 *              y los exporta como un único array para ser consumido por el servidor Apollo.
 */

import { workspaceTypeDefs } from './workspace.schema';
import { siteTypeDefs } from './site.schema';
import { productTypeDefs } from './product.schema';
import { orderTypeDefs } from './order.schema';

/**
 * @public
 * @constant baseTypeDefs
 * @description Define los tipos raíz `Query` y `Mutation` a los que los schemas de
 *              dominio extenderán. Es la fundación del schema federado.
 */
const baseTypeDefs = `#graphql
  type Query
  type Mutation
`;

/**
 * @public
 * @constant typeDefs
 * @description El array completo de definiciones de tipo, listo para ser consumido por Apollo Server.
 */
export const typeDefs = [baseTypeDefs, workspaceTypeDefs, siteTypeDefs, productTypeDefs, orderTypeDefs];

/**
 * @module graphql-schemas-manifest
 * @description Punto de entrada para el schema completo de GraphQL.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Generación Automática:** Este arquivo é um candidato ideal para ser gerado e mantido por um script (`pnpm gen:gql:manifests`) que leia a estrutura do diretório `schemas`. Isso eliminaria a manutenção manual e garantiria que o manifesto esteja sempre sincronizado, uma prática de DX de élite.
 * - ((Vigente)) **Carga Dinámica de Módulos:** Para APIs extremamente grandes, a importação poderia ser feita dinamicamente usando um `loader` que percorra o sistema de arquivos. No entanto, para a escala atual do projeto, a importação explícita é mais clara e segura.
 */
// src/graphql/schemas/index.ts
