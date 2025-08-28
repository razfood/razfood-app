// src/components/ui/SearchInput.tsx
'use client';

/**
 * @file Componente de UI atómico y soberano para campos de búsqueda.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es una pieza de UI de élite, autocontenida y reutilizable.
 *              Renderiza un campo de entrada con íconos contextuales para búsqueda,
 *              limpieza y estado de carga. Es un componente 100% controlado y
 *              agnóstico al contenido, recibiendo todos sus textos y estado vía props.
 */

import * as React from 'react';
import { Loader2, Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input, type InputProps } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface SearchInputProps extends Omit<InputProps, 'onChange'> {
  isLoading?: boolean;
  clearAriaLabel: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, isLoading, clearAriaLabel, value, onChange, ...props }, ref) => {
    const handleClear = () => {
      const syntheticEvent = {
        target: { value: '' } as HTMLInputElement,
        currentTarget: { value: '' } as HTMLInputElement,
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    };

    return (
      <div className={cn('relative flex items-center', className)}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          value={value}
          onChange={onChange}
          className="pl-9 pr-10" // Padding para íconos
          {...props}
        />
        <div className="absolute right-3 h-4 w-4">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            value && (
              <Button variant="ghost" size="icon" className="h-full w-full" onClick={handleClear}>
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">{clearAriaLabel}</span>
              </Button>
            )
          )}
        </div>
      </div>
    );
  },
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };

/**
 * @module SearchInput
 * @description Componente de campo de entrada especializado para búsqueda.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Prop `onClear` Opcional:** Adicionar um callback `onClear?: () => void` para permitir que o componente pai execute lógica adicional quando o campo de busca for limpo, além de apenas atualizar o valor.
 * - ((Vigente)) **Ícones Personalizáveis:** Permitir a passagem de componentes de ícone personalizados através de props (`searchIcon`, `loadingIcon`, `clearIcon`) para aumentar a flexibilidade e reutilização do componente em diferentes contextos visuais.
 * - ((Vigente)) **Integração com `react-hook-form`:** Criar um wrapper ou adaptar o componente para se integrar de forma nativa com `react-hook-form`, facilitando seu uso em formulários complexos.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Componente Controlado e Atómico:** O `SearchInput` é uma peça de LEGO de UI pura, com estado e comportamento totalmente gerenciados por seu componente pai, aderindo ao SRP.
 * - ((Implementada)) **Feedback Visual Contextual:** O componente exibe dinamicamente um ícone de carregamento ou um botão de limpeza com base nas props `isLoading` e `value`, proporcionando uma UX clara e intuitiva.
 * - ((Implementada)) **Full Internacionalização e Acessibilidade:** O componente é agnóstico ao conteúdo, recebendo `placeholder` e `clearAriaLabel` via props, garantindo que seja 100% traduzível e acessível.
 */
// src/components/ui/SearchInput.tsx
