// src/lib/data/products/dashboard.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos atómico para consultas de productos en contextos autenticados.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta es la Única Fuente de Verdad para obtener datos de productos
 *              para el dashboard o la API, donde los permisos ya han sido validados.
 *              Incluye lógica de paginación y búsqueda.
 */

import { cache } from 'react';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';

/**
 * @public
 * @async
 * @function getProductsForSite
 * @description Obtiene una página de productos para un sitio específico, con soporte para búsqueda.
 * @param {string} siteId - El ID del sitio.
 * @param {number} page - El número de página a obtener.
 * @param {number} limit - El número de ítems por página.
 * @param {string} [query] - El término de búsqueda opcional.
 * @returns {Promise<{ products: Tables<'products'>[]; totalCount: number }>} Un objeto con los productos de la página y el conteo total.
 */
export const getProductsForSite = cache(
  async (
    siteId: string,
    page: number,
    limit: number,
    query?: string,
  ): Promise<{ products: Tables<'products'>[]; totalCount: number }> => {
    logger.trace(`[Cache MISS] [Data:ProductsDashboard] Obteniendo productos para sitio: ${siteId}`, {
      page,
      limit,
      query,
    });
    try {
      const supabase = await createClient();
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let queryBuilder = supabase.from('products').select('*', { count: 'exact' }).eq('site_id', siteId);

      if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
      }

      const { data, error, count } = await queryBuilder.order('created_at', { ascending: false }).range(from, to);

      if (error) throw error;

      return { products: data || [], totalCount: count || 0 };
    } catch (error) {
      logger.error(`[Data:ProductsDashboard] Fallo al obtener productos para el sitio ${siteId}`, error);
      return { products: [], totalCount: 0 };
    }
  },
);

/**
 * @public
 * @async
 * @function getProductByIdForMember
 * @description Obtiene un producto por ID, solo si el usuario es miembro del workspace contenedor.
 * @param {string} productId - El ID del producto.
 * @param {string} userId - El ID del usuario que debe ser miembro.
 * @returns {Promise<Tables<'products'> | null>} El producto si se encuentra y el usuario tiene acceso, de lo contrario null.
 */
export const getProductByIdForMember = cache(
  async (productId: string, userId: string): Promise<Tables<'products'> | null> => {
    logger.trace(`[Cache MISS] [Data:ProductsDashboard] Obteniendo producto ${productId} para miembro ${userId}`);
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, sites!inner(workspace_members!inner(user_id))')
        .eq('id', productId)
        .eq('sites.workspace_members.user_id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') throw error;
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sites, ...productData } = data;
      return productData as Tables<'products'>;
    } catch (error) {
      logger.error(
        `[Data:ProductsDashboard] Fallo al obtener el producto ${productId} para el miembro ${userId}`,
        error,
      );
      return null;
    }
  },
);

/**
 * @module products-dashboard-data
 * @description Capa de acceso a datos para productos en contextos autenticados.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Filtros y Ordenamiento Avanzados:** Estender a função `getProductsForSite` para aceitar parâmetros `status` e `sortBy`. Isso permitirá que a UI filtre produtos por seu estado (disponível, esgotado) e ordene por nome ou preço, movendo essa lógica para a consulta da base de dados para máxima eficiência.
 * - ((Vigente)) **Função de Batch para Dataloader:** Criar uma função `getProductsByIds(ids: string[])` para ser consumida por um futuro `productLoader` no contexto GraphQL, otimizando a resolução de `order_items`.
 */
// src/lib/data/products/dashboard.data.ts
