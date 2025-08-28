// src/components/sites/SiteCard.tsx
/**
 * @file Orquestador de UI y plantilla de composición para una tarjeta de sitio (menú).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Refactorizado a un estándar de élite, este componente ahora utiliza el
 *              patrón de "slots nombrados" (`headerSlot`, `footerSlot`). Actúa como
 *              un layout puro para una tarjeta, desacoplado completamente de su contenido,
 *              lo que permite máxima flexibilidad y reutilización.
 */
import React from 'react';
import { Card as CardPrimitive, CardContent } from '@/components/ui/card';
import { logger } from '@/lib/logger';

interface SiteCardProps {
  headerSlot: React.ReactNode;
  footerSlot: React.ReactNode;
  contentSlot?: React.ReactNode; // Slot opcional para contenido futuro
  siteId: string;
}

export function SiteCard({ headerSlot, footerSlot, contentSlot, siteId }: SiteCardProps): React.ReactElement {
  logger.trace(`[SiteCard] Renderizando tarjeta-layout para sitio: ${siteId}`);
  return (
    <CardPrimitive className="flex flex-col justify-between h-full transition-all hover:border-primary/50 hover:shadow-lg">
      <div>
        {headerSlot}
        {contentSlot && <CardContent>{contentSlot}</CardContent>}
      </div>
      {footerSlot}
    </CardPrimitive>
  );
}

/**
 * @module site-card-layout
 * @description Componente de layout puro para tarjetas de sitio.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Animaciones de Hover en Slots:** Proponho, numa fase de otimização da UI, que este componente utilize `React.cloneElement` para injetar props nos `slots` filhos (ex: `isHovering`). Isso permitiria que o conteúdo interno (como os botões no footer) reaja visualmente quando o usuário passar o mouse sobre o cartão principal, criando uma UX mais rica e coesa.
 * - ((Vigente)) **Variantes de Estado:** Proponho adicionar uma prop `status` que aplique classes CSS diferentes ao cartão principal para refletir o estado do site (ex: um brilho sutil para `published`, uma opacidade reduzida para `archived`).
 */
// src/components/sites/SiteCard.tsx
