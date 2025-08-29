// .docs/api-blueprint.md
# Blueprint de API de Élite: GraphQL para "Restoralia OS"

## 1. Arquitectura de la API

*   **Endpoint:** Único en `/api/graphql`.
*   **Protocolos:** HTTPS para Queries/Mutations, WSS (WebSockets) para Subscriptions.
*   **Autenticación:** Cada petición debe incluir un `Authorization: Bearer <Supabase JWT>` en las cabeceras. El contexto de Apollo validará este token con Supabase Auth en cada petición. Las peticiones no autenticadas solo podrán acceder a un subconjunto de queries públicas (ej. `getRestaurantDirectory`).
*   **Autorización:** La lógica de permisos se implementará en dos capas:
    1.  **Nivel de Resolver:** Cada resolver verificará si el `user` en el contexto tiene el rol apropiado para acceder o mutar el recurso solicitado (ej. `requireWorkspacePermission`).
    2.  **Nivel de Base de Datos:** Las políticas de RLS de Supabase actúan como una segunda línea de defensa infalible.
*   **Optimización (Prevención N+1):** El contexto de Apollo inicializará una instancia de `Dataloader` para cada entidad relacional (`User`, `Workspace`, `Site`, etc.). Los resolvers de campos anidados (ej. `Order.customer`) **siempre** utilizarán el Dataloader correspondiente (`context.loaders.userLoader.load(parent.customer_id)`).

## 2. Grafo de Dominios de Negocio

Este grafo muestra las entidades principales y sus relaciones, que serán modeladas en el esquema GraphQL.

```mermaid
erDiagram
    USER ||--o{ WORKSPACE_MEMBER : "es miembro de"
    USER ||--o{ ORDER : "realiza"
    WORKSPACE ||--|{ WORKSPACE_MEMBER : "tiene"
    WORKSPACE ||--|{ SITE : "contiene"
    WORKSPACE ||--|{ ORDER : "recibe"
    SITE ||--|{ PRODUCT : "contiene"
    ORDER ||--|{ ORDER_ITEM : "contiene"
    PRODUCT ||--o{ ORDER_ITEM : "es parte de"

    USER {
        ID id PK
        string fullName
        string avatarUrl
        string email
    }
    WORKSPACE {
        ID id PK
        string name
        string icon
    }
    SITE {
        ID id PK
        string name
        string subdomain
        SiteStatus status
    }
    PRODUCT {
        ID id PK
        string name
        float price
        ProductStatus status
    }
    ORDER {
        ID id PK
        OrderStatus status
        float total
        string createdAt
    }
    ORDER_ITEM {
        ID id PK
        int quantity
        float priceAtPurchase
    }
    WORKSPACE_MEMBER {
        User user FK
        Workspace workspace FK
        WorkspaceRole role
    }

    3. Listado Granular de Funcionalidades (Esquema)
Dominio: Auth & User
Query me: Devuelve el perfil completo (User) del usuario autenticado, incluyendo roles y permisos.
Mutation updateMyProfile(input: UpdateProfileInput!): Permite a un usuario actualizar su propio nombre, avatar, etc.
Dominio: Workspace (Loja/Restaurante)
Query myWorkspaces: Devuelve los workspaces a los que pertenece el usuario.
Query workspace(id: ID!): Devuelve un workspace si el usuario es miembro.
Mutation createWorkspace(input: CreateWorkspaceInput!): Crea un nuevo workspace.
Mutation updateWorkspace(id: ID!, input: UpdateWorkspaceInput!): Actualiza el nombre o icono de un workspace (requiere rol admin o owner).
Mutation inviteMember(workspaceId: ID!, email: String!, role: WorkspaceRole!): Invita a un nuevo miembro (requiere rol admin o owner).
Mutation removeMember(workspaceId: ID!, userId: ID!): Elimina a un miembro (requiere rol owner).
Dominio: Site (Menú)
Query sitesForWorkspace(workspaceId: ID!): Devuelve los menús de un workspace.
Mutation createSite(input: CreateSiteInput!): Crea un nuevo menú.
Mutation updateSiteStatus(id: ID!, status: SiteStatus!): Publica o archiva un menú.
Dominio: Product (Ítem del Menú)
Query productsForSite(siteId: ID!): Devuelve los productos de un menú.
Mutation createProduct(input: CreateProductInput!): Crea un nuevo producto.
Mutation updateProduct(id: ID!, input: UpdateProductInput!): Actualiza un producto.
Mutation deleteProduct(id: ID!): Elimina un producto.
Dominio: Order (Pedido)
Query order(id: ID!): Obtiene un pedido si el usuario es el cliente o un miembro del workspace.
Query myOrderHistory: Devuelve el historial de pedidos del cliente autenticado.
Mutation updateOrderStatus(orderId: ID!, status: OrderStatus!): Actualiza el estado de un pedido (requiere rol de member en el workspace).
Mutation addTipToOrder(orderId: ID!, amount: Float!): Permite a un cliente añadir una propina a un pedido delivered.
Dominio: Directory (Directorio Global)
Query searchRestaurants(query: String, location: GeoPointInput!, radius: Int!): Query pública para buscar restaurantes cerca de una ubicación geográfica.
Dominio: Realtime (Comunicaciones)
Subscription orderUpdates(workspaceId: ID!): Se suscribe a nuevos pedidos y cambios de estado en un workspace.
Subscription orderTracking(orderId: ID!): Se suscribe a cambios de estado y actualizaciones de ubicación del repartidor para un pedido específico (para el cliente).
Subscription riderLocation(orderId: ID!): Suscripción del repartidor para enviar su geolocalización.
Subscription chatMessages(chatRoomId: ID!): Se suscribe a nuevos mensajes en una sala de chat.
Mutation sendMessage(chatRoomId: ID!, content: String!): Envía un mensaje a una sala de chat.
Query getChatHistory(chatRoomId: ID!): Obtiene el historial de mensajes de una sala.

### 4. Stack Tecnológico Canónico
*   **Framework:** Next.js (App Router)
*   **Lenguaje:** TypeScript
*   **Base de Datos y Auth:** Supabase (PostgreSQL, Auth RLS, Realtime)
*   **Capa de Datos (ORM):** Prisma
*   **UI:** Tailwind CSS, shadcn/ui, Framer Motion
*   **Gestión de Estado (Cliente):** Zustand
*   **Internacionalización:** next-intl
*   **Pruebas:** Vitest (Unit/Integration), Playwright (E2E)
*   **Observabilidad:** El sistema de logger que hemos definido, con Sentry en producción.

# Blueprint de API de Élite: GraphQL para "razfood"

## 1. Arquitectura de la API

*   **Endpoint:** Único en `/api/graphql`.
...
*   **Autorización:** La lógica de permisos se implementará en dos capas:
    1.  **Nivel de Resolver:** Cada resolver utilizará la capa de datos de Prisma para consultar la base de datos, la cual está protegida por políticas RLS.
    2.  **Nivel de Base de Datos:** Las políticas de RLS de Supabase actúan como una segunda línea de defensa infalible.
*   **Optimización (Prevención N+1):** El contexto de Apollo inicializará una instancia de `Dataloader` para cada entidad relacional. Las funciones de batch de estos Dataloaders serán implementadas utilizando las capacidades de consulta optimizada de **Prisma Client**. Los resolvers de campos anidados **siempre** utilizarán el Dataloader correspondiente.
