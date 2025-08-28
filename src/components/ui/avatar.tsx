// src/components/ui/avatar.tsx
'use client';

/**
 * @file Componente de UI atómico y compuesto para avatares.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Una adaptación del componente Avatar de shadcn/ui, basado en
 *              Radix UI para una accesibilidad y funcionalidad de élite.
 */

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

/**
 * @module Avatar
 * @description Componente para mostrar una imagen de avatar con un fallback.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Indicador de Status Online:** Adicionar um componente filho opcional `AvatarStatusIndicator` que renderize um pequeno ponto (verde para online, cinza para offline) na borda do avatar, útil para aplicações com presença em tempo real.
 * - ((Vigente)) **Variantes de Tamanho:** Utilizar `class-variance-authority` para criar variantes de tamanho (`sm`, `md`, `lg`) que ajustem o `h-` e `w-` do componente `Avatar`, facilitando o uso de tamanhos consistentes em toda a aplicação.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Dependência Crítica (TS2307):** A criação deste componente resolve uma dependência fundamental que impedia a compilação do `SiteCardHeader`.
 * - ((Implementada)) **Padrão de Composição:** Segue o padrão de composição de `shadcn/ui` e Radix, exportando `Avatar`, `AvatarImage` e `AvatarFallback` para uma máxima flexibilidade de uso.
 */
// src/components/ui/avatar.tsx
