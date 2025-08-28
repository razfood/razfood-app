// src/lib/graphql/server-client.ts
'use server';
import 'server-only';

/**
 * @file Cliente GraphQL soberano para el entorno de servidor.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato proporciona una función de élite para ejecutar
 *              queries y mutaciones de GraphQL desde el servidor (Server Actions,
 *              Route Handlers), inyectando automáticamente la autenticación del usuario.
 */

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

// La URL absoluta de nuestro propio endpoint de GraphQL.
const GQL_ENDPOINT = process.env.NEXT_PUBLIC_SITE_URL + '/api/graphql';

/**
 * @public
 * @async
 * @function executeGraphql
 * @description Ejecuta una operación GraphQL (query o mutation) contra nuestra propia API.
 * @template T - El tipo de datos esperado en la respuesta.
 * @param {object} params - Los parámetros de la operación.
 * @param {string} params.query - El documento GraphQL de la query o mutación.
 * @param {Record<string, any>} [params.variables] - Las variables para la operación.
 * @returns {Promise<T>} Los datos de la respuesta.
 * @throws {Error} Si la respuesta de la API indica errores GraphQL.
 */
export async function executeGraphql<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<T> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (session) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  logger.trace('[GQL.Client] Ejecutando operación GraphQL desde el servidor.', { query: query.substring(0, 80) });

  const response = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    // Deshabilitar caché para mutaciones y queries de datos dinámicos.
    cache: 'no-store',
  });

  const result = await response.json();

  if (result.errors) {
    logger.error('[GQL.Client] La API de GraphQL devolvió errores.', { errors: result.errors });
    // Lanzar el primer error para ser capturado por la Server Action.
    throw new Error(result.errors[0].message || 'Error en la API de GraphQL.');
  }

  return result.data;
}

/**
 * @module graphql-server-client
 * @description Cliente para consumir la API de GraphQL desde el servidor.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tipado Automático de Operações:** Integrar `graphql-codegen` para gerar hooks e funções de cliente tipo-seguros diretamente a partir das nossas queries. Isso eliminaria a necessidade de escrever queries como strings e de tipar manualmente a resposta `T`.
 * - ((Vigente)) **Manejo de Erros Estruturado:** Em vez de lançar apenas a mensagem de erro, a função poderia lançar um erro personalizado (`GraphQLError`) que inclua os `extensions` (como o código de erro) retornados pela API, permitindo um manejo de erros mais granular nas Server Actions.
 */
// src/lib/graphql/server-client.ts
