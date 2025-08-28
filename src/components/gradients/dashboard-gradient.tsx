// src/components/gradients/dashboard-gradient.tsx
/**
 * @file Componente de UI atómico y de presentación puro.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Renderiza las capas de fondo (grano y desenfoques) para el
 *              layout del dashboard, creando la estética visual de "Restoralia".
 */

export function DashboardGradient() {
  return (
    <>
      <div className={'dashboard-shared-top-grainy-blur'} />
      <div className={'dashboard-shared-bottom-grainy-blur'} />
      <div className={'grain-background dashboard-background-base h-full'}></div>
    </>
  );
}

/**
 * @module dashboard-gradient
 * @description Componente visual para el fondo del dashboard.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Animación de Fondo Sutil:** Proponho implementar esta melhoria na próxima fase de otimização da UI. Utilizar `framer-motion` para animar sutilmente a opacidade ou a posição dos elementos de desfoque em resposta ao movimento do mouse, adicionando um toque dinâmico e premium ao fundo.
 * - ((Vigente)) **Tema Reactivo:** As cores dos gradientes estão atualmente codificadas no CSS. Proponho refatorar o CSS para que utilize variáveis de tema (ex: `var(--primary-glow)`), permitindo que o fundo se adapte dinamicamente se o usuário mudar de tema (claro/escuro).
 */
// src/components/gradients/dashboard-gradient.tsx
