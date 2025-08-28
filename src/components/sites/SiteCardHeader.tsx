// src/components/sites/SiteCardHeader.tsx
/**
 * @file Componente de presentación soberano para la cabecera de una SiteCard.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a un estándar de élite para consolidar
 *              las acciones del sitio (ver en vivo, eliminar) en un `DropdownMenu` contextual.
 *              Esta arquitectura limpia la UI, mejora la escalabilidad y es 100% soberana.
 */
'use client';

import React from 'react';
import { ExternalLink, MoreVertical, Settings, ShieldAlert, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CardHeader as CardHeaderPrimitive, CardTitle } from '@/components/ui/card';
import { ConfirmationDialogContent } from '@/components/ui/ConfirmationDialog';
import {
  Dialog,
  DialogContent, // Importado para el diálogo de eliminación
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDialogState } from '@/lib/hooks/ui/useDialogState';
import { Link } from '@/lib/navigation';
import { protocol, rootDomain } from '@/lib/utils';
import { logger } from '@/lib/logger';

// Tipo de dato que espera este componente
type SiteInfo = { id: string; name: string; subdomain: string | null; icon: string | null };

export interface SiteCardHeaderProps {
  site: SiteInfo;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
}

export function SiteCardHeader({ site, onDelete, isPending, deletingSiteId }: SiteCardHeaderProps): React.ReactElement {
  logger.trace(`[SiteCardHeader] Renderizando para sitio: ${site.id}`);
  const { isOpen: isDeleteDialogOpen, open: openDeleteDialog, setIsOpen: setIsDeleteDialogOpen } = useDialogState();
  const tSitesPage = useTranslations('SitesPage');
  const tDialogs = useTranslations('Dialogs');

  const siteUrl = `${protocol}://${site.subdomain}.${rootDomain}`;

  return (
    <CardHeaderPrimitive className="flex-row items-start justify-between gap-4">
      <Link
        href={{
          pathname: '/dashboard/sites/[siteId]/campaigns',
          params: { siteId: site.id },
        }}
        className="flex items-center gap-4 group flex-grow"
      >
        <Avatar>
          <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            {site.icon || site.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="group-hover:underline">{site.name}</CardTitle>
          <p className="text-sm text-muted-foreground font-mono">{site.subdomain}</p>
        </div>
      </Link>

      {/* --- INICIO DE REFACTORIZACIÓN: Menú de Acciones --- */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">{tSitesPage('card.actionsMenuAriaLabel')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>{tSitesPage('card.viewLiveSite')}</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/sites/${site.id}/settings` as any}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{tSitesPage('card.settings')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  openDeleteDialog();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{tSitesPage('card.deleteSite')}</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <ConfirmationDialogContent
          icon={ShieldAlert}
          title={tSitesPage('deleteDialog.title')}
          description={tSitesPage.rich('deleteDialog.description', {
            subdomain: site.subdomain,
            strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
          })}
          confirmButtonText={tSitesPage('deleteDialog.confirmButton')}
          cancelButtonText={tDialogs('generic_cancelButton')}
          onConfirm={onDelete}
          onClose={() => setIsDeleteDialogOpen(false)}
          isPending={isPending && deletingSiteId === site.id}
          hiddenInputs={{ siteId: site.id }}
          confirmationText={site.subdomain || ''}
          confirmationLabel={tSitesPage.rich('deleteDialog.confirmation_label', {
            subdomain: site.subdomain,
            strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
          })}
        />
      </Dialog>
      {/* --- FIN DE REFACTORIZACIÓN: Menú de Acciones --- */}
    </CardHeaderPrimitive>
  );
}

/**
 * @module site-card-header
 * @description Componente de cabecera para la tarjeta de un sitio (menú).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Edición en Línea del Nombre:** Proponho, na próxima fase de otimização da UX, substituir o `CardTitle` por um componente `EditableText`. Isso permitirá aos usuários renomear seus menus diretamente do cartão, criando um fluxo de trabalho mais rápido e intuitivo.
 * - ((Vigente)) **Popover con Estadísticas:** Proponho adicionar um `<Popover>` que seja acionado ao passar o mouse sobre o `Avatar`. Este popover poderia exibir estatísticas rápidas do menu (ex: "Visitantes nos últimos 7 dias", "Itens mais vendidos"), fornecendo insights valiosos sem sobrecarregar a UI principal.
 */
// src/components/sites/SiteCardHeader.tsx
