// src/components/orders/OrderCard.tsx
'use client';

/**
 * @file Componente atómico para renderizar una tarjeta de pedido en el tablero Kanban.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este es un componente de presentación puro y soberano. Su única
 *              responsabilidad es recibir los datos de un pedido y renderizarlos
 *              de forma clara y concisa para ser utilizado en el dashboard de operaciones.
 */

import React from 'react';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es'; // Importar locales necesarios
import 'dayjs/locale/pt-br';
import 'dayjs/locale/en';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type DashboardOrder } from '@/lib/data/orders/dashboard.data';
import { formatMoney } from '@/utils/paddle/parse-money';
import { clientLogger } from '@/lib/logger';

dayjs.extend(relativeTime);

type EnrichedOrderItem = DashboardOrder['order_items'][number];

interface OrderCardProps {
  order: DashboardOrder;
}

/**
 * @public
 * @component OrderCard
 * @description Renderiza una tarjeta individual que representa un pedido en el tablero Kanban.
 * @param {OrderCardProps} props - Las propiedades del componente.
 * @returns {React.ReactElement}
 */
export function OrderCard({ order }: OrderCardProps): React.ReactElement {
  clientLogger.trace(`[OrderCard] Renderizando tarjeta para pedido: ${order.id}`);
  const t = useTranslations('OrdersDashboard.card');
  const locale = useTranslations()('Locale'); // "en-US", "es-ES", etc.
  dayjs.locale(locale.split('-')[0]); // Usa 'en', 'es', 'pt'

  const timeFromNow = dayjs(order.created_at).fromNow();

  const itemsSummary =
    order.order_items
      .map((item: EnrichedOrderItem) => `${item.quantity}x ${item.products?.name || t('deletedProduct')}`)
      .join(', ') || t('noItems');

  return (
    <Card className="bg-background hover:border-primary/50 transition-colors cursor-grab">
      <CardHeader>
        <CardTitle className="text-base font-bold flex justify-between items-center">
          <span>{t('orderTitle', { id: order.id.substring(0, 8).toUpperCase() })}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs font-normal text-muted-foreground">{timeFromNow}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{dayjs(order.created_at).format('DD MMM YYYY, HH:mm')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>{order.profiles?.full_name || t('anonymousCustomer')}</CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm truncate" title={itemsSummary}>
          {itemsSummary}
        </p>
      </CardContent>
      <Separator className="my-2" />
      <CardFooter className="py-2 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{t('totalLabel')}</span>
        <span className="font-bold">{formatMoney(order.total, 'USD')}</span>
      </CardFooter>
    </Card>
  );
}

/**
 * @module OrderCard
 * @description Componente de UI para una tarjeta de pedido.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Indicador de Tipo de Pedido:** Quando o tipo de pedido (`delivery`, `pickup`, `dine_in`) for adicionado ao modelo de dados `orders`, este cartão deve exibir um ícone correspondente (ex: `Truck`, `ShoppingBag`, `Utensils`) para uma identificação visual rápida no Kanban.
 * - ((Vigente)) **Menu de Ações Contextuais:** Adicionar um `DropdownMenu` na tarjeta com ações relevantes para o estado do pedido, como "Imprimir Comprovante", "Ver Detalhes" (abrindo um modal) ou "Marcar como Pronto para Retirada".
 * - ((Vigente)) **Destaque Visual para Pedidos Atrasados:** Adicionar uma lógica que compare `created_at` com o tempo atual. Se um pedido no estado 'pending' ou 'confirmed' tiver mais de X minutos, a borda do cartão poderia se tornar amarela ou vermelha para alertar a equipe.
 */
// src/components/orders/OrderCard.tsx
