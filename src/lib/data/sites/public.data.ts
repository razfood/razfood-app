// src/lib/data/sites/public.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos atómico para obtener datos de sitios (menús) públicos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta es la Única Fuente de Verdad para obtener los datos de un menú
 *              público a través de su subdominio. Implementa lógica de seguridad por
 *              diseño y está optimizado para el rendimiento con `React.cache`.
 */

import { cache } from 'react';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';

/**
 * @public
 * @async
 * @function getSiteBySubdomain
 * @description Obtiene los datos de un único sitio (menú) que esté publicado, a partir de su subdominio.
 * @param {string} subdomain - El subdominio del sitio a buscar.
 * @returns {Promise<Tables<'sites'> | null>} Una promesa que resuelve con los datos del sitio o `null` si no se encuentra, no está publicado o ocurre un error.
 */
export const getSiteBySubdomain = cache(async (subdomain: string): Promise<Tables<'sites'> | null> => {
  logger.trace(`[Cache MISS] [Data:SitesPublic] Obteniendo sitio por subdominio: ${subdomain}`);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('status', 'published') // Regla de negocio de seguridad: solo menús publicados
      .single();

    if (error) {
      // El código PGRST116 indica que no se encontró ninguna fila, lo cual es un resultado esperado.
      if (error.code !== 'PGRST116') {
        throw error;
      }
      logger.trace(`[Data:SitesPublic] No se encontró un sitio publicado con el subdominio: ${subdomain}`);
      return null;
    }

    return data;
  } catch (error) {
    logger.error(`[Data:SitesPublic] Fallo al obtener sitio por subdominio ${subdomain}`, error);
    return null;
  }
});

/**
 * @module sites-public-data
 * @description Capa de acceso a datos para sitios (menús) en contextos públicos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Consulta Unificada con Productos:** Proponho, para uma otimização de performance de élite, criar uma função `getPublicSiteWithProducts` que utilize a capacidade do Supabase para realizar um `join` e obter tanto os dados do site quanto a lista de seus produtos publicados em uma única chamada à base de dados, evitando "network waterfalls".
 * - ((Vigente)) **Soporte para Dominios Personalizados:** A consulta atual busca apenas por `subdomain`. Proponho estender a lógica para que também possa resolver um site a partir de sua coluna `custom_domain`, uma funcionalidade essencial para clientes de planos superiores.
 * - ((Vigente)) **Tipado de Retorno Específico:** A consulta atual retorna `Tables<'sites'>`, que inclui campos que podem não ser necessários na página pública (ex: `owner_id`). Proponho criar um tipo `PublicSite` com um subconjunto de campos para uma camada de dados mais segura e explícita.
 */
// src/lib/data/sites/public.data.ts
