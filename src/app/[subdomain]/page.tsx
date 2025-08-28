// src/app/[subdomain]/page.tsx
'use server';

/**
 * @file Orquestador de servidor para las páginas de menú públicas y dinámicas.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este Server Component es el punto de entrada para las rutas basadas en
 *              subdominios. Obtiene los datos del menú y sus productos y ensambla la
 *              vista del cliente completamente funcional, incluyendo el menú interactivo
 *              y el disparador del carrito de compras.
 */

import { notFound } from 'next/navigation';
import { getSiteBySubdomain } from '@/lib/data/sites/public.data';
import { getPublishedProductsBySiteId } from '@/lib/data/products/public.data';
import { PublicMenuView } from '@/components/public/PublicMenuView';
import { CartTrigger } from '@/components/public/CartTrigger';
import { logger } from '@/lib/logger';

interface PublicSitePageProps {
  params: { subdomain: string };
}

export default async function PublicSitePage({ params }: PublicSitePageProps) {
  const { subdomain } = params;
  logger.trace(`[PublicSitePage:Server] Iniciando render para subdominio: ${subdomain}`);

  const site = await getSiteBySubdomain(subdomain);

  if (!site) {
    logger.warn(
      `[PublicSitePage:Server] Sitio no encontrado o no publicado para subdominio: ${subdomain}. Renderizando 404.`,
    );
    notFound();
  }

  const products = await getPublishedProductsBySiteId(site.id);

  logger.info(
    `[PublicSitePage:Server] Sitio y ${products.length} productos encontrados. Ensamblando vista de cliente.`,
  );

  return (
    <>
      <PublicMenuView site={site} products={products} />
      <CartTrigger />
    </>
  );
}

/**
 * @module public-site-page
 * @description Orquestador de servidor para la vista pública de un menú.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Metadatos Dinámicos:** Proponho implementar a função `generateMetadata` de Next.js neste arquivo. Ela usará `getSiteBySubdomain` para obter o nome e a descrição do site, gerando tags `<title>` e `<meta name="description">` dinâmicas e otimizadas para SEO.
 * - ((Vigente)) **Soporte para Dominios Personalizados:** Proponho estender este componente para que também possa lidar com domínios personalizados, lendo o `host` da requisição e consultando a coluna `custom_domain` da tabela `sites`.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Composição de Élite:** O orquestador agora importa e ensambla os componentes de cliente soberanos (`PublicMenuView`, `CartTrigger`), aderindo estritamente ao padrão de separação de responsabilidades entre servidor e cliente.
 * - ((Implementada)) **Fluxo de Usuário Completo:** Com a inclusão do `CartTrigger`, o fluxo de "añadir al carrito" e "ver carrito" está agora completo e funcional para o cliente final.
 */
// src/app/[subdomain]/page.tsx
