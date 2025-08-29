// src/lib/validators/index.ts
/**
 * @file Manifiesto (Barrel File) y API pública para todos los schemas y tipos de validación.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ensambla y re-exporta todas las definiciones atómicas de Zod
 *              y los tipos de validación. Es la Única Fuente de Verdad para acceder a los
 *              contratos de validación de la aplicación.
 */
import 'server-only';

export * from './common.schemas';
export * from './product.schemas';
export * from './site.schemas';

/**
 * @module validators-manifest
 * @description Punto de entrada para todos los schemas y tipos de validación de la aplicación.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Generación Automática:** Este arquivo é um candidato ideal para ser gerado e mantido por um script (`pnpm gen:manifests`) que leia a estrutura do diretório. Isso eliminaria a manutenção manual e preveniria erros de omissão, garantindo que o manifesto esteja sempre sincronizado com os arquivos existentes.
 * - ((Vigente)) **Exportaciones Nombradas:** Para evitar potenciais colisões de nomes entre schemas (ex: `NameSchema` em `product` vs. `site`), uma estratégia de élite seria usar exportações nomeadas (`export * as productSchemas from './product.schemas'`). Isso exigiria que os consumidores fossem mais explícitos (`productSchemas.NameSchema`), melhorando a clareza e prevenindo bugs sutis.
 */
// src/lib/validators/index.ts