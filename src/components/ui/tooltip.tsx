// src/components/ui/tooltip.tsx
'use client';

/**
 * @file Componente de UI atómico y compuesto para tooltips.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Una adaptación del componente Tooltip de shadcn/ui, basado en
 *              Radix UI para una accesibilidad y funcionalidad de élite.
 */

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

/**
 * @module Tooltip
 * @description Componente de tooltip.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Delay Controlável:** Adicionar props `delayDuration` ao `TooltipProvider` e `delay` ao `Tooltip` para permitir um controle mais granular sobre o tempo de espera antes que o tooltip apareça, uma funcionalidade comum para tooltips complexos.
 * - ((Vigente)) **Variantes de Estilo:** Adicionar uma prop `variant` ao `TooltipContent` (usando `cva`) para permitir diferentes esquemas de cores (ex: `info`, `success`, `warning`, `destructive`), tornando o componente mais versátil para diferentes contextos de UI.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Dependência Crítica (TS2307):** A criação deste componente resolve uma dependência fundamental que impedia a compilação do `OrderCard`.
 * - ((Implementada)) **Fundação de UI Atómica:** Adiciona uma peça de UI essencial e reutilizável ao kit de ferramentas do projeto.
 */
// src/components/ui/tooltip.tsx
