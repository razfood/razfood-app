// src/app/[locale]/dashboard/sites/[siteId]/campaigns/loading.tsx
/**
 * @file Esqueleto de carga de alta fidelidad para la página de gestión de productos (campañas).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este componente se renderiza automáticamente a través del Suspense
 *              Boundary de Next.js mientras los datos de la página se cargan
 *              en el servidor. Simula la estructura del encabezado y la tabla de datos.
 */
import { ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';

export default function CampaignsPageSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <DashboardPageHeader pageTitle="Productos del Menú" /> {/* Placeholder */}
      <div className="h-10 w-full md:w-1/3 bg-muted rounded-md" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">
                <div className="h-5 w-24 bg-muted rounded-md" />
              </TableHead>
              <TableHead className="w-[15%]">
                <div className="h-5 w-16 bg-muted rounded-md" />
              </TableHead>
              <TableHead className="w-[30%]">
                <div className="h-5 w-32 bg-muted rounded-md" />
              </TableHead>
              <TableHead className="w-[15%]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-5 w-3/4 bg-muted rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-20 bg-muted rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-full bg-muted rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-8 w-8 bg-muted rounded-md ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/**
 * @module campaigns-page-skeleton
 * @description Componente de esqueleto de carga para la página de gestión de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Consistencia de `DashboardPageHeader`:** Proponho, assim como no esqueleto de `sites`, refatorar o `DashboardPageHeader` para que ele tenha seu próprio estado de esqueleto. Isso permitiria uma representação de carregamento ainda mais fiel.
 * - ((Vigente)) **Esqueleto de Paginación:** Proponho adicionar placeholders para os controles de paginação na parte inferior, completando a simulação da UI final.
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/loading.tsx
