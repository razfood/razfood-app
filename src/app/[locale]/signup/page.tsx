// src/app/[locale]/signup/page.tsx
/**
 * @file Orquestador de UI y datos para la página de registro de Restoralia.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este Server Component ha sido refactorizado para utilizar la API `setRequestLocale`
 *              canónica de `next-intl` v3+, resolviendo un error de compilación crítico
 *              y asegurando la correcta generación de metadatos y renderizado estático.
 */
import { getTranslations, setRequestLocale } from "next-intl/server"; // CORRECCIÓN DE API

import { GhLoginButton } from "@/components/authentication/gh-login-button";
import { SignupForm, type SignupFormTexts } from "@/components/authentication/sign-up-form";
import { LoginCardGradient } from "@/components/gradients/login-card-gradient";
import { LoginGradient } from "@/components/gradients/login-gradient";
import { logger } from "@/lib/logger";
import { Link } from "@/lib/navigation";
import "@/styles/login.css";

interface SignupPageProps {
  params: { locale: string };
}

export default async function SignupPage({ params: { locale } }: SignupPageProps) {
  // --- INICIO DE REFACTORIZACIÓN DE API (next-intl v3+) ---
  // Se reemplaza 'unstable_setRequestLocale' por la API estable 'setRequestLocale'.
  setRequestLocale(locale);
  // --- FIN DE REFACTORIZACIÓN DE API ---

  logger.trace("[SignupPage] Renderizando orquestador de servidor.");

  const t = await getTranslations("pages.SignUpPage");

  const signupFormTexts: SignupFormTexts = {
    title: t("title"),
    submitButton: t("submitButton"),
    loadingButton: t("loadingButton"),
    emailLabel: t("emailLabel"),
    passwordLabel: t("passwordLabel"),
  };

  return (
    <div>
      <LoginGradient />
      <div className={'flex flex-col'}>
        <div
          className={
            'mx-auto mt-[112px] bg-background/80 w-[343px] md:w-[488px] gap-5 flex-col rounded-lg rounded-b-none login-card-border backdrop-blur-[6px]'
          }
        >
          <LoginCardGradient />
          <SignupForm texts={signupFormTexts} />
        </div>
        <GhLoginButton label={t("githubButton")} />
        <div
          className={
            'mx-auto w-[343px] md:w-[488px] bg-background/80 backdrop-blur-[6px] px-6 md:px-16 pt-0 py-8 gap-6 flex flex-col items-center justify-center rounded-b-lg'
          }
        >
          <div className={'text-center text-muted-foreground text-sm mt-4 font-medium'}>
            {t("loginPrompt")}{' '}
            <Link href={'/login'} className={'text-white'}>
              {t("loginLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @module SignupPage
 * @description Página de registro de la aplicación Restoralia.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolución de Regresión Crítica (TS2305):** Se ha reemplazado la API obsoleta por `setRequestLocale`, resolviendo la causa raíz del error de compilación y restaurando la funcionalidad de renderizado estático para esta ruta.
 * - ((Implementada)) **Alineación con `next-intl` v3+:** El código ahora cumple con el contrato de la versión actual de la librería.
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Abstracción de Layout:** Crear un `AuthPageLayout` para reducir la duplicación de JSX entre esta página y la de login.
 */
// src/app/[locale]/signup/page.tsx