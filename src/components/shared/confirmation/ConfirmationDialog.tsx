// src/components/shared/confirmation/ConfirmationDialog.tsx
/**
 * @file Componente de UI genérico y de élite para diálogos de confirmación.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a un estándar de élite. Es un
 *              componente de presentación puro, 100% internacionalizable y agnóstico
 *              al contexto. Recibe todo su contenido, estado y callbacks a través
 *              de props, adhiriéndose estrictamente a la "Filosofía LEGO".
 */
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button, type ButtonProps } from '@/components/ui/button';
import { clientLogger } from '@/lib/logging';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  onConfirm: () => void;
  isPending?: boolean;
  cancelButtonText: string;
  confirmButtonText: string;
  confirmButtonVariant?: ButtonProps['variant'];
}

/**
 * @public
 * @component ConfirmationDialog
 * @description Renderiza un modal de confirmación genérico, controlado y reutilizable.
 * @param {ConfirmationDialogProps} props - Propiedades para configurar el diálogo.
 * @returns {React.ReactElement}
 */
export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending = false,
  cancelButtonText,
  confirmButtonText,
  confirmButtonVariant = 'destructive',
}: ConfirmationDialogProps): React.ReactElement {
  clientLogger.trace('[ConfirmationDialog] Renderizando diálogo de confirmación.', { isOpen, isPending });

  const handleConfirm = () => {
    clientLogger.trace('[ConfirmationDialog] Acción de confirmación disparada.');
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={isPending ? () => {} : onOpenChange}>
      <DialogContent onInteractOutside={isPending ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button onClick={() => onOpenChange(false)} variant={'outline'} disabled={isPending}>
            {cancelButtonText}
          </Button>
          <Button onClick={handleConfirm} variant={confirmButtonVariant} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
/**
 * @module ConfirmationDialog
 * @description Componente de diálogo de confirmación genérico.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Input de Confirmação Opcional:** Proponho adicionar uma prop opcional `confirmationText?: string`. Se fornecida, o diálogo renderizaria um campo de entrada onde o usuário deve digitar o texto exato para habilitar o botão de confirmação. Isso adicionaria uma camada de segurança para ações destrutivas de alto risco, como a exclusão de um `workspace`.
 * - ((Vigente)) **Slot para Ícone:** Proponho adicionar uma prop `icon?: React.ElementType` para renderizar um ícone (ex: `ShieldAlert`) no `DialogTitle`, proporcionando um contexto visual mais forte para o usuário.
 * - ((Vigente)) **Foco Automático:** Proponho utilizar a API de `focus-trap` do Radix UI para garantir que o foco seja movido programaticamente para o botão de confirmação ou cancelamento quando o diálogo for aberto, melhorando a acessibilidade (a11y).
 */
// src/components/shared/confirmation/ConfirmationDialog.tsx
