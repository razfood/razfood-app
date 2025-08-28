// src/app/[locale]/dashboard/orders/page.tsx
'use server';

/**
 * @file Orquestador de servidor para la página del dashboard de pedidos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este Server Component es el punto de entrada para la ruta
 *              `/dashboard/orders`. Obtiene la lista inicial de pedidos activos
 *              para el workspace del usuario y la pasa a un componente de cliente
 *              que renderizará el tablero Kanban interactivo.
 */

import { unstable_setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { OrdersKanbanView } from '@/components/orders/OrdersKanbanView';
import { getActiveOrdersByWorkspaceId } from '@/lib/data/orders/dashboard.data';
import { logger } from '@/lib/logger';
import { getActiveWorkspace } from '@/lib/auth/user-permissions';

interface OrdersPageProps {
  params: { locale: string };
}

export default async function OrdersPage({ params: { locale } }: OrdersPageProps) {
  unstable_setRequestLocale(locale);
  logger.trace('[OrdersPage:Server] Renderizando orquestador de servidor.');

  const workspace = await getActiveWorkspace();
  if (!workspace) {
    logger.warn('[OrdersPage:Server] No se encontró un workspace activo. Redirigiendo a /dashboard.');
    redirect('/dashboard');
  }

  const initialOrders = await getActiveOrdersByWorkspaceId(workspace.id);

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="p-4 lg:p-8 lg:pb-0">
        <DashboardPageHeader pageTitle="Pedidos en Tiempo Real" />
      </div>
      <div className="flex-grow p-4 lg:p-8 lg:pt-4 overflow-hidden">
        <OrdersKanbanView initialOrders={initialOrders} workspaceId={workspace.id} />
      </div>
    </div>
  );
}

/**
 * @module orders-page
 * @description Página de servidor para el dashboard de pedidos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Metadatos Dinámicos:** Proponho implementar a função `generateMetadata` para definir um `<title>` otimizado (ex: "Pedidos | Nome do Restaurante | Restoralia").
 * - ((Vigente)) **ErrorBoundary de Rota:** Envolver o conteúdo da página em um `ErrorBoundary` do React para capturar erros de renderização no servidor e exibir uma UI de fallback graciosa.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Erro de Importação (TS2307):** Corrigida a rota de importação para `getActiveWorkspace`, alinhando-a com a arquitetura de módulos e resolvendo o erro de compilação.
 * - ((Implementada)) **Fluxo de Dados Completo:** O `workspaceId` agora é passado como prop para o `OrdersKanbanView`, fornecendo a dependência crítica necessária para a inicialização das assinaturas em tempo real.
 * - ((Implementada)) **Melhoria de Layout (Flexbox):** O layout foi ajustado para usar `flexbox` com `flex-grow`, garantindo que o `OrdersKanbanView` se expanda para preencher o espaço vertical disponível, o que é crucial para uma boa UX em um dashboard.
 */
// src/app/[locale]/dashboard/orders/page.tsx
