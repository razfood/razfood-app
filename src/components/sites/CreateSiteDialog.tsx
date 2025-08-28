// src/components/sites/CreateSiteDialog.tsx
/**
 * @file Componente de UI atómico que encapsula el modal para crear un nuevo menú (site).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este componente renderiza un diálogo que contiene el formulario de creación de sitios.
 *              Gestiona su propia visibilidad a través de las props `isOpen` y `onOpenChange`.
 */
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateSiteForm } from './CreateSiteForm';

interface CreateSiteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  workspaceId: string;
  // onSuccess callback será pasado al formulario
}

export function CreateSiteDialog({ isOpen, onOpenChange, workspaceId }: CreateSiteDialogProps) {
  // onSuccess es implícitamente `() => onOpenChange(false)`
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear un Nuevo Menú</DialogTitle>
          <DialogDescription>Dale un nombre a tu menú y asígnale una URL única (subdominio).</DialogDescription>
        </DialogHeader>
        <CreateSiteForm
          workspaceId={workspaceId}
          onSuccess={handleSuccess}
          isPending={false} // Placeholder, se conectará al estado real después
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * @module create-site-dialog
 * @description Componente modal para la creación de nuevos menús (sitios).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Internacionalización (i18n):** Proponho, na próxima fase de i18n, refatorar este componente para que receba todos os seus textos (`title`, `description`) através de props, tornando-o completamente agnóstico ao conteúdo.
 * - ((Vigente)) **Gestión de Estado de Carga:** Proponho que o estado `isPending` do formulário seja elevado ao hook `useSitesPage` e passado para este componente. Isso permitirá que o diálogo mostre um estado de carregamento global e se desabilite enquanto a Server Action está em execução.
 */
// src/components/sites/CreateSiteDialog.tsx
