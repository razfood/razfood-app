// src/components/authentication/sign-up-form.tsx
/**
 * @file Componente de presentación puro para el formulario de registro.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a un estándar de élite. Ahora es un componente
 *              de presentación puro, sin estado y agnóstico al contenido. Consume el hook
 *              `useSignUpForm` para obtener toda su lógica y estado, y recibe todos los textos
 *              a través de props, cumpliendo con la "Filosofía LEGO" y el SRP.
 */
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import { AuthenticationForm } from '@/components/authentication/authentication-form';
import { Loader2 } from 'lucide-react';

/**
 * @public
 * @interface SignupFormTexts
 * @description Contrato de datos para los textos de internacionalización (i18n)
 *              requeridos por este componente.
 */
export interface SignupFormTexts {
  title: string;
  submitButton: string;
  loadingButton: string;
  emailLabel: string;
  passwordLabel: string;
}

/**
 * @public
 * @interface SignupFormProps
 * @description Contrato de props para el componente SignupForm.
 */
export interface SignupFormProps {
  texts: SignupFormTexts;
}

/**
 * @public
 * @component SignupForm
 * @description Renderiza la estructura visual del formulario de registro.
 * @param {SignupFormProps} props - Propiedades que contienen los textos para la UI.
 * @returns {React.ReactElement}
 */
export function SignupForm({ texts }: SignupFormProps): React.ReactElement {
  const { email, setEmail, password, setPassword, isLoading, handleSignUp } = useSignUpForm();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignUp();
      }}
      className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}
    >
      <Image src={'/assets/icons/logo/aeroedit-icon.svg'} alt={'Meta-Bite Logo'} width={80} height={80} />
      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center'}>{texts.title}</div>
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
 * @module SignupForm
 * @description Componente de UI para el formulario de registro.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Abstracción a `AuthFormLayout`:** El layout visual (logo, título, contenedor) es casi idéntico al del `LoginForm`. Proponer la creación de un componente de layout `AuthFormLayout` que acepte el formulario específico como `children` para maximizar el cumplimiento del principio DRY.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Desacoplamiento Total (SRP):** El componente ahora es 100% presentacional. Toda la lógica de estado y de negocio reside en el hook `useSignUpForm`, haciendo que este componente sea más simple, predecible y fácil de probar visualmente.
 * - ((Implementada)) **Full Internacionalización:** El componente es agnóstico al contenido. Todas las etiquetas y textos son inyectados a través de la prop `texts`, preparándolo para ser consumido por una página que maneje `next-intl`.
 * - ((Implementada)) **Feedback de Carga Mejorado:** El botón de envío ahora muestra un spinner y texto contextual (`loadingButton`) durante el estado de carga, mejorando la UX.
 */
// src/components/authentication/sign-up-form.tsx
