// src/lib/hooks/ui/useDialogState.ts
'use client';

/**
 * @file Hook soberano para gestionar el estado de componentes modales (Dialog, Sheet, etc.).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
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

interface UseDialogStateReturn {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * @public
 * @function useDialogState
 * @description Encapsula la lógica de estado para un componente modal.
 * @param {boolean} [initialState=false] - El estado inicial de visibilidad.
 * @returns {UseDialogStateReturn} Un objeto con el estado y los manejadores para controlar un diálogo.
 */
export function useDialogState(initialState = false): UseDialogStateReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, setIsOpen, open, close, toggle };
}

/**
 * @module useDialogState
 * @description Hook de UI para la gestión de estado de modales.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Callback `onOpenChange`:** Adicionar um callback opcional `onOpenChange?: (isOpen: boolean) => void` como parâmetro, que seria invocado sempre que o estado mude. Isso permitiria que componentes pais executassem efeitos colaterais em resposta à mudança de estado do diálogo.
 * - ((Vigente)) **Integração com Parâmetros de URL:** Criar uma variante deste hook, `useUrlDialogState(paramName: string)`, que sincronize o estado `isOpen` com um parâmetro na URL (ex: `?modal=create-product`). Isso permitiria que modais pudessem ser abertos diretamente através de um link, uma característica de UX de élite.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolução de Dependência Crítica (TS2307):** A criação deste hook resolve uma dependência fundamental que impedia a compilação do módulo `campaigns-columns`.
 * - ((Implementada)) **API Semântica (DX):** Fornece uma API mais clara e menos propensa a erros (`open`, `close`) do que usar `useState(false)` diretamente, melhorando a experiência do desenvolvedor.
 */
// src/lib/hooks/ui/useDialogState.ts
