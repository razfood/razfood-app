// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file Define el contrato de datos para el namespace 'pages.SignUpPage'.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este schema de Zod es la SSoT para la estructura de los textos de la página de registro.
 */
import { z } from 'zod';

export const SignUpPageSchema = z.object({
  title: z.string(),
  submitButton: z.string(),
  loadingButton: z.string(),
  emailLabel: z.string(),
  passwordLabel: z.string(),
  githubButton: z.string(),
  loginPrompt: z.string(),
  loginLink: z.string(),
});
// src/lib/validators/i18n/SignUpPage.schema.ts
