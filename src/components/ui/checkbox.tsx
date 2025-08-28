// src/components/ui/checkbox.tsx
'use client';

/**
 * @file Componente de UI atómico para casillas de verificación.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Una adaptación del componente Checkbox de shadcn/ui, basado en
 *              Radix UI para una accesibilidad y funcionalidad de élite.
 */

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

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
 * - ((Vigente)) **Variantes de Estilo:** Adicionar variantes (`variant`, `size`) usando `class-variance-authority` para permitir diferentes estilos (ex: `destructive`, `subtle`) e tamanhos, aumentando a flexibilidade do componente.
 * - ((Vigente)) **Checkbox com Rótulo:** Criar um componente composto `LabelledCheckbox` que encapsule este `Checkbox` e um `Label`, associando-os corretamente com `htmlFor` e `id` para uma melhor acessibilidade e DX.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Dependência Crítica (TS2307):** A criação deste componente resolve uma dependência fundamental que impedia a compilação do módulo `campaigns-columns`.
 * - ((Implementada)) **Fundação de UI Atómica:** Adiciona uma peça de UI essencial e reutilizável ao kit de ferramentas do projeto, aderindo à "Filosofia LEGO".
 */
// src/components/ui/checkbox.tsx
