// src/app/[locale]/dashboard/sites/loading.tsx
/**
 * @file Esqueleto de carga de alta fidelidad para la página "Mis Menús".
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este componente se renderiza automáticamente a través del Suspense
 *              Boundary de Next.js mientras los datos de la página se cargan
 *              en el servidor, proporcionando una UX de carga de élite.
 */
import { Card } from '@/components/ui/card';
import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';

export default function SitesPageSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <DashboardPageHeader pageTitle="Mis Menús" /> {/* Placeholder, se internacionalizará */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="h-10 w-full md:w-64 bg-muted rounded-md" />
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="h-10 w-24 bg-muted rounded-md" />
          <div className="h-10 w-32 bg-muted rounded-md" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-48 bg-muted" />
        ))}
      </div>
    </div>
  );
}

/**
 * @module sites-page-skeleton
 * @description Componente de esqueleto de carga para la página de gestión de menús.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Consistencia con `DashboardPageHeader`:** Proponho refatorar este componente para que o `DashboardPageHeader` tenha seu próprio estado de esqueleto. Isso permitiria que o esqueleto do título fosse renderizado dentro do `DashboardPageHeader` e não aqui, melhorando o SRP.
 * - ((Vigente)) **Esqueleto de Paginación:** Proponho adicionar placeholders para os controles de paginação na parte inferior do esqueleto, tornando a réplica da UI final ainda mais fiel.
 */
// src/app/[locale]/dashboard/sites/loading.tsx
