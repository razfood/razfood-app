// src/components/sites/SitesGrid.tsx
/**
 * @file Componente de presentación puro que renderiza una cuadrícula de menús (sites).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a un estándar de élite para ensamblar
 *              los componentes `SiteCard`, `SiteCardHeader` y `SiteCardFooter` siguiendo
 *              el patrón de composición de slots. Incluye animaciones de entrada para una UX superior.
 */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { logger } from '@/lib/logger';
import { SiteCard } from './SiteCard';
import { SiteCardFooter } from './SiteCardFooter';
import { SiteCardHeader } from './SiteCardHeader';

// Placeholder para el tipo de dato
type SiteWithCampaignCount = { id: string; name: string; subdomain: string | null; campaign_count: number };

interface SitesGridProps {
  sites: SiteWithCampaignCount[];
  // Props para pasar a los componentes hijos
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
}

export function SitesGrid({ sites, onDelete, isPending, deletingSiteId }: SitesGridProps): React.ReactElement {
  logger.trace('[SitesGrid] Renderizando cuadrícula de sitios ensamblada.', { count: sites.length });

  if (sites.length === 0) {
    return (
      <Card className="flex h-64 flex-col items-center justify-center p-8 text-center border-dashed">
        <h3 className="text-xl font-semibold">No se encontraron menús</h3>
        <p className="mt-2 text-muted-foreground">Intenta con otra búsqueda o crea un nuevo menú para empezar.</p>
      </Card>
    );
  }

  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const FADE_UP = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence>
        {sites.map((site) => (
          <motion.div key={site.id} variants={FADE_UP} exit={{ opacity: 0, scale: 0.9 }} layout>
            <SiteCard
              siteId={site.id}
              headerSlot={
                <SiteCardHeader site={site} onDelete={onDelete} isPending={isPending} deletingSiteId={deletingSiteId} />
              }
              footerSlot={
                <SiteCardFooter site={site} onDelete={onDelete} isPending={isPending} deletingSiteId={deletingSiteId} />
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * @module sites-grid
 * @description Componente para visualizar los menús en formato de cuadrícula.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Virtualización:** Proponho, para otimizar o desempenho em workspaces com centenas de sites, implementar a virtualização da grade usando `@tanstack/react-virtual`. Isso renderizaria apenas os cartões visíveis no viewport, mantendo a performance constante.
 * - ((Vigente)) **Internacionalización (i18n):** Proponho refatorar o estado vazio para que seus textos ("No se encontraron menús", etc.) sejam recebidos via props, permitindo a tradução pelo componente pai `SitesPageClient`.
 */
// src/components/sites/SitesGrid.tsx
