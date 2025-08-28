// src/components/dashboard/layout/dashboard-layout.tsx
/**
 * @file Componente de cliente que ensambla la estructura visual completa del dashboard.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado para integrar los componentes atómicos
 *              `Sidebar` y `SidebarUserInfo`, completando la estructura de navegación
 *              y de usuario del layout principal de Restoralia.
 */
'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Sidebar } from '@/components/dashboard/layout/sidebar';
import { SidebarUserInfo } from '@/components/dashboard/layout/sidebar-user-info';
import { DashboardGradient } from '@/components/gradients/dashboard-gradient';
import { logger } from '@/lib/logger';
import '@/styles/dashboard.css';

interface Props {
  children: ReactNode;
}

export function DashboardLayout({ children }: Props) {
  logger.trace('[DashboardLayout:Client] Renderizando layout visual completo del dashboard.');
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative overflow-hidden">
      <DashboardGradient />
      <div className="hidden border-r bg-card/50 backdrop-blur-sm md:flex md:flex-col">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Image src="/images/logo.png" alt="Restoralia Logo" width={32} height={32} priority />
              <span className="text-lg font-bold text-foreground">Restoralia</span>
            </Link>
          </div>
          {/* --- INICIO DE INTEGRACIÓN --- */}
          <div className="flex flex-col grow overflow-y-auto">
            <Sidebar />
            <SidebarUserInfo />
          </div>
          {/* --- FIN DE INTEGRACIÓN --- */}
        </div>
      </div>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

/**
 * @module dashboard-layout-client
 * @description Componente de cliente para la estructura visual del dashboard.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Sidebar Colapsable:** Proponho implementar esta melhoria assim que o estado da UI for estabelecido. Introduzir um estado (gerenciado por Zustand) para controlar se a barra lateral está colapsada e aplicar classes CSS condicionais para animar a transição.
 * - ((Vigente)) **Carga de Contexto de Usuário:** Proponho que este componente consuma um futuro `DashboardContextProvider` para obter os dados do usuário e passá-los para `SidebarUserInfo`.
 */
// src/components/dashboard/layout/dashboard-layout.tsx
