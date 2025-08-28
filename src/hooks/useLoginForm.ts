// src/hooks/useLoginForm.ts
/**
 * @file Hook soberano que encapsula la lógica de negocio para el formulario de inicio de sesión.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este hook gestiona el estado del formulario (email, password), invoca la
 *              Server Action de inicio de sesión y maneja el feedback al usuario (toasts).
 *              Desacopla completamente la lógica del componente de presentación.
 */
'use client';

import { useState } from 'react';
import { login } from '@/app/login/actions';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';

/**
 * @public
 * @function useLoginForm
 * @description Gestiona el estado y la lógica de envío para el formulario de inicio de sesión.
 * @returns Un objeto con el estado del formulario y los manejadores de eventos.
 */
export function useLoginForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @private
   * @function handleLogin
   * @description Manejador para el evento de envío del formulario. Invoca la Server Action,
   *              gestiona el estado de carga y muestra notificaciones de feedback.
   */
  const handleLogin = async () => {
    setIsLoading(true);
    logger.trace('[useLoginForm] Iniciando proceso de inicio de sesión.', { email });
    const result = await login({ email, password });

    if (result?.error) {
      logger.error('[useLoginForm] Fallo la acción de inicio de sesión.', { email, error: 'Server Action Error' });
      toast({
        title: 'Error de Inicio de Sesión',
        description: 'Email o contraseña incorrectos. Por favor, verifica tus credenciales.',
        variant: 'destructive',
      });
    } else {
      logger.info('[useLoginForm] Inicio de sesión exitoso, esperando redirección.', { email });
      // No se necesita toast de éxito, la acción redirige.
    }
    setIsLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
  };
}

/**
 * @module useLoginForm
 * @description Hook para la lógica del formulario de inicio de sesión.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Validación del Lado del Cliente:** Integrar `zod` con `react-hook-form` para validar el formato del email antes de enviar la petición.
 * - ((Vigente)) **Manejo de Errores Específicos:** Adaptar para que la `login` action devuelva claves de error i18n, permitiendo a este hook mostrar toasts más específicos y traducidos.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Desacoplamiento de Lógica (SRP):** Toda la lógica de estado y de negocio se ha extraído del componente de UI.
 * - ((Implementada)) **Testabilidad Mejorada:** La lógica ahora puede ser probada de forma aislada con `renderHook`.
 * - ((Implementada)) **Full Observabilidad:** Se han añadido logs de `trace`, `info` y `error` para monitorear el flujo de login.
 */
// src/hooks/useLoginForm.ts
