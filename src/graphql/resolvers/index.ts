// src/graphql/resolvers/index.ts
/**
 * @file Manifiesto (Barrel File) y ensamblador para todos los resolvers de GraphQL.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es la Única Fuente de Verdad para la lógica de negocio
 *              completa de la API. Importa todos los resolvers de dominio atómicos
 *              y los fusiona en un único objeto de resolvers para ser consumido
 *              por el servidor Apollo.
 */

import { mergeResolvers } from '@graphql-tools/merge';

import { workspaceResolvers } from './workspace.resolver';
import { siteResolvers } from './site.resolver';
import { productResolvers } from './product.resolver';
import { orderResolvers } from './order.resolver';

/**
 * @public
 * @constant resolvers
 * @description El objeto de resolvers completo y fusionado, listo para ser consumido por Apollo Server.
 */
export const resolvers = mergeResolvers([workspaceResolvers, siteResolvers, productResolvers, orderResolvers]);

/**
 * @module graphql-resolvers-manifest
 * @description Punto de entrada para la lógica de negocio completa de la API de GraphQL.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Generación Automática:** Assim como o manifesto de schemas, este arquivo é um candidato ideal para ser gerado por um script (`pnpm gen:gql:manifests`) que escaneie o diretório `resolvers`, garantindo que o manifesto esteja sempre sincronizado.
 * - ((Vigente)) **Tipado Fuerte de Resolvers:** Com a implementação de `graphql-codegen`, o tipo de `resolvers` pode ser estritamente validado contra o schema gerado (`IResolvers`), garantindo que cada resolver tenha a assinatura correta e prevenindo erros em tempo de compilação.
 */
// src/graphql/resolvers/index.ts
