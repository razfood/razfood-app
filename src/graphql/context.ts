// src/graphql/context.ts
/**
 * @file Construye y define el contexto para las peticiones de Apollo Server.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es el corazón de la lógica de negocio de la API. Para
 *              cada petición, obtiene la sesión del usuario autenticado e inicializa
 *              Dataloaders para optimizar las consultas a la base de datos,
 *              resolviendo el problema N+1.
 */

import { type NextRequest } from 'next/server';
import { type User } from '@supabase/supabase-js';
import Dataloader from 'dataloader';

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { getUsersByIds } from '@/lib/data/users/batch.data';
import { type Tables } from '@/lib/types/database';

/**
 * @public
 * @interface GqlContext
 * @description Define la forma del objeto de contexto que estará disponible en todos los resolvers.
 */
export interface GqlContext {
  user: User | null;
  loaders: {
    userLoader: Dataloader<string, Tables<'profiles'> | null>;
    // Futuros loaders (workspaceLoader, siteLoader) se añadirán aquí.
  };
}

/**
 * @public
 * @async
 * @function getGqlContext
 * @description Factoría que construye el objeto de contexto para una petición GraphQL.
 * @param {NextRequest} _req - El objeto de la petición (actualmente no utilizado).
 * @returns {Promise<GqlContext>} El objeto de contexto construido.
 */
export async function getGqlContext(_req: NextRequest): Promise<GqlContext> {
  logger.trace('[GQL.Context] Construyendo contexto para la petición.');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userLoader = new Dataloader<string, Tables<'profiles'> | null>(
    async (ids: readonly string[]) => await getUsersByIds(ids as string[]),
  );

  return {
    user,
    loaders: {
      userLoader,
    },
  };
}

/**
 * @module graphql-context
 * @description Módulo de contexto para Apollo Server.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Implementação de Dataloaders Adicionais:** A próxima melhoria lógica é criar e integrar `Dataloaders` para as outras entidades frequentemente acessadas, como `workspaces` e `sites`, para otimizar ainda mais as consultas aninhadas.
 * - ((Vigente)) **Injeção do Cliente Supabase:** Em vez de criar um novo cliente Supabase aqui e potencialmente em cada função de dados, o cliente Supabase poderia ser criado uma vez e injetado no contexto (`context.db`) para ser reutilizado por todos os resolvers e funções de dados.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Otimização N+1 Ativada:** O `userLoader` agora está totalmente funcional, consumindo a função de "batch fetching" `getUsersByIds`. Isso resolve proativamente o problema de consultas N+1 para perfis de usuário em toda a API.
 * - ((Implementada)) **Contexto Funcional:** O módulo agora fornece um contexto completo e pronto para produção, com autenticação e otimização de dados, pronto para ser injetado no servidor Apollo.
 */
// src/graphql/context.ts
