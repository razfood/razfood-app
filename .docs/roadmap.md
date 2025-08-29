Blueprint Conceptual de Élite: Proyecto "Restoralia" (Revisión Detallada)
1. Visión Ejecutiva y Propuesta de Valor (El "Porqué")
Restoralia es una plataforma SaaS (Software as a Service) multi-tenant de nivel de producción, diseñada para ser el sistema operativo de inteligencia para restaurantes modernos. Su misión es empoderar a restaurantes, cadenas y ghost kitchens con herramientas de élite que optimicen sus operaciones, maximicen ingresos y construyan relaciones duraderas con sus clientes.
Nuestra Propuesta de Valor Única (PUV) no es simplemente digitalizar un menú, sino inyectar inteligencia y automatización en cada paso del proceso:
Para el Dueño del Restaurante: Un centro de mando unificado (Dashboard) para gestionar múltiples sucursales (Workspaces), diseñar menús digitales (Sites y Products), y obtener analíticas claras sobre el rendimiento del negocio.
Para el Personal de Cocina: Un tablero de pedidos en tiempo real (Order Kanban) que actualiza el estado de los pedidos de forma instantánea, desde la recepción hasta la preparación.
Para el Cliente Final: Una experiencia de pedido fluida y sin fricciones a través de menús digitales accedidos por URL o código QR.
Para el Motorista (Futuro): Una aplicación nativa dedicada para la gestión de entregas.
2. Filosofía y Arquitectura (El "Cómo")
La arquitectura se rige por los principios de nuestro protocolo:
Atomicidad Radical (Filosofía LEGO): Cada pieza es un "aparato" autocontenido y soberano.
UI: Componentes React puros (sin lógica de estado) que reciben datos y callbacks.
Lógica de UI: Hooks de cliente (use...) que encapsulan el estado, la validación y la interacción del usuario.
Lógica de Servidor: Server Actions atómicas que realizan una única operación de negocio.
Esquema DB: Tablas normalizadas con responsabilidades únicas y triggers para lógica transaccional.
Arquitectura Orientada a Dominios: El sistema está desacoplado en dominios de negocio claros:
Auth & Tenancy: Gestión de profiles, workspaces, members, invitations.
Catalog: Gestión de sites (menús) y products (ítems del menú).
Orders: Gestión de orders y order_items.
Analytics: Ingesta de datos en visitor_logs y audit_logs.
Seguridad por Defecto (Zero Trust): La arquitectura es multi-tenant desde su núcleo. Row Level Security (RLS) en Supabase es la garantía de que un restaurante (workspace) jamás podrá ver los datos de otro.
Capa de Datos Unificada (GraphQL): Si bien las Server Actions interactúan con Supabase, la estrategia a largo plazo es que lo hagan a través de una API de GraphQL. Esto crea una capa de abstracción robusta, proporcionando una SSoT para la lógica de negocio y permitiendo que múltiples clientes (Web, iOS, Android) consuman los mismos datos de forma segura y eficiente.
Full Observabilidad: El logger centralizado y la tabla logs son la espina dorsal. Cada acción crítica y cada error son registrados.
Roadmap Detallado para Futuros Hilos de Desarrollo
Este roadmap es una guía secuencial para construir "Restoralia" sobre la fundación que hemos establecido.
Fase 1: Completar el CRUD del Catálogo (Este Hilo)
Tabla de Productos: Construir la UI para visualizar la lista de products dentro de un site (la tabla CampaignsDataTable que estaba pendiente).
Acciones de Servidor: Crear las Server Actions createProductAction, updateProductAction, deleteProductAction.
Integración Completa: Conectar la UI (formularios, diálogos, tabla) a las Server Actions, implementando UI optimista.
Internacionalización (i18n): Refactorizar todos los componentes del pilar "Campaigns" para que sean agnósticos al contenido.
Fase 2: El Flujo de Pedido del Cliente (Nuevo Hilo)
Vista Pública del Menú (Site): Crear la ruta /[subdomain] que renderice un SiteView (Server Component) con los products de ese menú.
Gestión de Estado del Carrito: Implementar useCartStore (Zustand) para gestionar el estado del carrito de compras en el cliente.
Componentes del Carrito: Construir los componentes de UI AddToCartButton, CartPanel (Sheet), CartItem.
Proceso de Checkout:
Crear la página /checkout que muestre un resumen del carrito (CartSummary).
Construir el CheckoutForm para capturar la dirección de entrega.
Crear la Server Action createOrderAction, que validará el carrito y creará los registros en las tablas orders y order_items.
Integración de Pagos (Stripe):
Crear una capa de abstracción (/lib/payments).
Integrar el SDK de Stripe. Modificar createOrderAction para generar un payment_intent.
El CheckoutForm usará el SDK de Stripe.js para completar el pago.
Fase 3: El Dashboard de Operaciones (Nuevo Hilo)
Página de Pedidos: Crear la ruta /dashboard/orders.
Tablero Kanban: Construir el componente OrderKanbanBoard que mostrará columnas para cada order_status.
Integración en Tiempo Real: Utilizar las Realtime Subscriptions de Supabase para que los nuevos pedidos aparezcan en la columna "Pending" instantáneamente.
Acciones de Operaciones:
Crear la Server Action updateOrderStatusAction.
Implementar la funcionalidad de arrastrar y soltar (drag-and-drop) en el Kanban para invocar esta acción y cambiar el estado de un pedido.
Notificaciones: Implementar un sistema de notificaciones en tiempo real (ej. un Toast "Nuevo Pedido Recibido") para el personal de cocina.
Fase 4: La API de GraphQL (Nuevo Hilo)
Configuración del Servidor GraphQL: Configurar un servidor Apollo Server (o similar) dentro de la ruta /api/graphql de Next.js.
Definición de Schemas y Resolvers:
Definir los tipos GraphQL para Workspace, Site, Product, Order, User, etc.
Escribir los resolvers que encapsularán la lógica de negocio para consultar y mutar datos, interactuando con la capa de datos de Supabase.
Refactorización de Server Actions: Refactorizar todas las Server Actions para que, en lugar de llamar directamente a Supabase, se conviertan en clientes de nuestra propia API de GraphQL. Esto centraliza la lógica de negocio en un solo lugar.
Seguridad: Implementar la lógica de autenticación y autorización (basada en el workspace_role) directamente en la capa de GraphQL.
Fase 5: Aplicaciones Nativas y Expansión (Futuro)
App para Clientes (Nativa): Desarrollar la aplicación para iOS/Android que consumirá la API de GraphQL para el historial de pedidos, seguimiento en tiempo real y reordenación.
App para Motoristas (Nativa): Desarrollar la aplicación que permitirá a los motoristas ver y aceptar pedidos asignados, y actualizar su estado.
Módulo de Analíticas: Construir un dashboard de analíticas que procese los datos de visitor_logs y orders para proporcionar insights al dueño del restaurante.
Gestión de Tareas y Secuenciación (GTS)
Declaración de Finalización: El blueprint conceptual completo y el roadmap detallado para el proyecto Restoralia han sido establecidos.
Anuncio del Siguiente Paso: Retomando el plan del hilo actual, el siguiente paso es construir la UI para visualizar los productos existentes. Procederé a crear el src/components/campaigns/CampaignsDataTable.tsx, que mostrará los productos del menú en una vista de tabla.
---
acualzacon
// .docs/roadmap.md
# Blueprint Conceptual de Élite: razfood (Revisión Detallada)
## 1. Visión Ejecutiva y Propuesta de Valor (El "Porqué")
**razfood** es una plataforma SaaS (Software as a Service) multi-tenant de nivel de producción, diseñada para ser el sistema operativo de inteligencia para restaurantes modernos.

... (contenido sin cambios) ...

## 4. Roadmap Detallado para Futuros Hilos de Desarrollo
Este roadmap es una guía secuencial para construir "razfood" sobre la fundación que hemos establecido.

### Fase 1: Migración de Infraestructura de Datos a Prisma (Prioridad Cero)
*   **Objetivo:** Reemplazar el acceso directo a datos vía `supabase-js` por el ORM Prisma para obtener seguridad de tipos de élite, una DX superior y una gestión de migraciones declarativa.
*   **Acción:**
    1.  **Sincronización:** Introspeccionar la base de datos existente para generar el `schema.prisma` inicial (`pnpm prisma db pull`).
    2.  **Cliente:** Generar el cliente de Prisma tipado (`pnpm prisma generate`).
    3.  **Refactorización de Capa de Datos:** Migrar incrementalmente todos los aparatos en `src/lib/data/` para que utilicen el cliente Prisma en lugar del cliente Supabase.
    4.  **Refactorización de Resolvers/Actions:** Asegurar que toda la lógica de negocio consuma la nueva capa de datos basada en Prisma.

### Fase 2: Completar el CRUD del Catálogo (Este Hilo)
*   **Tabla de Productos:** Construir la UI para visualizar la lista de `products` dentro de un `site`.
*   **Acciones de Servidor:** Crear las Server Actions `createProductAction`, `updateProductAction`, `deleteProductAction` (que ahora consumirán la capa de datos de Prisma).
*   **Integración Completa:** Conectar la UI a las Server Actions, implementando UI optimista.
*   **Internacionalización (i18n):** Refactorizar todos los componentes del pilar "Products".

### Fase 3: El Flujo de Pedido del Cliente (Nuevo Hilo)
... (resto de fases re-numeradas sin cambios de contenido) ...

/**
 * @module roadmap
 * @description Hoja de ruta estratégica del proyecto razfood.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Roadmap Interactivo:** Migrar este roadmap a uma ferramenta de gestão de projetos (como Linear ou Notion) com timelines, responsáveis e dependências explícitas para uma gestão de élite.
 * - ((Vigente)) **Métricas de Éxito por Fase:** Definir KPIs específicos para cada fase (ex: "Fase 3: Redução do tempo de checkout em 15%") para medir o impacto de cada ciclo de desenvolvimento.
 */
// .docs/roadmap.md