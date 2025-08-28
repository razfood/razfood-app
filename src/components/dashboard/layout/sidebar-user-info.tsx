// src/components/dashboard/layout/sidebar-user-info.tsx
/**
 * @file Componente de cliente atómico que renderiza la información del usuario en la sidebar.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Muestra el nombre y email del usuario y proporciona la funcionalidad de cierre de sesión.
 *              Actualmente consume datos de un hook placeholder, que será reemplazado por
 *              el `DashboardContextProvider`.
 */
'use client';

import { LogOut } from 'lucide-react';
import { MouseEvent, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { useUserInfo } from '@/hooks/useUserInfo'; // Hook placeholder existente
import { Separator } from '@/components/ui/separator';
import { logger } from '@/lib/logger';

export function SidebarUserInfo() {
  const supabase = createClient();
  const { user } = useUserInfo(supabase); // Placeholder hasta que tengamos el context
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout(e: MouseEvent) {
    e.preventDefault();
    setIsLoading(true);
    logger.info('[SidebarUserInfo] Iniciando cierre de sesión para el usuario.', { userId: user?.id });
    await supabase.auth.signOut();
    // La redirección es manejada por el middleware o el cambio de estado de la sesión.
    window.location.href = '/'; // Fallback de redirección simple
  }

  return (
    <div className={'flex flex-col items-start pb-8 px-2 text-sm font-medium lg:px-4'}>
      <Separator className={'relative my-6 bg-border/40'} />
      <div className={'flex w-full flex-row items-center justify-between'}>
        <div className={'flex flex-col items-start justify-center overflow-hidden text-ellipsis'}>
          <div className={'text-sm leading-5 font-semibold w-full overflow-hidden text-ellipsis'}>
            {user?.user_metadata?.full_name || 'Usuario Anónimo'}
          </div>
          <div className={'text-sm leading-5 text-muted-foreground w-full overflow-hidden text-ellipsis'}>
            {user?.email}
          </div>
        </div>
        <div>
          <button onClick={handleLogout} disabled={isLoading} aria-label="Cerrar sesión">
            <LogOut className={'h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground'} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * @module sidebar-user-info
 * @description Componente de información de usuario para la barra lateral.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Consumo de Contexto Centralizado:** Proponho implementar esta melhoria assim que o `DashboardContextProvider` estiver disponível. Refatorar este componente para que consuma os dados do `useDashboard()` hook em vez de usar o `useUserInfo` placeholder. Isso centralizará a obtenção de dados e melhorará o desempenho.
 * - ((Vigente)) **Server Action para Logout:** Proponho refatorar a lógica de `handleLogout` para que invoque uma `signOutAction` dedicada. Isso alinhará o componente com a nossa arquitetura de Server Actions e permitirá uma lógica de servidor mais complexa no futuro (ex: invalidar tokens específicos).
 * - ((Vigente)) **Internacionalización (i18n):** Proponho adicionar internacionalização para o `aria-label` do botão de logout e o texto fallback "Usuario Anónimo".
 */
// src/components/dashboard/layout/sidebar-user-info.tsx
