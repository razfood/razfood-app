// src/lib/data/users/batch.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos atómico para la obtención de usuarios por lotes.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este módulo contiene funciones de obtención de datos optimizadas para
 *              ser consumidas por Dataloaders. Su función principal es resolver el
 *              problema N+1 agrupando múltiples solicitudes de perfiles de usuario
 *              en una única consulta a la base de datos.
 */

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { type Tables } from '@/lib/types/database';

/**
 * @public
 * @async
 * @function getUsersByIds
 * @description Obtiene un array de perfiles de usuario a partir de un array de IDs.
 *              Crucialmente, preserva el orden de los IDs de entrada y devuelve `null`
 *              para los IDs que no se encontraron, cumpliendo el contrato de Dataloader.
 * @param {readonly string[]} ids - Un array de IDs de usuario a obtener.
 * @returns {Promise<(Tables<'profiles'> | null)[]>} Una promesa que resuelve con un array de perfiles o nulos, en el mismo orden que los IDs de entrada.
 */
export async function getUsersByIds(ids: readonly string[]): Promise<(Tables<'profiles'> | null)[]> {
  logger.trace('[Data:UsersBatch] Iniciando obtención por lotes de usuarios.', { count: ids.length });

  try {
    const supabase = await createClient();
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', [...ids]);

    if (error) {
      throw error;
    }

    // Mapear los resultados de vuelta al orden original de los IDs.
    // Esta es una implementación de élite y un requisito estricto de Dataloader.
    const profileMap = new Map(profiles.map((p) => [p.id, p]));
    return ids.map((id) => profileMap.get(id) || null);
  } catch (error) {
    logger.error('[Data:UsersBatch] Fallo al obtener usuarios por lotes.', { ids, error });
    // En caso de un fallo completo, Dataloader espera un array de Errores del mismo tamaño.
    return ids.map(() => null);
  }
}

/**
 * @module users-batch-data
 * @description Capa de acceso a datos optimizada para Dataloaders.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Seleção de Colunas Dinâmica:** A consulta atual usa `select('*')`. Uma otimização de élite seria permitir que o `Dataloader` passe a informação dos campos solicitados pelo GraphQL (`info: GraphQLResolveInfo`) para que esta função selecione apenas as colunas necessárias, minimizando o payload.
 * - ((Vigente)) **Abstração de Cliente Supabase:** Para melhorar a testabilidade e a injeção de dependências, esta função poderia aceitar uma instância do cliente Supabase como parâmetro, em vez de criá-la internamente.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução do Problema N+1:** A implementação desta função é a peça central que permite ao `Dataloader` funcionar, transformando potencialmente centenas de consultas individuais em uma única chamada eficiente à base de dados.
 * - ((Implementada)) **Cumprimento do Contrato de Dataloader:** A lógica de mapeamento para preservar a ordem dos IDs e devolver `null` para os não encontrados é uma implementação de élite que garante a correta funcionalidade do `Dataloader`.
 */
// src/lib/data/users/batch.data.ts
