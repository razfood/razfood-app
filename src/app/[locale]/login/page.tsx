// src/app/[locale]/login/page.tsx
/**
 * @file Orquestador de UI y datos para la página de inicio de sesión de Restoralia.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este Server Component carga las traducciones y ensambla la UI de la página
 *              de inicio de sesión, inyectando los textos en los componentes puros.
 */
import { getTranslations, setRequestLocale } from "next-intl/server";

import { GhLoginButton } from "@/components/authentication/gh-login-button";
import { LoginForm, type LoginFormTexts } from "@/components/authentication/login-form";
import { LoginCardGradient } from "@/components/gradients/login-card-gradient";
import { LoginGradient } from "@/components/gradients/login-gradient";
import { logger } from "@/lib/logger";
import { Link } from "@/lib/navigation";
import "@/styles/login.css";

interface LoginPageProps {
  params: { locale: string };
}

export default async function LoginPage({ params: { locale } }: LoginPageProps) {
  setRequestLocale(locale);
  logger.trace("[LoginPage] Renderizando orquestador de servidor.");

  const t = await getTranslations("pages.LoginPage");

  const loginFormTexts: LoginFormTexts = {
    title: t("title"),
    guestButton: t("guestButton"),
    orSeparator: t("orSeparator"),
    emailLabel: t("emailLabel"),
    passwordLabel: t("passwordLabel"),
    submitButton: t("submitButton"),
    loadingButton: t("loadingButton"),
    anonymousError: t("anonymousError"),
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
          <LoginForm texts={loginFormTexts} />
        </div>
        <GhLoginButton label={t("githubButton")} />
        <div
          className={
            'mx-auto w-[343px] md:w-[488px] bg-background/80 backdrop-blur-[6px] px-6 md:px-16 pt-0 py-8 gap-6 flex flex-col items-center justify-center rounded-b-lg'
          }
        >
          <div className={'text-center text-muted-foreground text-sm mt-4 font-medium'}>
            {t("signupPrompt")}{' '}
            <Link href={'/signup'} className={'text-white'}>
              {t("signupLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @module LoginPage
 * @description Página de inicio de sesión de la aplicación Restoralia.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Abstracción de Layout:** Proponho implementar esta melhoria na próxima fase de refatoração da UI. Criar um `AuthPageLayout` que encapsule a estrutura visual repetida (gradientes, cartão central) para ser usada tanto aqui quanto na página de registro, aderindo estritamente ao princípio DRY.
 */
// src/app/[locale]/login/page.tsx