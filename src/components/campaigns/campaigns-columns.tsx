// src/components/campaigns/campaigns-columns.tsx
'use client';

/**
 * @file Define las columnas para la tabla de datos de productos (campañas).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a una factoría de configuración pura.
 *              Define la estructura, renderizado y acciones para la tabla de
 *              productos, consumiendo componentes de UI soberanos y recibiendo toda
 *              la lógica y traducciones a través de inyección de dependencias.
 */

import React from 'react';
import { type useTranslations } from 'next-intl';
import { type ColumnDef, type Row } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Status } from '@/components/shared/status/status';
import { ConfirmationDialog } from '@/components/shared/confirmation/ConfirmationDialog';
import type { Tables } from '@/lib/types/database';
import { formatMoney } from '@/utils/paddle/parse-money';
import { clientLogger } from '@/lib/logger';
import { useDialogState } from '@/lib/hooks/ui/useDialogState';

export type ProductRow = Tables<'products'>;

interface ProductActionsCellProps {
  row: Row<ProductRow>;
  t: ReturnType<typeof useTranslations>;
  tDialogs: ReturnType<typeof useTranslations>;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  mutatingId: string | null;
}

const ProductActionsCell = ({
  row,
  t,
  tDialogs,
  onDelete,
  isPending,
  mutatingId,
}: ProductActionsCellProps): React.ReactElement => {
  const product = row.original;
  const { isOpen, open, setIsOpen } = useDialogState();

  const handleConfirmDelete = () => {
    const formData = new FormData();
    formData.append('productId', product.id);
    onDelete(formData);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t('table.actions.openMenu')}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('table.actions.label')}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => clientLogger.info(`[columns] Placeholder: Editar producto ID: ${product.id}`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {t('table.actions.edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onSelect={(e) => {
              e.preventDefault();
              open();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('table.actions.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleConfirmDelete}
        title={t('deleteDialog.title')}
        description={t.rich('deleteDialog.description', {
          productName: product.name,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
        cancelButtonText={tDialogs('generic_cancelButton')}
        confirmButtonText={t('deleteDialog.confirmButton')}
        isPending={isPending && mutatingId === product.id}
      />
    </>
  );
};

export interface GetCampaignsColumnsProps {
  t: ReturnType<typeof useTranslations>;
  tDialogs: ReturnType<typeof useTranslations>;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  mutatingId: string | null;
}

export const getCampaignsColumns = ({
  t,
  tDialogs,
  onDelete,
  isPending,
  mutatingId,
}: GetCampaignsColumnsProps): ColumnDef<ProductRow>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: t('table.headers.name'),
    cell: ({ row }) => <div className="capitalize font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'status',
    header: t('table.headers.status'),
    cell: ({ row }) => <Status status={row.original.status} />,
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">{t('table.headers.price')}</div>,
    cell: ({ row }) => {
      const price = parseFloat(String(row.getValue('price')));
      const formatted = formatMoney(price, 'USD');
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'created_at',
    header: t('table.headers.createdAt'),
    cell: ({ row }) => <div>{dayjs(row.getValue('created_at')).format('DD MMM YYYY')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <ProductActionsCell
        row={row}
        t={t}
        tDialogs={tDialogs}
        onDelete={onDelete}
        isPending={isPending}
        mutatingId={mutatingId}
      />
    ),
  },
];

/**
 * @module campaigns-columns
 * @description Define la estructura y renderizado para la tabla de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Moneda Dinámica:** A lógica de formatação de preço atualmente assume USD. Proponho refatorar para que o `workspace` tenha uma `currency_code` definida, e que este valor seja passado até aqui para formatar o preço na moeda correta.
 * - ((Vigente)) **Cabeceras Ordenables:** Proponho refatorar os `header` para serem componentes de botão que, ao serem clicados, invoquem um callback `onSortChange` injetado via props, permitindo que a UI controle o ordenamento dos dados.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Tipado Estrito (TS7006 Resolvido):** Adicionado tipado explícito (`value: boolean`) aos callbacks `onCheckedChange` dos componentes `Checkbox`, eliminando os erros de `any` implícito.
 * - ((Implementada)) **Padrão de Factoría:** O aparato agora exporta uma função `getCampaignsColumns`, permitindo a injeção de dependências e resolvendo o erro de exportação `TS2305`.
 * - ((Implementada)) **Full Internacionalização:** Os cabeçalhos da tabela agora são traduzíveis, consumindo a função `t` injetada.
 */
// src/components/campaigns/campaigns-columns.tsx
