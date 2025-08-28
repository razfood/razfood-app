// src/components/public/CartTrigger.tsx
'use client';

/**
 * @file Botón flotante soberano que activa el panel del carrito de compras.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato actúa como el punto de entrada visual para el carrito.
 *              Muestra el número total de ítems y gestiona el estado de visibilidad
 *              del `CartPanel`. Consume `useCartStore` de forma optimizada.
 */

import { useTranslations } from 'next-intl';
import { ShoppingCart } from 'lucide-react';

import { useCartStore } from '@/stores/useCartStore';
import { useDialogState } from '@/lib/hooks/ui/useDialogState';
import { Button } from '@/components/ui/button';
import { CartPanel } from './CartPanel';
import { clientLogger } from '@/lib/logger';

/**
 * @public
 * @component CartTrigger
 * @description Renderiza un botón flotante para abrir el panel del carrito y muestra un badge con el conteo de ítems.
 * @returns {React.ReactElement}
 */
export function CartTrigger(): React.ReactElement {
  clientLogger.trace('[CartTrigger] Renderizando gatillo del carrito.');
  const t = useTranslations('PublicMenu');
  const { isOpen, open, setIsOpen } = useDialogState();
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <>
      <Button
        aria-label={t('openCartAriaLabel', { count: totalItems })}
        onClick={open}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
      >
        <ShoppingCart className="h-7 w-7" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {totalItems}
          </span>
        )}
      </Button>
      <CartPanel isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

/**
 * @module CartTrigger
 * @description Componente de UI para activar y controlar el panel del carrito.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Animação no Badge:** Proponho adicionar uma animação sutil (ex: um "pop" com `framer-motion`) ao badge numérico sempre que o `totalItems` for alterado, fornecendo um feedback visual mais forte ao usuário quando ele adiciona um item.
 * - ((Vigente)) **Posicionamento Configurável:** Adicionar props para controlar a posição do botão (ex: `position="bottom-left"`), tornando o componente ainda mais reutilizável em diferentes layouts.
 * - ((Vigente)) **Tooltip Informativo:** Adicionar um `Tooltip` ao botão que mostre o `totalPrice` do carrinho ao passar o mouse, fornecendo informação contextual sem a necessidade de abrir o painel.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Desacoplamento de Lógica:** A lógica para controlar a visibilidade do painel do carrinho foi completamente extraída para este componente, limpando a responsabilidade do `PublicMenuView`.
 * - ((Implementada)) **Subscrição de Estado Otimizada:** O componente consome `useCartStore` de forma seletiva, garantindo que ele só seja re-renderizado quando o número total de itens mudar, o que é uma prática de performance de élite.
 */
// src/components/public/CartTrigger.tsx
