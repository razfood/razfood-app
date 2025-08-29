// src/components/ui/tooltip.tsx
'use client';

/**
 * @file Componente de UI atómico y compuesto para tooltips.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Una adaptación del componente Tooltip de shadcn/ui, basado en
 *              Radix UI para una accesibilidad y funcionalidad de élite. Provee
 *              información contextual al pasar el cursor sobre un elemento.
 */

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

/**
 * @public
 * @component TooltipProvider
 * @description Provee contexto a todos los tooltips dentro de él, controlando
 *              aspectos globales como la duración del retardo. Debe envolver la
 *              sección de la aplicación donde se utilizarán los tooltips.
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * @public
 * @component Tooltip
 * @description Contenedor principal que agrupa un `TooltipTrigger` y un `TooltipContent`.
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * @public
 * @component TooltipTrigger
 * @description El elemento que, al ser sobrevolado por el cursor, activará la
 *              visualización del tooltip. Debe ser un hijo directo de `Tooltip`.
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * @public
 * @component TooltipContent
 * @description El contenido que se muestra cuando el tooltip está activo.
 *              Aparece posicionado relativo al `TooltipTrigger`.
 */
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
 * @description Componente de tooltip para mostrar información contextual.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Delay Controlável:** Adicionar props `delayDuration` ao `TooltipProvider` e `delay` ao `Tooltip` para permitir um controle mais granular sobre o tempo de espera antes que o tooltip apareça, uma funcionalidade essencial para tooltips complexos ou para cumprir requisitos de acessibilidade específicos.
 * - ((Vigente)) **Variantes de Estilo:** Utilizar `class-variance-authority` (cva) para adicionar uma prop `variant` ao `TooltipContent`, permitindo diferentes esquemas de cores (ex: `info`, `success`, `warning`, `destructive`) e tornando o componente mais versátil para diferentes contextos de UI.
 * - ((Vigente)) **Conteúdo Rico:** Permitir que `TooltipContent` aceite componentes React complexos como filhos de forma mais robusta, possivelmente adicionando um `TooltipArrow` opcional para uma melhor indicação visual em layouts complexos.
 */
// src/components/ui/tooltip.tsx
