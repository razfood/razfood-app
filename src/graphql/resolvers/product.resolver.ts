// src/graphql/resolvers/product.resolver.ts
/**
 * @file Implementa los resolvers para el dominio de Product (Ítem de Menú).
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
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
import { createProductAction } from '@/lib/actions/products/create.action';
import { type Tables } from '@/lib/types/database';

export const productResolvers = {
  Query: {
    /**
     * @description Obtiene los productos para un menú (site) específico, si el usuario tiene acceso.
     * @throws {GraphQLError} Si el usuario no está autenticado o no tiene permisos para ver el sitio.
     */
    productsForSite: async (_: unknown, { siteId }: { siteId: string }, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] productsForSite: Iniciando obtención para site ID: ${siteId}`);
      const { user } = context;

      if (!user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      // Validar que el usuario tiene acceso al sitio.
      const site = await getSiteByIdForMember(siteId, user.id);
      if (!site) {
        throw new GraphQLError('Sitio no encontrado o acceso denegado.', { extensions: { code: 'NOT_FOUND' } });
      }

      // TODO: Implementar paginación en el schema y pasar los argumentos aquí.
      const { products } = await getProductsForSite(siteId, 1, 100);
      return products;
    },
    /**
     * @description Obtiene un producto específico por su ID, si el usuario tiene acceso.
     * @throws {GraphQLError} Si el usuario no está autenticado, o si el producto no se encuentra o el usuario no tiene acceso.
     */
    product: async (_: unknown, { id }: { id: string }, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] product: Iniciando obtención para ID: ${id}`);
      const { user } = context;

      if (!user) {
        throw new GraphQLError('Usuario no autenticado.', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const product = await getProductByIdForMember(id, user.id);

      if (!product) {
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
    createProduct: async (
      _: unknown,
      { input }: { input: { siteId: string; name: string; price: number; description?: string } },
    ) => {
      logger.trace('[GQL.Resolver] createProduct: Delegando a createProductAction.');
      const formData = new FormData();
      formData.append('siteId', input.siteId);
      formData.append('name', input.name);
      formData.append('price', String(input.price));
      if (input.description) formData.append('description', input.description);

      const result = await createProductAction(formData);

      if (!result.success) {
        throw new GraphQLError(result.error, {
          extensions: { code: 'BAD_USER_INPUT', errorDetails: result.data },
        });
      }
      // La action devuelve { id }, necesitamos el objeto completo.
      const newProduct = await getProductByIdForMember(result.data.id, 'user-placeholder'); // TODO: Obtener userId del contexto
      return newProduct;
    },
  },
  Product: {
    /**
     * @description Resuelve el campo anidado `site` para un producto.
     */
    site: async (parent: Tables<'products'>, _: unknown, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] Product.site: Resolviendo para producto ${parent.id}`);
      const { user } = context;
      if (!user) return null;
      // TODO: Usar Dataloader en el futuro
      return await getSiteByIdForMember(parent.site_id, user.id);
    },
    /**
     * @description Resuelve el campo anidado `createdBy` para un producto.
     */
    createdBy: async (parent: Tables<'products'>, _: unknown, context: GqlContext) => {
      logger.trace(`[GQL.Resolver] Product.createdBy: Resolviendo para producto ${parent.id} via Dataloader.`);
      if (!parent.created_by) return null;
      return await context.loaders.userLoader.load(parent.created_by);
    },
  },
};

/**
 * @module product-resolver
 * @description Módulo de resolvers GraphQL para la entidad Product.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Paginação no Schema GraphQL:** A melhoria mais crítica é atualizar o `product.schema.ts` para que a query `productsForSite` aceite argumentos de paginação (`limit`, `page`). Isso permitirá que este resolver passe os argumentos para a camada de dados e implemente uma paginação real.
 * - ((Vigente)) **Mutaciones de `updateProduct` y `deleteProduct`:** Completar o ciclo CRUD criando as Server Actions e as mutações GraphQL correspondentes para atualizar e excluir produtos.
 * - ((Vigente)) **Injeção de `userId` no Contexto da Mutação:** A mutação `createProduct` atualmente usa um placeholder para o `userId`. É necessário refatorá-la para obter o `userId` do objeto `context` injetado pelo Apollo Server.
 */
// src/graphql/resolvers/product.resolver.ts
