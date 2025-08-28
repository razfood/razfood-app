// src/hooks/useSignUpForm.ts
/**
 * @file Hook soberano que encapsula la lógica de negocio para el formulario de registro.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este hook gestiona el estado del formulario (email, password), invoca la
 *              Server Action de registro y maneja el feedback al usuario (toasts).
 *              Desacopla completamente la lógica del componente de presentación.
 */
'use client';

import { useState } from 'react';
import { signup } from '@/app/signup/actions';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';

/**
 * @public
 * @function useSignUpForm
 * @description Gestiona el estado y la lógica de envío para el formulario de registro.
 * @returns Un objeto con el estado del formulario y los manejadores de eventos.
 */
export function useSignUpForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @private
   * @function handleSignUp
   * @description Manejador para el evento de envío del formulario. Invoca la Server Action,
   *              gestiona el estado de carga y muestra notificaciones de feedback.
   */
  const handleSignUp = async () => {
    setIsLoading(true);
    logger.trace('[useSignUpForm] Iniciando proceso de registro.', { email });
    const result = await signup({ email, password });

    if (result?.error) {
      logger.error('[useSignUpForm] Fallo la acción de registro.', { email, error: 'Server Action Error' });
      toast({
        title: 'Error de Registro',
        description: 'Ocurrió un problema al crear tu cuenta. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } else {
      logger.info('[useSignUpForm] Registro exitoso, esperando redirección.', { email });
      // No se necesita toast de éxito, ya que la acción redirige.
    }
    setIsLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSignUp,
  };
}

/**
 * @module useSignUpForm
 * @description Hook para la lógica del formulario de registro.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Validación del Lado del Cliente:** Integrar una librería como `zod` con `react-hook-form` para proporcionar validación en tiempo real en el cliente antes de enviar la petición al servidor. Esto mejora la UX y reduce la carga del servidor.
 * - ((Vigente)) **Feedback de Error Específico:** La Server Action `signup` podría devolver claves de error específicas (ej. `error_email_en_uso`) que este hook podría mapear a mensajes de toast internacionalizados y más descriptivos.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Desacoplamiento de Lógica (SRP):** Toda la lógica de estado y manejo de acciones se ha extraído del componente de UI, cumpliendo con el Principio de Responsabilidad Única.
 * - ((Implementada)) **Testabilidad Mejorada:** Al ser un hook, esta lógica ahora puede ser probada de forma aislada y unitaria con `renderHook`, sin necesidad de renderizar la UI.
 * - ((Implementada)) **Full Observabilidad:** Se han añadido logs de `trace`, `info` y `error` para monitorear el flujo de registro.
 */
// src/hooks/useSignUpForm.ts
