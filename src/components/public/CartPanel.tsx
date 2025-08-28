// src/components/public/CartPanel.tsx
'use client';

/**
 * @file Panel lateral soberano para mostrar y gestionar el carrito de compras.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es un orquestador de UI puro que consume `useCartStore`
 *              para renderizar el estado del carrito en tiempo real. Proporciona
 *              funcionalidades para que el usuario modifique las cantidades o elimine
 *              ítems, y vea el total del pedido.
 */

import { useTranslations } from 'next-intl';
import { ShoppingCart, Trash2 } from 'lucide-react';

import { useCartStore, type CartItem } from '@/stores/useCartStore';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Link } from '@/lib/navigation';
import { formatMoney } from '@/utils/paddle/parse-money';
import { clientLogger } from '@/lib/logger';

interface CartPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * @private
 * @component CartItemRow
 * @description Renderiza una única fila de producto dentro del panel del carrito.
 */
const CartItemRow = ({ item }: { item: CartItem }) => {
  const { updateItemQuantity, removeItem } = useCartStore();
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex-grow">
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-muted-foreground">{formatMoney(item.price, 'USD')}</p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value, 10) || 1)}
          className="h-9 w-16 text-center"
        />
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => removeItem(item.id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
    </div>
  );
};

/**
 * @public
 * @component CartPanel
 * @description Renderiza el panel lateral del carrito de compras.
 */
export function CartPanel({ isOpen, onOpenChange }: CartPanelProps): React.ReactElement {
  clientLogger.trace('[CartPanel] Renderizando panel de carrito.', { isOpen });
  const t = useTranslations('CartPanel');
  const { items, totalPrice, totalItems } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{t('title')}</SheetTitle>
          <SheetDescription>{t('description', { count: totalItems })}</SheetDescription>
        </SheetHeader>
        <Separator />
        {items.length > 0 ? (
          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="font-semibold">{t('empty.title')}</p>
            <p className="text-sm text-muted-foreground">{t('empty.description')}</p>
          </div>
        )}
        <Separator />
        <SheetFooter className="mt-auto">
          <div className="w-full space-y-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>{t('subtotal')}</span>
              <span>{formatMoney(totalPrice, 'USD')}</span>
            </div>
            <Button size="lg" className="w-full" asChild disabled={items.length === 0}>
              <Link href="/checkout">{t('checkoutButton')}</Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/**
 * @module CartPanel
 * @description Panel lateral del carrito de compras.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Abstração de `CartItemRow`:** O componente interno `CartItemRow` é um candidato perfeito para ser extraído para seu próprio arquivo atómico (`src/components/public/CartItemRow.tsx`). Isso melhoraria ainda mais a organização do código e o cumprimento do SRP.
 * - ((Vigente)) **Feedback Visual para Ações:** Adicionar um feedback visual (ex: um spinner ou uma mudança de cor temporária) na `CartItemRow` quando a quantidade está sendo atualizada, proporcionando uma UX mais responsiva.
 * - ((Vigente)) **Componente `CartTriggerButton`:** Criar um componente de botão flutuante (`CartTriggerButton.tsx`) que mostre o número total de itens no carrinho (`totalItems` do store) e controle o estado `isOpen` deste painel. Isso desacoplará completamente a lógica de abertura/fechamento do painel da página principal.
 */
// src/components/public/CartPanel.tsx
