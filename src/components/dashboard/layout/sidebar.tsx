// src/components/dashboard/layout/sidebar.tsx
/**
 * @file Componente de cliente atómico que renderiza la lista de navegación principal.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Utiliza `usePathname` para resaltar activamente la ruta actual y consume
 *              un manifiesto de configuración para renderizar los enlaces de forma declarativa.
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useTranslations } from "next-intl"; // Se añadirá cuando se conecte i18n al dashboard

import { sidebarLinks } from '@/config/sidebar.config';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  // const t = useTranslations("DashboardSidebar"); // Placeholder para futura i18n

  return (
    <nav className="flex flex-col grow justify-between items-start px-2 text-sm font-medium lg:px-4">
      <div className={'w-full'}>
        {sidebarLinks.map((item) => {
          // Lógica de `convertikit` para una comparación de ruta más robusta
          const hrefAsString = typeof item.href === 'string' ? item.href : item.href.pathname ?? '/';
          const isActive =
            hrefAsString === '/dashboard' ? pathname === hrefAsString : pathname.startsWith(hrefAsString);

          return (
            <Link
              key={hrefAsString}
              href={item.href as string} // Casting temporal hasta que i18n esté completamente integrado
              className={cn(
                'flex items-center text-base gap-3 px-4 py-3 rounded-md text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50',
                {
                  'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground': isActive,
                },
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.i18nKey.charAt(0).toUpperCase() + item.i18nKey.slice(1)} {/* Placeholder */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * @module sidebar
 * @description Componente de navegación principal para el dashboard de Restoralia.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Integración con i18n:** Proponho implementar esta melhoria assim que o `DashboardLayout` for conectado ao `DashboardContextProvider`. Descomentar o `useTranslations` e usar `t(item.i18nKey)` para renderizar os rótulos dos links de forma internacionalizada.
 * - ((Vigente)) **Renderizado Basado en Roles:** Proponho consumir o `useDashboard` hook (a ser criado) para obter o `activeWorkspaceRole` do usuário. A lógica de renderização do `.map()` deve então filtrar os `sidebarLinks` para mostrar ou ocultar links (como "Team") com base na propriedade `requiredRoles`.
 */
// src/components/dashboard/layout/sidebar.tsx
