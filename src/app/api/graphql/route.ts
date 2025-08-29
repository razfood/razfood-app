// src/app/api/graphql/route.ts
/**
 * @file Punto de entrada y orquestador para la API de GraphQL de Restoralia.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato actúa como un ensamblador de élite. Ya no se acopla a
 *              archivos individuales, sino que consume manifiestos (barrel files)
 *              para los schemas y resolvers, adhiriéndose al Principio de Abierto/Cerrado.
 *              Construye e inicia el servidor Apollo con el contexto de la aplicación.
 */

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';

import { typeDefs } from '@/graphql/schemas'; // Consumo de manifiesto de schemas
import { resolvers } from '@/graphql/resolvers'; // Consumo de manifiesto de resolvers
import { getGqlContext, GqlContext } from '@/graphql/context';
import { logger } from '@/lib/logger';

const server = new ApolloServer<GqlContext>({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
});

const handler = startServerAndCreateNextHandler<NextRequest, GqlContext>(server, {
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
 * - ((Vigente)) **Geração de Tipos a partir do Schema:** Implementar uma ferramenta como `graphql-codegen` para gerar automaticamente os tipos de TypeScript a partir do esquema GraphQL combinado. Isso eliminará a necessidade de tipar manualmente os resolvers e garantirá 100% de segurança de tipos entre o schema e a implementação.
 * - ((Vigente)) **Tratamento de Erros de Élite:** Implementar um `formatError` personalizado na configuração do `ApolloServer` para padronizar as respostas de erro, remover stack traces em produção e registrar falhas persistentes usando o `createPersistentErrorLog`, centralizando o manejo de erros da API.
 * - ((Vigente)) **Suporte para Subscriptions (WebSockets):** Integrar a lógica necessária para suportar GraphQL Subscriptions sobre WebSockets, permitindo a comunicação em tempo real iniciada pelo servidor e completando a visão da arquitetura.
 */
// src/app/api/graphql/route.ts
