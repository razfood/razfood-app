// src/lib/validators/site.schemas.ts
/**
 * @file Schemas de validación Zod para la entidad 'sites'.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Define los contratos de datos y las reglas de validación para la
 *              creación y actualización de sitios (menús).
 */
import { z } from 'zod';

export const UuidSchema = z.string().uuid({ message: 'ID de workspace inválido.' });

export const NameSchema = z
  .string({ required_error: 'El nombre es requerido.' })
  .trim()
  .min(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  .max(40, { message: 'El nombre no puede exceder los 40 caracteres.' });

export const SubdomainSchema = z
  .string()
  .trim()
  .min(3, { message: 'El subdominio debe tener al menos 3 caracteres.' })
  .regex(/^[a-z0-9-]+$/, {
    message: 'Solo se permiten letras minúsculas, números y guiones.',
  })
  .transform((subdomain) => subdomain.toLowerCase());

export const CreateSiteClientSchema = z.object({
  name: NameSchema.optional(),
  subdomain: SubdomainSchema,
  description: z.string().optional(),
  workspaceId: UuidSchema,
});
// src/lib/validators/site.schemas.ts
