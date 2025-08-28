// src/components/sites/SiteCardFooter.tsx
/**
 * @file Componente de presentación soberano para el pie de página de una SiteCard.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato renderiza la información de resumen (conteo de productos)
 *              y la acción principal ("Gestionar") para una tarjeta de menú. Es soberano
 *              en su consumo de i18n y completamente agnóstico al contexto.
 */
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { CardFooter as CardFooterPrimitive } from '@/components/ui/card';
import { Link } from '@/lib/navigation';
import { logger } from '@/lib/logger';

// Tipo de dato que espera este componente
type SiteInfo = { id: string; campaign_count: number };

export interface SiteCardFooterProps {
  site: SiteInfo;
}

export function SiteCardFooter({ site }: SiteCardFooterProps): React.ReactElement {
  logger.trace(`[SiteCardFooter] Renderizando para sitio: ${site.id}`);
  const t = useTranslations('SitesPage.card');

  return (
    <CardFooterPrimitive className="pt-0 p-6 flex justify-between items-center border-t mt-4">
      <div className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{site.campaign_count}</span>{' '}
        {t('campaignCount', { count: site.campaign_count })}
      </div>
      <Button variant="outline" asChild>
        <Link
          href={{
            pathname: '/dashboard/sites/[siteId]/campaigns',
            params: { siteId: site.id },
          }}
        >
          {t('manageCampaignsButton')}
        </Link>
      </Button>
    </CardFooterPrimitive>
  );
}

/**
 * @module site-card-footer
 * @description Componente de pie de página para la tarjeta de un sitio (menú).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Estadísticas Rápidas Adicionales:** Proponho, em uma fase futura, adicionar um pequeno ícone de gráfico de barras ao lado do contador de produtos. Ao passar o mouse sobre ele (`Tooltip`), poderia exibir estatísticas rápidas como "Visitantes (últimos 7 dias)" ou "Taxa de Conversão Média", fornecendo insights acionáveis diretamente no cartão.
 * - ((Vigente)) **Lógica de Pluralización Avanzada:** A biblioteca `next-intl` suporta regras de pluralização complexas. A chave `campaignCount` pode ser refatorada para usar essas regras de forma mais robusta para idiomas com múltiplas formas plurais, garantindo uma internacionalização de elite.
 */
// src/components/sites/SiteCardFooter.tsx
