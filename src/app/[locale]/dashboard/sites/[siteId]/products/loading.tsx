// src/app/[locale]/dashboard/sites/[siteId]/products/loading.tsx
/**
 * @file Esqueleto de carga de alta fidelidad para la página de gestión de productos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este componente se renderiza automáticamente a través del Suspense
 *              Boundary de Next.js mientras los datos de la página se cargan
 *              en el servidor. Simula la estructura exacta de la página de productos
 *              para una UX de carga de élite.
 */
import { ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @public
 * @component ProductsPageSkeleton
 * @description Renderiza una versión esqueleto de la página de gestión de productos.
 * @returns {React.ReactElement}
 */
export default function ProductsPageSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-4 opacity-50">
            <div>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <Skeleton className="h-5 w-24" />
            </div>
          </Button>
          <Skeleton className="h-8 w-64 mt-2" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
      </div>

      {/* Search Input Skeleton */}
      <div className="w-full md:w-1/3">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* DataTable Skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%]">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead className="w-[35%]">
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead className="w-[15%]">
                <Skeleton className="h-5 w-16" />
              </TableHead>
              <TableHead className="w-[15%] text-right">
                <Skeleton className="h-5 w-16 ml-auto" />
              </TableHead>
              <TableHead className="w-[20%]">
                <Skeleton className="h-5 w-32" />
              </TableHead>
              <TableHead className="w-[10%]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-3/4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20 rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-5 w-12 ml-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * @module products-page-skeleton
 * @description Componente de esqueleto de carga para la página de gestión de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Animación de Brillo Sutil:** Proponho adicionar uma animação de "brilho" (`shimmer`) mais sutil ao esqueleto, em vez do `pulse` padrão do Tailwind. Isso pode ser alcançado com um gradiente animado no fundo dos elementos `<Skeleton>`, proporcionando uma aparência mais moderna e premium.
 * - ((Vigente)) **Esqueleto de Diálogo:** Criar um `CreateProductDialogSkeleton` que possa ser renderizado se a ação de abrir o diálogo for acionada enquanto a página ainda está carregando, prevenindo um layout shift abrupto.
 */
// src/app/[locale]/dashboard/sites/[siteId]/products/loading.tsx
