// src/lib/validators/common.schemas.ts
/**
 * @file Schemas de validación y tipos comunes para toda la aplicación.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato es la Única Fuente de Verdad para los contratos de datos
 *              genéricos y reutilizables, como el tipo de retorno estándar para
 *              todas las Server Actions.
 */
import 'server-only';
import { z } from 'zod';

/**
 * @public
 * @typedef ActionResult
 * @description Un tipo de unión discriminada genérico para el resultado de las Server Actions.
 *              Proporciona un contrato tipo-seguro para manejar casos de éxito y de error.
 * @template TSuccess - El tipo de los datos en caso de éxito.
 * @template TError - El tipo de los datos o código de error en caso de fallo.
 */
export type ActionResult<TSuccess, TErrorData = unknown> =
  | { success: true; data: TSuccess }
  | { success: false; error: string; data?: TErrorData };

/**
 * @public
 * @constant UuidSchema
 * @description Schema de Zod reutilizable para validar que un string es un UUID válido.
 */
export const UuidSchema = z.string().uuid({ message: 'El ID proporcionado no es un UUID válido.' });

/**
 * @module common-schemas
 * @description Contratos de validación y tipos genéricos de Zod.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Schema de Paginación:** Criar um `PaginationSchema` genérico que valide parâmetros como `page`, `limit`, `sortBy`, e `sortOrder`. Este schema seria reutilizado em todas as funções de dados e Server Actions que implementem paginação.
 * - ((Vigente)) **Tipado de Errores Estricto:** Refatorar o tipo `ActionResult` para que o campo `error` aceite um tipo de união de strings literais (ex: `'error_unauthorized' | 'error_invalid_data'`) inferido de um objeto de erros central. Isso habilitaria a tradução tipo-segura de mensagens de erro na UI.
 */
// src/lib/validators/common.schemas.ts
