// src/app/api/graphql/route.ts
/**
 * @file Punto de entrada y orquestador para la API de GraphQL de Restoralia.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.1.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato actúa como un ensamblador que importa y fusiona módulos
 *              de schemas y resolvers, e inyecta el contexto de la aplicación,
 *              para construir el servidor Apollo.
 */

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { mergeResolvers } from '@graphql-tools/merge';

import { workspaceTypeDefs } from '@/graphql/schemas/workspace.schema';
import { siteTypeDefs } from '@/graphql/schemas/site.schema';
import { productTypeDefs } from '@/graphql/schemas/product.schema';
import { orderTypeDefs } from '@/graphql/schemas/order.schema';

import { workspaceResolvers } from '@/graphql/resolvers/workspace.resolver';
import { siteResolvers } from '@/graphql/resolvers/site.resolver';
import { productResolvers } from '@/graphql/resolvers/product.resolver';
import { orderResolvers } from '@/graphql/resolvers/order.resolver';

import { logger } from '@/lib/logger';
import { getGqlContext } from '@/graphql/context';

const baseTypeDefs = `#graphql
  type Query
  type Mutation
`;

const typeDefs = [baseTypeDefs, workspaceTypeDefs, siteTypeDefs, productTypeDefs, orderTypeDefs];

const resolvers = mergeResolvers([workspaceResolvers, siteResolvers, productResolvers, orderResolvers]);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => await getGqlContext(req),
});

logger.info('[GQL.Server] Servidor Apollo ensamblado y contextualizado. Listo para operar.');

export { handler as GET, handler as POST };

/**
 * @module graphql-api-endpoint
 * @description Fundación de la API de GraphQL de Restoralia.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Geração de Tipos a partir do Schema:** Implementar uma ferramenta como `graphql-codegen` para gerar automaticamente os tipos de TypeScript a partir do esquema GraphQL combinado, garantindo 100% de segurança de tipos.
 * - ((Vigente)) **Tratamento de Erros de Élite:** Implementar um `formatError` personalizado na configuração do `ApolloServer` para padronizar as respostas de erro e registrar falhas persistentes.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Injeção de Contexto (Auth & Dataloaders):** O endpoint agora invoca `getGqlContext` a cada requisição, injetando a sessão do usuário e os `Dataloaders` em todos os resolvers. Isso ativa a camada de autorização e a otimização de consultas N+1.
 */
// src/app/api/graphql/route.ts
