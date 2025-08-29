// src/components/ui/input.tsx
'use client';

/**
 * @file Componente de UI atómico para campos de entrada.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Una adaptación del componente Input de shadcn/ui. Incluye una
 *              variante visual para estados de error, lo cual es crítico para
 *              el feedback en formularios.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      hasError: {
        true: 'border-destructive focus-visible:ring-destructive',
        false: 'border-input',
      },
    },
    defaultVariants: {
      hasError: false,
    },
  },
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

/**
 * @public
 * @component Input
 * @description Un control de formulario que permite al usuario introducir texto.
 * @param {InputProps} props - Propiedades que incluyen variantes de estilo y atributos nativos del input.
 * @returns {React.ReactElement}
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, hasError, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ hasError }), className)} ref={ref} {...props} />;
});
Input.displayName = 'Input';

export { Input };

/**
 * @module Input
 * @description Componente de campo de entrada.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Slot para Ícone:** Adicionar suporte para renderizar um ícone opcional dentro do campo de entrada (à esquerda ou à direita), ajustando o padding dinamicamente. Isso centralizaria a lógica atualmente implementada no `SearchInput` e aumentaria a versatilidade deste componente base.
 * - ((Vigente)) **Input com Addon:** Criar um componente composto que permita adicionar "addons" de texto ou botões antes ou depois do campo de entrada (ex: para mostrar a unidade de uma moeda ou um botão de "copiar").
 */
// src/components/ui/input.tsx
