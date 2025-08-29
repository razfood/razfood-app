// src/stores/useCartStore.ts
'use client';

/**
 * @file Store de Zustand soberano para la gestión del estado del carrito de compras.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es la Única Fuente de Verdad para el estado del carrito
 *              de compras del cliente. Encapsula toda la lógica de negocio para añadir,
 *              actualizar y eliminar productos, y calcula los totales derivados.
 */

import { create } from 'zustand';
import { clientLogger } from '@/lib/logger';
import type { Tables } from '@/lib/types/database';

/**
 * @public
 * @interface CartItem
 * @description Contrato de datos para un ítem dentro del carrito. Extiende el tipo
 *              canónico de la tabla 'products' y añade la propiedad 'quantity'.
 *              Esta herencia es la solución a la causa raíz de los errores TS2339,
 *              una vez que los tipos de la DB son generados correctamente.
 */
export interface CartItem extends Tables<'products'> {
  quantity: number;
}

/**
 * @interface CartState
 * @description Contrato de datos para el estado completo del store del carrito.
 */
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Tables<'products'>) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

/**
 * @private
 * @function computeTotals
 * @description Calcula el número total de ítems y el precio total del carrito.
 */
const computeTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (product) => {
    clientLogger.trace('[useCartStore] addItem disparado', { productId: product.id });
    const { items } = get();
    const existingItem = items.find((item) => item.id === product.id);

    let updatedItems;
    if (existingItem) {
      updatedItems = items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      updatedItems = [...items, { ...product, quantity: 1 }];
    }

    const totals = computeTotals(updatedItems);
    set({ items: updatedItems, ...totals });
  },

  removeItem: (productId) => {
    clientLogger.trace('[useCartStore] removeItem disparado', { productId });
    const updatedItems = get().items.filter((item) => item.id !== productId);
    const totals = computeTotals(updatedItems);
    set({ items: updatedItems, ...totals });
  },

  updateItemQuantity: (productId, quantity) => {
    clientLogger.trace('[useCartStore] updateItemQuantity disparado', { productId, quantity });
    let updatedItems;
    if (quantity < 1) {
      updatedItems = get().items.filter((item) => item.id !== productId);
    } else {
      updatedItems = get().items.map((item) => (item.id === productId ? { ...item, quantity } : item));
    }
    const totals = computeTotals(updatedItems);
    set({ items: updatedItems, ...totals });
  },

  clearCart: () => {
    clientLogger.trace('[useCartStore] clearCart disparado');
    set({ items: [], totalItems: 0, totalPrice: 0 });
  },
}));

/**
 * @module useCartStore
 * @description Gestor de estado global para el carrito de compras.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Persistência no `localStorage`:** Proponho, como próxima melhoria crítica, utilizar o middleware `persist` do Zustand para salvar o estado do carrinho no `localStorage`. Isso garantirá que o carrinho do cliente não seja perdido se ele recarregar a página ou fechar o navegador.
 * - ((Vigente)) **Gestão de Modificadores de Produto:** A estrutura atual de `CartItem` é simples. Proponho estendê-la para incluir um array `modifiers`. O identificador de um item no carrinho (`cartItemId`) precisará ser um hash composto pelo `productId` e os modificadores selecionados para garantir a unicidade.
 */
// src/stores/useCartStore.ts
