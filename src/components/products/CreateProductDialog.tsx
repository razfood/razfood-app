// src/components/products/CreateProductDialog.tsx
/**
 * @file Componente de UI atómico que encapsula el modal para crear un nuevo producto.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este componente renderiza un diálogo que contiene el formulario de creación
 *              de productos. Es un componente controlado, cuya visibilidad es gestionada
 *              por su padre a través de las props `isOpen` y `onOpenChange`.
 */
'use client';

import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateProductForm } from './CreateProductForm'; // Asumimos que este aparato existe.

interface CreateProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  siteId: string;
}

/**
 * @public
 * @component CreateProductDialog
 * @description Renderiza el modal para la creación de un nuevo producto.
 * @param {CreateProductDialogProps} props - Propiedades para controlar el diálogo.
 * @returns {React.ReactElement}
 */
export function CreateProductDialog({ isOpen, onOpenChange, siteId }: CreateProductDialogProps): React.ReactElement {
  const t = useTranslations('CampaignsPage.createDialog');

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <CreateProductForm siteId={siteId} onSuccess={handleSuccess} />
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
 * - ((Vigente)) **Gestión de Estado de Carga:** Proponho que o estado `isPending` do formulário `CreateProductForm` seja elevado ao hook `useCampaignsPage` e passado como prop para este diálogo. Isso permitiria que o diálogo se tornasse visualmente "ocupado" (ex: desabilitando o botão de fechar) enquanto a Server Action está em execução, proporcionando um feedback de UI mais robusto.
 * - ((Vigente)) **Componente de Formulário Genérico:** O padrão `Dialog > DialogHeader > Form` é altamente reutilizável. Proponho, em uma fase futura de refatoração, criar um componente `FormDialog` genérico que aceite `title`, `description` e o componente de formulário como `children`, para maximizar a adesão ao princípio DRY.
 */
// src/components/products/CreateProductDialog.tsx
