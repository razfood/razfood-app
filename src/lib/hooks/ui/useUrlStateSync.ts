// src/lib/hooks/ui/useUrlStateSync.ts
'use client';

/**
 * @file Hook soberano para sincronización de estado con parámetros de URL.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este hook es una pieza de infraestructura de UI de élite. Sincroniza
 *              bidireccionalmente un objeto de estado con los search params de la URL.
 *              Utiliza debouncing selectivo para optimizar las actualizaciones y proporciona
 *              un indicador de estado de sincronización. Es la Única Fuente de Verdad para
 *              el estado de filtros de cualquier página.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
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
  debounceKeys?: (keyof T)[];
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
export function useUrlStateSync<T extends object>({
  initialState,
  debounceMs = 500,
  debounceKeys = [],
}: UseUrlStateSyncOptions<T>): UseUrlStateSyncReturn<T> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<T>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const existingState: Partial<T> = {};
    Object.keys(initialState).forEach((key) => {
      if (params.has(key)) {
        (existingState as any)[key] = params.get(key);
      }
    });
    clientLogger.trace('[useUrlStateSync] Estado inicializado desde la URL.', { initialState, existingState });
    return { ...initialState, ...existingState };
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const updateUrl = useCallback(
    (currentState: T) => {
      const newParams = new URLSearchParams();
      Object.entries(currentState).forEach(([key, value]) => {
        if (value !== null && value !== undefined && String(value).trim() !== '') {
          newParams.set(key, String(value));
        }
      });
      const newUrl = `${pathname}?${newParams.toString()}`;

      if (newUrl !== `${pathname}?${searchParams.toString()}`) {
        clientLogger.trace('[useUrlStateSync] Sincronizando estado con URL.', { newUrl });
        router.push(newUrl, { scroll: false });
      }
      setIsSyncing(false);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSyncing(true);

    const debouncedState: Partial<T> = {};
    const instantState: Partial<T> = {};

    Object.keys(state).forEach((key) => {
      const k = key as keyof T;
      if (debounceKeys.includes(k)) {
        debouncedState[k] = state[k];
      } else {
        instantState[k] = state[k];
      }
    });

    // Actualiza el estado instantáneo inmediatamente si hay cambios.
    if (Object.keys(instantState).length > 0) {
      updateUrl({ ...initialState, ...state });
    }

    // Aplica debounce solo a las claves especificadas.
    if (Object.keys(debouncedState).length > 0) {
      timeoutRef.current = setTimeout(() => {
        updateUrl({ ...initialState, ...state });
      }, debounceMs);
    } else {
      setIsSyncing(false); // No hay nada que debounced, termina de sincronizar.
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state, initialState, debounceMs, debounceKeys, updateUrl]);

  return { state, setState, isSyncing };
}

/**
 * @module use-url-state-sync
 * @description Hook de UI para la sincronización de estado con la URL.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Parseo de Tipos con Zod:** O estado é atualmente lido e escrito como string. Uma melhoria de élite seria adicionar um schema de parseo Zod opcional para converter os parâmetros da URL para os seus tipos corretos (números, booleanos) ao inicializar o estado, garantindo a integridade dos tipos.
 * - ((Vigente)) **Manejo de Valores por Defecto:** A lógica atual remove da URL os parâmetros que correspondem ao `initialState`. Uma prop opcional `keepDefaultsInUrl?: boolean` poderia ser adicionada para controlar este comportamento, útil para URLs que precisam ser explícitas.
 */
// src/lib/hooks/ui/useUrlStateSync.ts
