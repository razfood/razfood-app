// src/components/orders/OrderCard.tsx
'use client';

/**
 * @file Componente atómico para renderizar una tarjeta de pedido en el tablero Kanban.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
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

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type DashboardOrder } from '@/lib/data/orders/dashboard.data';
import { formatMoney } from '@/utils/paddle/parse-money';
import { type Tables } from '@/lib/types/database';

dayjs.extend(relativeTime);

type EnrichedOrderItem = DashboardOrder['order_items'][number];

interface OrderCardProps {
  order: DashboardOrder;
}

/**
 * @public
 * @component OrderCard
 * @description Renderiza una tarjeta individual que representa un pedido en el tablero Kanban.
 */
export function OrderCard({ order }: OrderCardProps): React.ReactElement {
  const t = useTranslations('OrdersDashboard.card');
  const locale = useTranslations()('Locale');
  dayjs.locale(locale);

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
 * - ((Vigente)) **Indicador de Tipo de Pedido:** Quando o tipo de pedido (`delivery`, `pickup`, `dine_in`) for adicionado ao modelo de dados `orders`, este cartão deve exibir um ícone correspondente para uma identificação visual rápida.
 * - ((Vigente)) **Menu de Ações Contextuais:** Adicionar um `DropdownMenu` na tarjeta com ações relevantes para o estado do pedido, como "Imprimir Comprovante", "Atribuir Entregador" ou "Marcar como Pronto para Retirada".
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Tipado Estrito (TS7006 Resolvido):** Adicionado tipado explícito `EnrichedOrderItem` ao parâmetro da função `.map()`, eliminando o erro de `any` implícito e garantindo a segurança de tipos.
 * - ((Implementada)) **Dados Reais na UI:** O componente agora consome a estrutura de dados aninhada e enriquecida, exibindo os nomes reais dos produtos no resumo do pedido, tornando a UI significativamente mais útil.
 */
// src/components/orders/OrderCard.tsx
