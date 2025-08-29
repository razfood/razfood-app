// src/lib/hooks/ui/useDialogState.ts
'use client';

/**
 * @file Hook soberano para gestionar el estado de componentes modales (Dialog, Sheet, etc.).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es una abstracción de élite sobre `useState` para
 *              gestionar el estado de visibilidad booleano. Proporciona una API
 *              semántica y clara (`isOpen`, `open`, `close`, `toggle`) que mejora la
 *              legibilidad y la mantenibilidad de los componentes que controlan modales.
 */

import { useState, useCallback } from 'react';
import { clientLogger } from '@/lib/logger';

interface UseDialogStateProps {
  initialState?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

interface UseDialogStateReturn {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * @public
 * @function useDialogState
 * @description Encapsula la lógica de estado para un componente modal, proveyendo una API semántica y un callback para cambios de estado.
 * @param {UseDialogStateProps} [props={}] - Propiedades de configuración opcionales.
 * @returns {UseDialogStateReturn} Un objeto con el estado y los manejadores para controlar un diálogo.
 */
export function useDialogState({ initialState = false, onOpenChange }: UseDialogStateProps = {}): UseDialogStateReturn {
  const [isOpen, _setIsOpen] = useState(initialState);

  const setIsOpen = useCallback(
    (value: boolean) => {
      _setIsOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange],
  );

  const open = useCallback(() => {
    clientLogger.trace('[useDialogState] Abriendo diálogo.');
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    clientLogger.trace('[useDialogState] Cerrando diálogo.');
    setIsOpen(false);
  }, [setIsOpen]);

  const toggle = useCallback(() => {
    clientLogger.trace('[useDialogState] Alternando estado del diálogo.');
    _setIsOpen((prev) => {
      const newValue = !prev;
      onOpenChange?.(newValue);
      return newValue;
    });
  }, [onOpenChange]);

  return { isOpen, setIsOpen, open, close, toggle };
}

/**
 * @module useDialogState
 * @description Hook de UI para la gestión de estado de modales.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Integração com Parâmetros de URL:** Criar uma variante deste hook, `useUrlDialogState(paramName: string)`, que sincronize o estado `isOpen` com um parâmetro na URL (ex: `?modal=create-product`). Isso permitiria que modais pudessem ser abertos diretamente através de um link, uma característica de UX de élite.
 * - ((Vigente)) **Cierre Automático en Navegación:** Criar um novo hook `useAutoCloseDialogOnNavigate` que consuma este hook e a navegação de Next.js para fechar automaticamente qualquer diálogo aberto quando o usuário navegar para uma nova rota, prevenindo estados de UI inconsistentes.
 */
// src/lib/hooks/ui/useDialogState.ts
