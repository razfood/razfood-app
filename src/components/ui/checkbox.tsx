// src/components/ui/checkbox.tsx
'use client';

/**
 * @file Componente de UI atómico para casillas de verificación.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Una adaptación del componente Checkbox de shadcn/ui, basado en
 *              Radix UI para una accesibilidad y funcionalidad de élite. Permite
 *              al usuario seleccionar una o más opciones de un conjunto.
 */

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @public
 * @component Checkbox
 * @description Un control que permite al usuario alternar entre un estado marcado y
 *              desmarcado. Esencial para tablas de datos con selección de filas y formularios.
 * @param {React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>} props - Propiedades nativas del checkbox de Radix UI.
 * @returns {React.ReactElement}
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

/**
 * @module Checkbox
 * @description Componente de casilla de verificación.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Variantes de Estilo:** Adicionar variantes (`variant`, `size`) usando `class-variance-authority` para permitir diferentes estilos (ex: `destructive`, `subtle`) e tamanhos, aumentando a flexibilidade do componente para diferentes contextos de UI.
 * - ((Vigente)) **Checkbox com Rótulo:** Criar um componente composto `LabelledCheckbox` que encapsule este `Checkbox` e um `Label`, associando-os corretamente com `htmlFor` e `id`. Isto melhoraria a acessibilidade (a11y) e a Developer Experience (DX) ao construir formulários.
 * - ((Vigente)) **Estado Indeterminado:** Explorar a estilização explícita do estado `indeterminate` (comum em checkboxes de "selecionar tudo" em árvores ou tabelas) para fornecer um feedback visual mais claro.
 */
// src/components/ui/checkbox.tsx
