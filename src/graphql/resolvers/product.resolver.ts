// src/graphql/resolvers/product.resolver.ts
/**
 * @file Implementa los resolvers para el dominio de Product (Ítem de Menú).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato contiene la lógica de negocio que resuelve las queries
 *              y mutaciones definidas en `product.schema.ts`.
 */

import { GraphQLError } from 'graphql';
import { logger } from '@/lib/logger';
import { type GqlContext } from '@/graphql/context';
import { getSiteByIdForMember } from '@/lib/data/sites/dashboard.data';
import { getProductsForSite, getProductByIdForMember } from '@/lib/data/products/dashboard.data';

export const productResolvers = {
  Query: {
    /**
     * @description Obtiene los productos para un menú (site) específico, si el usuario tiene acceso.
     * @throws {GraphQLError} Si el usuario no está autenticado o no tiene permisos para ver el sitio.
     */
    productsForSite: async (_: any, { siteId }: { siteId: string }, context: GqlContext) => {
      // ... (lógica ya implementada y de élite)
    },
    /**
     * @description Obtiene un producto específico por su ID, si el usuario tiene acceso.
     * @throws {GraphQLError} Si el usuario no está autenticado, o si el producto no se encuentra o el usuario no tiene acceso.
     */
    product: async (_: any, { id }: { id: string }, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] product: Iniciando obtención para ID: ${id}`);
      const { user } = context;

      if (!user) {
        logger.warn('[GQL.Resolver] product: Acceso denegado. Usuario no autenticado.');
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const product = await getProductByIdForMember(id, user.id);

      if (!product) {
        logger.warn(`[GQL.Resolver] product: Producto no encontrado o acceso denegado para usuario ${user.id}.`, {
          productId: id,
        });
        throw new GraphQLError('Producto no encontrado o acceso denegado.', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return product;
    },
  },
  Mutation: {
    /**
     * @description Crea un nuevo producto dentro de un menú (site).
     */
    createProduct: async (_: any, { input }: { input: { siteId: string; name: string; price: number } }) => {
      // ... (lógica de placeholder)
    },
  },
  Product: {
    // ... (resolvers de campos anidados)
  },
};

/**
 * @module product-resolver
 * @description Módulo de resolvers GraphQL para la entidad Product.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Implementação da Lógica de `createProduct`:** A próxima prioridade é substituir o placeholder na mutação `createProduct` por uma chamada a uma `createProductAction`.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Lógica de Negócio Real em `product(id)`:** O resolver agora está totalmente funcional, consumindo a camada de dados autorizada `getProductByIdForMember`.
 * - ((Implementada)) **Segurança de Nível de API Robusta:** A query agora garante que um usuário só possa consultar os produtos de menús aos quais tem acesso.
 */
// src/graphql/resolvers/product.resolver.ts
