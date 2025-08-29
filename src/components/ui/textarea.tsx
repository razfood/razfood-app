// src/components/ui/textarea.tsx
'use client';

/**
 * @file Componente de UI atómico para áreas de texto.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Una adaptación del componente Textarea de shadcn/ui, que proporciona
 *              un campo de entrada de texto multilínea para formularios.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * @public
 * @component Textarea
 * @description Un control que permite al usuario introducir texto en múltiples líneas.
 * @param {TextareaProps} props - Propiedades nativas del elemento `textarea` de HTML.
 * @returns {React.ReactElement}
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };

/**
 * @module Textarea
 * @description Componente de área de texto multilínea.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Auto-ajuste de Altura:** Implementar uma lógica (possivelmente através de um hook `useAutosizeTextarea`) que ajuste dinamicamente a altura da área de texto com base no seu conteúdo, eliminando barras de rolagem desnecessárias e melhorando a UX em formulários com conteúdo dinâmico.
 * - ((Vigente)) **Contador de Caracteres:** Adicionar uma prop opcional `maxLength` que, quando definida, exiba um contador de caracteres (ex: "120/280") abaixo do campo, fornecendo feedback essencial ao usuário para campos com restrições de comprimento.
 * - ((Vigente)) **Variante de Erro:** Adicionar uma prop `hasError?: boolean` (usando `cva`) para aplicar um estilo de borda `destructive`, alinhando este componente com o `Input` e fornecendo um feedback visual consistente para erros de validação.
 */
// src/components/ui/textarea.tsx
