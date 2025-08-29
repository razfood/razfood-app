// src/components/ui/avatar.tsx
'use client';

/**
 * @file Componente de UI atómico y compuesto para avatares.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Una adaptación del componente Avatar de shadcn/ui, basado en
 *              Radix UI para una accesibilidad y funcionalidad de élite. Es una
 *              pieza fundamental del kit de herramientas de UI de Restoralia.
 */

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

/**
 * @public
 * @component Avatar
 * @description Contenedor principal del avatar que define su tamaño y forma.
 *              Debe contener un `AvatarImage` y un `AvatarFallback`.
 */
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

/**
 * @public
 * @component AvatarImage
 * @description Componente para mostrar la imagen principal del avatar. Se renderiza
 *              cuando la fuente de la imagen (`src`) está disponible y se carga correctamente.
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/**
 * @public
 * @component AvatarFallback
 * @description Componente de fallback que se muestra mientras la `AvatarImage` se carga,
 *              o si la carga de la imagen falla. Usualmente contiene las iniciales del usuario.
 */
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
 * - ((Vigente)) **Indicador de Status Online:** Criar um componente filho opcional `AvatarStatusIndicator` que renderize um pequeno ponto (verde para online, cinza para offline) na borda do avatar, útil para aplicações com presença em tempo real como o dashboard de operações.
 * - ((Vigente)) **Variantes de Tamanho:** Utilizar `class-variance-authority` (cva) para criar variantes de tamanho (`sm`, `md`, `lg`) que ajustem as classes `h-` e `w-` do componente `Avatar`, facilitando o uso de tamanhos consistentes em toda a aplicação.
 * - ((Vigente)) **Grupo de Avatares:** Desenvolver um componente `AvatarGroup` que renderize múltiplos avatares sobrepostos, ideal para mostrar listas de membros de equipe ou participantes de uma conversa.
 */
// src/components/ui/avatar.tsx
