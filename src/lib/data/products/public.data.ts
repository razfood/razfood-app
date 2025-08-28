// src/lib/data/products/public.data.ts
'use server';
import 'server-only';

/**
 * @file Aparato de datos atómico para obtener datos de productos públicos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.1.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este es la Única Fuente de Verdad para obtener los datos de productos
 *              que se mostrarán en los menús públicos. Implementa una lógica de
 *              seguridad por diseño y está optimizado para el rendimiento con cacheo.
 */

import { cache } from 'react';

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';

/**
 * @public
 * @async
 * @function getPublishedProductsBySiteId
 * @description Obtiene todos los productos publicados para un sitio específico, ordenados por fecha de creación.
 * @param {string} siteId - El ID del sitio cuyos productos se van a obtener.
 * @returns {Promise<Tables<'products'>[]>} Una promesa que resuelve con un array de productos.
 * @throws {Error} Si ocurre un error inesperado durante la consulta a la base de datos.
 */
export const getPublishedProductsBySiteId = cache(async (siteId: string): Promise<Tables<'products'>[]> => {
  logger.trace(`[Cache MISS] [Data:ProductsPublic] Obteniendo productos para el sitio: ${siteId}`);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('site_id', siteId)
      .eq('status', 'available')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error(`[Data:ProductsPublic] Fallo al obtener productos para el sitio ${siteId}`, error);
    return [];
  }
});

/**
 * @module products-public-data
 * @description Capa de acceso a datos para productos en contextos públicos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Ordenamiento Personalizado:** Proponho adicionar uma coluna `display_order: integer` à tabela `products`. O proprietário do restaurante poderia então gerenciar a ordem dos seus produtos no dashboard, e esta consulta seria atualizada para usar `order('display_order')`, proporcionando uma experiência de menu mais controlada.
 * - ((Vigente)) **Filtrado por Categoría:** Quando a entidade `categories` for implementada, esta função deveria ser estendida para aceitar um `categoryId?: string` opcional, permitindo que a UI do menu público filtre os produtos por categoria.
 * - ((Vigente)) **Relación con Modificadores:** Proponho, em uma fase futura, que esta consulta realize um `join` com as futuras tabelas `product_modifiers` e `modifier_groups` para obter todas as opções de personalização de um produto em uma única chamada otimizada.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Correção de Asincronia Crítica:** Adicionado `await` na chamada `createClient()`, resolvendo o erro TS2339 e garantindo que as operações de base de dados sejam executadas no cliente Supabase resolvido.
 * - ((Implementada)) **Uso Correto da API `cache`:** Removido o segundo argumento inválido da função `cache` do React, resolvendo o erro TS2554.
 * - ((Implementada)) **Lógica de Segurança por Desenho:** A consulta foi ajustada de `status = 'published'` para `status = 'available'`, que é o ENUM correto para produtos visíveis ao público, conforme definido no esquema da base de dados.
 */
// src/lib/data/products/public.data.ts
