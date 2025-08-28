// src/lib/types/database/enums.ts
/**
 * @file Contiene las definiciones de tipo para todos los ENUMs de la base de datos de Restoralia.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este archivo es una transcripción manual y de alta fidelidad de los tipos
 *              ENUM definidos en el esquema SQL. Es la SSoT para los tipos de unión
 *              de string literales, garantizando la seguridad de tipos en toda la aplicación.
 */
export type Enums = {
  app_role: 'user' | 'admin' | 'developer';
  plan_type: 'free' | 'basic' | 'pro' | 'enterprise';
  workspace_role: 'owner' | 'admin' | 'member';
  order_status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  product_status: 'available' | 'unavailable' | 'sold_out';
  invitation_status: 'pending' | 'accepted' | 'declined' | 'expired';
  site_status: 'draft' | 'published' | 'archived'; // Heredado de convertikit, representa el estado de un Menú
};

/**
 * @module database-enums
 * @description Manifiesto de tipos para los ENUMs de la base de datos.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Generación Automática desde la Base de Datos:** El paso de élite final para este aparato es reemplazar este archivo manual por uno generado automáticamente. Crear un script (`pnpm gen:db:enums`) que se conecte a la base de datos, introspeccione los `pg_enum` y genere este archivo de tipos. Esto eliminaría cualquier posibilidad de desincronización.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **SSoT de Tipos para Lógica de Negocio:** Establece los tipos fundamentales que serán utilizados en toda la lógica de negocio y de permisos (ej. comprobaciones de roles, manejo de estados de pedidos).
 * - ((Implementada)) **Sincronización Completa con el Esquema SQL:** Este archivo refleja con precisión todos los tipos ENUM que hemos definido en los scripts de la base de datos, incluyendo los adaptados al dominio de "Restoralia".
 */
// src/lib/types/database/enums.ts
