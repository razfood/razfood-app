// src/lib/data/products/dashboard.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos atómico para consultas de productos en contextos autenticados.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta es la Única Fuente de Verdad para obtener datos de productos
 *              para el dashboard o la API, donde los permisos ya han sido validados.
 */

import { cache } from 'react';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';

/**
 * @public
 * @async
 * @function getProductsForSite
 * @description Obtiene todos los productos (ítems de menú) para un sitio específico.
 */
export const getProductsForSite = cache(async (siteId: string): Promise<Tables<'products'>[]> => {
  logger.trace(`[Cache MISS] [Data:ProductsDashboard] Obteniendo productos para sitio: ${siteId}`);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(`[Data:ProductsDashboard] Fallo al obtener productos para el sitio ${siteId}`, error);
    return [];
  }
});

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
 * - ((Vigente)) **Paginação:** Para menús com um grande número de produtos, será crucial adicionar paginação à consulta `getProductsForSite`.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Consulta com Autorização Aninhada:** A nova função `getProductByIdForMember` utiliza um `inner join` implícito aninhado do Supabase (`sites!inner(workspace_members!inner(...))`) para combinar a obtenção de dados e a autorização em uma única e eficiente consulta.
 */
// src/lib/data/products/dashboard.data.ts
