// src/app/checkout/page.tsx
'use server';

/**
 * @file Orquestador de servidor para la página de checkout de Restoralia.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este Server Component es el punto de entrada para la ruta `/checkout`.
 *              Ensambla el layout visual de la página y renderiza el componente
 *              de cliente `CheckoutView`, que gestiona toda la lógica interactiva.
 */

import { unstable_setRequestLocale } from 'next-intl/server';

import { CheckoutGradients } from '@/components/gradients/checkout-gradients';
import { CheckoutHeader } from '@/components/checkout/checkout-header';
import { CheckoutView } from '@/components/checkout/CheckoutView';
import { logger } from '@/lib/logger';
import '@/styles/checkout.css';

interface CheckoutPageProps {
  params: { locale: string };
}

export default async function CheckoutPage({ params: { locale } }: CheckoutPageProps) {
  unstable_setRequestLocale(locale);
  logger.trace('[CheckoutPage:Server] Renderizando orquestador de servidor.');

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-background">
      <CheckoutGradients />
      <main className="mx-auto max-w-7xl relative py-6 flex flex-col gap-6 justify-between">
        <div className="px-4 sm:px-6 lg:px-8">
          <CheckoutHeader />
        </div>
        <CheckoutView />
      </main>
    </div>
  );
}

/**
 * @module checkout-page
 * @description Página de servidor para el flujo de checkout.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Metadatos Dinámicos:** Proponho implementar a função `generateMetadata` para definir um `<title>` e metatags otimizados para esta página, utilizando `getTranslations` para obter o texto do namespace `CheckoutPage`.
 * - ((Vigente)) **Injeção de Dados do Servidor:** Proponho, em uma fase futura, que esta página obtenha a sessão do usuário no servidor (`await createClient().auth.getUser()`). Se o usuário estiver autenticado, seus dados (ex: nome, endereços salvos) poderiam ser passados como props para `CheckoutView` para pré-preencher o formulário, melhorando a UX.
 * - ((Vigente)) **ErrorBoundary de Rota:** Envolver o conteúdo da página em um `ErrorBoundary` do React para capturar erros de renderização no servidor e exibir uma UI de fallback graciosa, prevenindo que a aplicação inteira quebre.
 */
// src/app/checkout/page.tsx
