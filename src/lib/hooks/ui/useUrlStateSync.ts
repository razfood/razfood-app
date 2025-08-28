// src/lib/hooks/ui/useUrlStateSync.ts
'use client';

/**
 * @file Hook soberano para sincronización de estado con parámetros de URL.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este hook es una pieza de infraestructura de UI de élite. Sincroniza
 *              bidireccionalmente un objeto de estado con los search params de la URL.
 *              Utiliza debouncing para optimizar las actualizaciones y proporciona un
 *              indicador de estado de sincronización. Es la Única Fuente de Verdad para
 *              el estado de filtros de cualquier página.
 */

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { clientLogger } from '@/lib/logger';

/**
 * @interface UseUrlStateSyncOptions
 * @description Opciones de configuración para el hook.
 * @template T - El tipo del objeto de estado.
 */
export interface UseUrlStateSyncOptions<T> {
  initialState: T;
  debounceMs?: number;
}

/**
 * @interface UseUrlStateSyncReturn
 * @description El contrato de retorno del hook.
 * @template T - El tipo del objeto de estado.
 */
export interface UseUrlStateSyncReturn<T> {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  isSyncing: boolean;
}

/**
 * @public
 * @function useUrlStateSync
 * @description Sincroniza un objeto de estado con los parámetros de la URL.
 * @template T - El tipo del objeto de estado a sincronizar.
 * @param {UseUrlStateSyncOptions<T>} options - Las opciones de configuración.
 * @returns {UseUrlStateSyncReturn<T>} Un objeto con el estado, la función para actualizarlo y un indicador de sincronización.
 */
export function useUrlStateSync<T>({
  initialState,
  debounceMs = 500,
}: UseUrlStateSyncOptions<T>): UseUrlStateSyncReturn<T> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, setState] = useState<T>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const existingState: Record<string, any> = {};
    Object.keys(initialState as object).forEach((key) => {
      if (params.has(key)) {
        existingState[key] = params.get(key);
      }
    });
    return { ...initialState, ...existingState };
  });

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsSyncing(true);

    const handler = setTimeout(() => {
      const newParams = new URLSearchParams();
      Object.entries(state as object).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          newParams.set(key, String(value));
        }
      });
      const newUrl = `${pathname}?${newParams.toString()}`;

      // Solo empujar si la URL ha cambiado para evitar entradas de historial innecesarias.
      if (newUrl !== `${pathname}?${searchParams.toString()}`) {
        clientLogger.trace('[useUrlStateSync] Sincronizando estado con URL.', { newUrl });
        router.push(newUrl, { scroll: false });
      }
      setIsSyncing(false);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [state, pathname, router, searchParams, debounceMs]);

  return { state, setState, isSyncing };
}

/**
 * @module use-url-state-sync
 * @description Hook de UI para la sincronización de estado con la URL.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Debounce por Clave:** A implementação atual aplica o debounce a todas as alterações de estado. Uma melhoria de élite seria permitir a especificação de `debounceKeys` nas opções, para que apenas certas chaves (como o campo de busca 'q') sejam debounced, enquanto outras (como filtros de select) atualizem a URL instantaneamente para um feedback de UI mais rápido.
 * - ((Vigente)) **Parseo de Tipos:** O estado é atualmente lido e escrito como string. Uma melhoria seria adicionar um schema de parseo opcional (ex: Zod) para converter os parâmetros da URL para os seus tipos corretos (números, booleanos) ao inicializar o estado.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Infraestrutura de UI Soberana:** Cria uma peça de lógica de UI fundamental, reutilizável e de élite que servirá como base para todas as páginas com estado filtrável, aderindo estritamente aos princípios DRY e de Atomicidade.
 * - ((Implementada)) **Sincronização Bidirecional:** O hook inicializa seu estado a partir da URL no mount e subsequentemente atualiza a URL quando o estado muda, garantindo que o estado da UI seja persistente através de recarregamentos de página e compartilhamento de links.
 * - ((Implementada)) **Otimização de Performance:** A inclusão de debouncing previne a sobrecarga do router da Next.js e evita a criação de entradas desnecessárias no histórico do navegador.
 */
// src/lib/hooks/ui/useUrlStateSync.ts
