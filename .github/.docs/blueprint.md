Blueprint Conceptual de Élite: Proyecto "Restoralia"
1. Visión Ejecutiva y Propuesta de Valor (El "Porqué")
Restoralia es una plataforma SaaS (Software as a Service) de nivel de producción diseñada para ser el sistema operativo de inteligencia para restaurantes modernos. Su misión es empoderar a restaurantes independientes, pequeñas cadenas y ghost kitchens con herramientas de élite que antes solo estaban al alcance de grandes corporaciones, permitiéndoles optimizar operaciones, maximizar ingresos y construir relaciones duraderas con sus clientes.
Nuestra Propuesta de Valor Única (PUV) no es simplemente digitalizar un menú, sino inyectar inteligencia en cada paso del proceso: desde la ingeniería de menú predictiva hasta la gestión de pedidos en tiempo real y el marketing de fidelización automatizado.
2. Filosofía Arquitectónica (El "Cómo")
La arquitectura de Restoralia se rige por los principios de nuestro protocolo, garantizando un sistema robusto, escalable y mantenible.
Atomicidad Radical (Filosofía LEGO): Cada pieza del sistema es un "aparato" autocontenido. Un MenuItemCard, un OrderRow, un CustomerTag—cada uno es un componente puro, testeable y reutilizable, diseñado para ensamblarse perfectamente en orquestadores de UI más complejos.
Arquitectura Orientada a Dominios: El sistema está lógicamente desacoplado en dominios de negocio claros, cada uno con su propia capa de datos, lógica y componentes:
Catálogo: Gestión del menú, productos, categorías y modificadores.
Pedidos: Flujo completo desde la creación del carrito hasta la entrega.
Clientes: CRM, historial de pedidos y segmentación.
Operaciones: Dashboard de cocina y gestión de delivery en tiempo real.
Autenticación y Tenancy: Gestión de usuarios, roles y workspaces (restaurantes).
Seguridad por Defecto (Zero Trust): La arquitectura es multi-tenant desde su núcleo. Cada dato pertenece inequívocamente a un workspace (un restaurante). Las políticas de Row Level Security (RLS) en Supabase son la garantía de que un restaurante jamás podrá ver los datos de otro.
Full Observabilidad: El sistema de logger y reportErrorToDb que hemos definido es la espina dorsal. Cada acción crítica—un nuevo pedido, un fallo en el pago, una actualización de menú—será registrada y auditable, dándonos una visibilidad completa de la salud del sistema.
3. Desglose Detallado de Módulos (El "Qué")
Módulo 1: Gestión de Tenant y Equipo (Workspaces)
Entidad Central: workspaces. Cada workspace representa un restaurante o una sucursal.
Funcionalidad: Un usuario (profile) puede ser owner de múltiples workspaces e invitado como member a otros. Permite la creación/renombrado/eliminación de restaurantes y la gestión de personal a través del sistema de invitations que hemos definido.
Aparatos Clave: WorkspaceSwitcher, InviteMemberDialog, CreateWorkspaceForm (adaptados de convertikit).
Módulo 2: Catálogo Digital Inteligente (El Menú)
Entidades Centrales: products (items del menú), categories, y una futura tabla modifiers (ej. "extra queso", "sin cebolla").
Funcionalidad: Un constructor visual (similar al "Builder" de convertikit) para crear y organizar menús. Permite establecer precios, descripciones, imágenes y gestionar la disponibilidad (item_status ENUM: 'available', 'unavailable').
Ángulo de IA: Ingeniería de Menús Predictiva. La plataforma analizará datos de ventas para sugerir optimizaciones: qué ítems destacar, qué precios ajustar, o qué combos (product_bundles) crear para maximizar la rentabilidad.
Aparatos Clave: MenuBuilderCanvas, MenuItemCard, CategoryList.
Módulo 3: Flujo de Pedidos (La Experiencia del Cliente)
Funcionalidad:
Acceso: El cliente escanea un código QR en la mesa o accede a una URL pública (ej. restaurante-x.restoralia.app).
Carrito de Compras: Una experiencia fluida para añadir/quitar ítems, gestionada por un store global de cliente (useCartStore de Zustand).
Checkout: Un formulario simple para datos de entrega (si aplica) y pago seguro.
Integración de Pagos: Abstracción para integrarse con proveedores como Stripe o MercadoPago.
Aparatos Clave: PublicMenuView (el "site" público), CartPanel (un Sheet de shadcn), CheckoutForm.
Módulo 4: Puesto de Mando de Operaciones (El Restaurante)
Funcionalidad: Un dashboard en tiempo real para la cocina y el personal.
UI de Élite: Un Tablero Kanban (OrderKanbanBoard) con columnas que representan el order_status que definimos (pending, confirmed, preparing, out_for_delivery, delivered). Los nuevos pedidos aparecen en pending en tiempo real. El personal arrastra las tarjetas (OrderCard) entre columnas a medida que el pedido avanza.
Tecnología Clave: Supabase Realtime Subscriptions para actualizaciones instantáneas sin necesidad de recargar la página.
Aparatos Clave: OrderKanbanBoard, OrderCard, OrderDetailsModal.
Módulo 5: CRM y Fidelización
Funcionalidad: Una base de datos de todos los clientes que han hecho pedidos, vinculada a sus profiles. Permite ver el historial de pedidos, gasto total y frecuencia.
Ángulo de IA:
Segmentación Inteligente: El sistema puede taguear clientes automáticamente (ej. "VIP", "Cliente Frecuente", "Prefiere Vegano") basado en su comportamiento de compra.
Marketing Automatizado: Habilitar la creación de campañas de email marketing dirigidas a estos segmentos (ej. "Hace 30 días que no pides, aquí tienes un 10% de descuento").
Aparatos Clave: CustomerDataTable, CustomerDetailView, TagManager.
4. Stack Tecnológico Canónico
Framework: Next.js (App Router)
Lenguaje: TypeScript
Base de Datos y Auth: Supabase (PostgreSQL, Auth RLS, Realtime)
UI: Tailwind CSS, shadcn/ui, Framer Motion
Gestión de Estado (Cliente): Zustand
Internacionalización: next-intl
Pruebas: Vitest (Unit/Integration), Playwright (E2E)
Observabilidad: El sistema de logger que hemos definido, con Sentry en producción.