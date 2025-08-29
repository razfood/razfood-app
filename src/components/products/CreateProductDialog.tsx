// src/components/products/CreateProductDialog.tsx
'use client';

/**
 * @file Componente de UI atómico que encapsula el modal para crear un nuevo producto.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este componente renderiza un diálogo que contiene el formulario de creación
 *              de productos. Es un componente controlado, cuya visibilidad, estado de
 *              carga y callback de envío son gestionados por su padre.
 */

import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateProductForm } from './CreateProductForm';
import { clientLogger } from '@/lib/logger';

export interface CreateProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  siteId: string;
  onCreate: (formData: FormData) => Promise<void>;
  isPending: boolean;
}

/**
 * @public
 * @component CreateProductDialog
 * @description Renderiza el modal para la creación de un nuevo producto.
 * @param {CreateProductDialogProps} props - Propiedades para controlar el diálogo.
 * @returns {React.ReactElement}
 */
export function CreateProductDialog({
  isOpen,
  onOpenChange,
  siteId,
  onCreate,
  isPending,
}: CreateProductDialogProps): React.ReactElement {
  clientLogger.trace('[CreateProductDialog] Renderizando diálogo.', { isOpen, isPending });
  const t = useTranslations('ProductsPage.createDialog');

  const handleSuccess = () => {
    clientLogger.trace('[CreateProductDialog] Creación exitosa, cerrando diálogo.');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={isPending ? () => {} : onOpenChange}>
      <DialogContent onInteractOutside={isPending ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <CreateProductForm siteId={siteId} onSubmit={onCreate} isPending={isPending} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * @module create-product-dialog
 * @description Componente modal para la creación de nuevos productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Componente de Formulário Genérico:** O padrão `Dialog > DialogHeader > Form` é altamente reutilizável. Proponho, em uma fase futura de refatoração, criar um componente `FormDialog` genérico que aceite `title`, `description` e o componente de formulário como `children`, para maximizar a adesão ao princípio DRY em toda a aplicação.
 * - ((Vigente)) **Reset de Formulário no Fechamento:** Adicionar um `useEffect` que observe a prop `isOpen`. Quando `isOpen` mudar para `false`, o estado interno do `CreateProductForm` (via `react-hook-form`) deve ser resetado. Isso garante que, ao reabrir o diálogo, o formulário esteja sempre limpo.
 */
// src/components/products/CreateProductDialog.tsx
