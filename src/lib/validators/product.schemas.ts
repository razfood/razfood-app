// src/lib/validators/product.schemas.ts
/**
 * @file Schemas de validación Zod para la entidad 'products'.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Define los contratos de datos y las reglas de validación para la
 *              creación y actualización de productos (ítems del menú). Ha sido
 *              refactorizado para incluir el schema de actualización.
 */
import { z } from 'zod';

// --- Schemas Atómicos Reutilizables ---

/**
 * @description Valida el nombre de un producto.
 */
export const NameSchema = z
  .string({ required_error: 'El nombre es requerido.' })
  .trim()
  .min(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  .max(80, { message: 'El nombre no puede exceder los 80 caracteres.' });

/**
 * @description Valida el precio de un producto. Coacciona el valor a número.
 */
export const PriceSchema = z.coerce // Coerce convierte el string del input a número
  .number({ invalid_type_error: 'El precio debe ser un número.' })
  .min(0, { message: 'El precio no puede ser negativo.' })
  .multipleOf(0.01, { message: 'El precio debe tener como máximo 2 decimales.' });

// --- Schemas de Entidad ---

/**
 * @description Schema para la validación de datos del lado del cliente al crear un producto.
 */
export const CreateProductClientSchema = z.object({
  name: NameSchema,
  price: PriceSchema,
  description: z.string().optional(),
  siteId: z.string().uuid('ID de sitio inválido.'),
});

/**
 * @description Schema para la validación de datos del lado del cliente al actualizar un producto.
 *              Permite actualizaciones parciales.
 */
export const UpdateProductClientSchema = z.object({
  productId: z.string().uuid('ID de producto inválido.'),
  name: NameSchema.optional(),
  price: PriceSchema.optional(),
  description: z.string().optional(),
});
/**
 * @module product-schemas
 * @description Contratos de validación Zod para la entidad de productos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Schema de Servidor con Transformación:** Proponho criar schemas de servidor correspondentes (`CreateProductServerSchema`, `UpdateProductServerSchema`) que utilizem `.transform()` para converter os nomes de campo para `snake_case` antes da inserção no banco de dados. Isso centralizaria a transformação de dados e manteria as Server Actions mais limpas.
 * - ((Vigente)) **Validación de `status`:** Quando a lógica para alterar o status de um produto for implementada, os schemas de atualização deverão incluir `status: z.enum(['available', 'unavailable', 'sold_out']).optional()` para garantir que apenas valores válidos sejam aceitos.
 * - ((Vigente)) **Validación de `image_url`:** Proponho adicionar `image_url: z.string().url().optional()` aos schemas quando a funcionalidade de upload de imagens for implementada, para garantir que apenas URLs válidas sejam armazenadas.
 */
// src/lib/validators/product.schemas.ts
