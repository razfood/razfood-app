// src/components/authentication/login-form.tsx
/**
 * @file Componente de presentación puro para el formulario de inicio de sesión.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Refactorizado a un estándar de élite, este componente es ahora
 *              sin estado, agnóstico al contenido y consume el hook `useLoginForm`.
 */
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLoginForm } from '@/hooks/useLoginForm';
import { AuthenticationForm } from '@/components/authentication/authentication-form';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { loginAnonymously } from '@/app/login/actions';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';

export interface LoginFormTexts {
  title: string;
  guestButton: string;
  orSeparator: string;
  emailLabel: string;
  passwordLabel: string;
  submitButton: string;
  loadingButton: string;
  anonymousError: string;
}

export interface LoginFormProps {
  texts: LoginFormTexts;
}

export function LoginForm({ texts }: LoginFormProps) {
  const { toast } = useToast();
  const { email, setEmail, password, setPassword, isLoading, handleLogin } = useLoginForm();

  const handleAnonymousLogin = async () => {
    const result = await loginAnonymously();
    if (result?.error) {
      logger.error('[LoginForm] Fallo el login anónimo.', { error: 'Server Action Error' });
      toast({ description: texts.anonymousError, variant: 'destructive' });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}
    >
      <Image src={'/assets/icons/logo/aeroedit-icon.svg'} alt={'Meta-Bite Logo'} width={80} height={80} />
      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center'}>{texts.title}</div>
      <Button onClick={handleAnonymousLogin} type={'button'} variant={'secondary'} className={'w-full mt-6'}>
        {texts.guestButton}
      </Button>
      <div className={'flex w-full items-center justify-center'}>
        <Separator className={'w-5/12 bg-border'} />
        <div className={'text-border text-xs font-medium px-4'}>{texts.orSeparator}</div>
        <Separator className={'w-5/12 bg-border'} />
      </div>
      <AuthenticationForm
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        texts={{ emailLabel: texts.emailLabel, passwordLabel: texts.passwordLabel }}
      />
      <Button type={'submit'} variant={'secondary'} className={'w-full'} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? texts.loadingButton : texts.submitButton}
      </Button>
    </form>
  );
}

/**
 * @module LoginForm
 * @description Componente de UI para el formulario de inicio de sesión.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Desacoplamiento Total (SRP):** La lógica de estado y de negocio reside ahora en `useLoginForm`.
 * - ((Implementada)) **Full Internacionalización:** El componente es agnóstico al contenido y recibe todos los textos vía props.
 * - ((Implementada)) **Feedback de Carga Mejorado:** El botón de envío muestra un spinner y texto contextual durante el estado de carga.
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Abstracción a `AuthFormLayout`:** El layout visual (logo, título) es un patrón repetido que debería ser abstraído.
 */
// src/components/authentication/login-form.tsx
