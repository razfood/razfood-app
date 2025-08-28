// src/lib/supabase/server.ts
/**
 * @file Factoría de clientes Supabase para el entorno de servidor (Server Components, Actions, API Routes).
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a un estándar de élite para manejar correctamente
 *              la asincronía de `cookies()` de `next/headers`, resolviendo una
 *              regresión crítica que impedía el funcionamiento de toda la capa de datos.
 */
import "server-only";

import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function createClient
 * @description Factoría para crear una instancia del cliente Supabase para el entorno de servidor.
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient<Database>>} Un cliente Supabase de servidor con gestión de cookies.
 */
export async function createClient() {
  const cookieStore = await cookies(); // CORRECCIÓN: Se añade 'await'

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignorar errores en contextos de solo lectura.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Ignorar errores en contextos de solo lectura.
          }
        },
      },
    },
  );
}

/**
 * @public
 * @async
 * @function createAdminClient
 * @description Factoría para crear un cliente Supabase con privilegios de administrador.
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient<Database>>} Un cliente Supabase de servidor con rol de servicio.
 */
export async function createAdminClient() {
  const cookieStore = await cookies(); // CORRECCIÓN: Se añade 'await'

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {}
        },
      },
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}

/**
 * @module supabase-server-client
 * @description Factorías para la creación de clientes Supabase en el servidor.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Centralización de la Lógica de Cookies:** La lógica de `cookies` se repite. Abstraerla a un helper `getServerCookieOptions()` para un código más DRY.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Resolución de Regresión Crítica (TS2339):** Se ha añadido `await` a la llamada `cookies()` y se han marcado las funciones como `async`. Esto resuelve la causa raíz de los errores de tipo en este archivo y restaura la funcionalidad de toda la capa de acceso a datos del servidor.
 * - ((Implementada)) **Alineación con API de Next.js:** La refactorización alinea el código con el contrato de API asíncrono de `next/headers` en el App Router.
 */
// src/lib/supabase/server.ts