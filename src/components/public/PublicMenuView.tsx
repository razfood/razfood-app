// src/components/public/PublicMenuView.tsx
'use client';

/**
 * @file Orquestador de UI para la vista pública de un menú (site).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este Client Component es el ensamblador principal para la página que ven
 *              los clientes del restaurante. Recibe los datos del menú y los productos
 *              del servidor, y los combina con la lógica de estado del `useCartStore`
 *              para crear una experiencia de menú interactiva.
 */

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PlusCircle } from 'lucide-react';

import { useCartStore } from '@/stores/useCartStore';
import { type Tables } from '@/lib/types/database';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clientLogger } from '@/lib/logger';
import { formatMoney } from '@/utils/paddle/parse-money';

interface PublicMenuViewProps {
  site: Tables<'sites'>;
  products: Tables<'products'>[];
}

/**
 * @public
 * @component PublicMenuView
 * @description Renderiza la vista pública completa de un menú, incluyendo la lista de productos y la funcionalidad para añadirlos al carrito.
 * @param {PublicMenuViewProps} props - Propiedades que contienen los datos del sitio y los productos.
 * @returns {React.ReactElement}
 */
export function PublicMenuView({ site, products }: PublicMenuViewProps): React.ReactElement {
  clientLogger.trace('[PublicMenuView] Renderizando vista pública del menú.', { siteId: site.id });
  const t = useTranslations('PublicMenu');
  const { addItem } = useCartStore();

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">{site.name}</h1>
        {site.description && <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{site.description}</p>}
      </header>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">{t('emptyState')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-video relative w-full">
                  <Image
                    src={product.image_url || '/assets/placeholder-image.png'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-xl font-semibold mb-2">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <p className="text-lg font-bold text-primary">{formatMoney(product.price, 'USD')}</p>
                <Button onClick={() => addItem(product)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('addToCartButton')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * @module PublicMenuView
 * @description Componente de UI para la visualización del menú público.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Abstração para `ProductCard`:** A lógica de renderização de um produto individual é um candidato perfeito para ser extraída para seu próprio componente atómico `ProductCard.tsx`. Isso limparia este componente orquestrador e melhoraria a reutilização e a testabilidade.
 * - ((Vigente)) **Componente `CartPanel` Flutuante:** Proponho, como próximo passo crítico, criar um componente de painel de carrinho (`CartPanel.tsx`) que seja acionado por um botão flutuante. Este painel consumiria o `useCartStore` para exibir os itens do carrinho, permitindo ao usuário ver e gerenciar seu pedido em tempo real de qualquer lugar na página.
 * - ((Vigente)) **Agrupamento por Categoria:** Quando a entidade `categories` for implementada, este componente deve ser refatorado para agrupar os produtos por categoria, renderizando um cabeçalho para cada uma e melhorando a navegabilidade do menu.
 */
// src/components/public/PublicMenuView.tsx
