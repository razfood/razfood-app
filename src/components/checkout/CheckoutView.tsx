// src/components/checkout/CheckoutView.tsx
'use client';

/**
 * @file Orquestador de UI para la página de checkout.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este Client Component es el ensamblador principal para la página de checkout.
 *              Consume `useCartStore` para renderizar un resumen del pedido en tiempo
 *              real y presenta la estructura para los futuros formularios de pago y envío.
 */

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CreditCard, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useCartStore } from '@/stores/useCartStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/utils/paddle/parse-money';
import { clientLogger } from '@/lib/logger';

/**
 * @public
 * @component CheckoutView
 * @description Renderiza la vista principal y la lógica de cliente para la página de checkout.
 * @returns {React.ReactElement}
 */
export function CheckoutView(): React.ReactElement {
  clientLogger.trace('[CheckoutView] Renderizando vista de checkout.');
  const t = useTranslations('CheckoutPage');
  const router = useRouter();
  const { items, totalPrice } = useCartStore();

  React.useEffect(() => {
    // Redirige si el carrito está vacío al montar el componente.
    if (items.length === 0) {
      router.replace('/'); // Redirige a una página apropiada, como la home.
    }
  }, [items, router]);

  if (items.length === 0) {
    // Muestra un estado de carga o nulo mientras redirige para evitar un flash de contenido.
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <section className="lg:col-span-7">
        <h2 className="text-2xl font-bold tracking-tight">{t('paymentTitle')}</h2>
        <p className="mt-2 text-muted-foreground">{t('paymentDescription')}</p>
        <div className="mt-8">
          {/* Placeholder para el futuro formulario de pago y detalles de envío */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>{t('paymentMethod')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-md">
                <p className="text-muted-foreground">{t('paymentFormPlaceholder')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="lg:col-span-5 mt-16 rounded-lg bg-card border px-4 py-6 sm:p-6 lg:mt-0">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          {t('summaryTitle')}
        </h2>
        <Separator className="my-4" />
        <ul role="list" className="divide-y divide-border">
          {items.map((product) => (
            <li key={product.id} className="flex py-6">
              <div className="flex-shrink-0">
                <Image
                  src={product.image_url || '/assets/placeholder-image.png'}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-md object-cover"
                />
              </div>
              <div className="ml-4 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-base font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('quantity')}: {product.quantity}
                  </p>
                </div>
                <p className="mt-1 text-sm font-medium">{formatMoney(product.price * product.quantity, 'USD')}</p>
              </div>
            </li>
          ))}
        </ul>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between text-base font-medium">
            <p>{t('orderTotal')}</p>
            <p>{formatMoney(totalPrice, 'USD')}</p>
          </div>
        </div>
        <Button className="w-full mt-6" size="lg">
          {t('placeOrderButton')}
        </Button>
      </section>
    </div>
  );
}

/**
 * @module CheckoutView
 * @description Componente de UI para la página de checkout.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Abstração de `OrderSummary`:** A seção de resumo do pedido é um candidato perfeito para ser extraída para seu próprio componente atómico (`src/components/checkout/OrderSummary.tsx`), melhorando a organização e o SRP.
 * - ((Vigente)) **Implementação do Formulário de Pagamento:** Substituir o placeholder por um componente `PaymentForm.tsx` real. Este novo componente soberano se integrará com a SDK do provedor de pagamentos (ex: Stripe Elements) e gerenciará seu próprio estado de formulário.
 * - ((Vigente)) **Conexão com `createOrderAction`:** O botão "Place Order" deverá invocar a futura `createOrderAction`, passando os dados do carrinho (do `useCartStore`) e os detalhes de pagamento (do `PaymentForm`). O estado de `isPending` da ação deve desabilitar o botão e mostrar um spinner.
 */
// src/components/checkout/CheckoutView.tsx
