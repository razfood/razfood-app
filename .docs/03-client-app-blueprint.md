// .docs/03-client-app-blueprint.md
# Blueprint de Aplicación de Élite: App Nativa de Cliente "Restoralia"

## 1. Visión Ejecutiva y Propuesta de Valor

La app nativa de "Restoralia" es la interfaz principal para el cliente final. Su misión es proporcionar la experiencia de pedido de comida más fluida, transparente y atractiva del mercado. La propuesta de valor se centra en:
*   **Descubrimiento Inteligente:** Un directorio geolocalizado que permite a los usuarios encontrar restaurantes relevantes.
*   **Pedido Sin Fricciones:** Menús interactivos y un proceso de checkout optimizado.
*   **Transparencia Total:** Seguimiento de pedidos en tiempo real, desde la cocina hasta la puerta, con comunicación directa.

## 2. Principios Arquitectónicos

*   **Nativo Primero:** Utilizar React Native con Expo para maximizar el rendimiento y el acceso a las capacidades del dispositivo (GPS, notificaciones push).
*   **GraphQL como SSoT:** Toda la comunicación con el backend se realizará a través de nuestra API GraphQL soberana, utilizando Apollo Client.
*   **Estado Efímero Local:** El estado global de la UI (sesión de usuario, contenido del carrito) se gestionará con Zustand, sincronizado con almacenamiento persistente (AsyncStorage). El estado local de las pantallas se gestionará con `useState`.
*   **Renderizado Optimista:** Todas las acciones del usuario (añadir al carrito, realizar un pedido, enviar un mensaje) se reflejarán instantáneamente en la UI.
*   **Diseño Atómico:** La UI se construirá a partir de una biblioteca de componentes atómicos y puros (`Button`, `ProductCard`, `OrderListItem`), ensamblados en pantallas orquestadoras.

## 3. Grafo de Navegación del Usuario

Este grafo ilustra las pantallas principales y los flujos de navegación.

```mermaid
graph TD
    subgraph "Flujo de Onboarding"
        Onboard1[Splash Screen] --> Onboard2{Usuario Autenticado?}
        Onboard2 -- No --> AuthNav[Stack de Autenticación]
        AuthNav --> Login[Pantalla de Login/Signup]
        Onboard2 -- Sí --> MainNav[Stack Principal]
        Login -- "Éxito" --> MainNav
    end

    subgraph "Stack Principal (Tab Navigator)"
        T1[Descubrir]
        T2[Pedidos]
        T3[Perfil]
    end

    MainNav --> T1
    MainNav --> T2
    MainNav --> T3

    subgraph "Flujo de Descubrimiento y Pedido"
        T1 -- "Click en Restaurante" --> RestaurantScreen[Pantalla de Restaurante/Menú]
        RestaurantScreen -- "Añadir al Carrito" --> RestaurantScreen
        RestaurantScreen -- "Ver Carrito" --> CheckoutScreen[Pantalla de Checkout]
        CheckoutScreen -- "Realizar Pedido" --> OrderTrackingScreen[Pantalla de Seguimiento de Pedido]
    end

    subgraph "Flujo de Pedidos y Perfil"
        T2 --> OrderHistoryScreen[Historial de Pedidos]
        OrderHistoryScreen -- "Click en Pedido" --> OrderTrackingScreen
        T3 --> ProfileScreen[Pantalla de Perfil]
        ProfileScreen -- "Editar Perfil" --> EditProfileScreen[Pantalla de Edición]
    end

    OrderTrackingScreen -- "Chat" --> ChatScreen[Pantalla de Chat]

    style API fill:#003,stroke:#0dd,stroke-width:2px

    4. Listado Granular de Aparatos (Módulos y Componentes)
Módulo 1: Core
ApolloProvider: Wrapper que configura y provee el cliente Apollo a toda la app.
AuthProvider: Wrapper que gestiona el estado de autenticación y la sesión del usuario.
useAuth: Hook soberano para acceder a los datos del usuario y a las acciones de login/logout.
RootNavigator: Orquestador de navegación que decide si mostrar el stack de Autenticación o el Principal.
Módulo 2: Discovery (Descubrimiento)
Pantallas:
DiscoveryScreen: Pantalla principal con un mapa interactivo (MapView) y una lista de restaurantes cercanos.
Componentes:
RestaurantMapMarker: Marcador personalizado para un restaurante en el mapa.
RestaurantListItem: Tarjeta de resumen de un restaurante en la lista.
SearchBar: Componente de búsqueda por nombre o tipo de cocina.
Hooks:
useRestaurantSearch(location, query): Hook que ejecuta la query GraphQL searchRestaurants y gestiona el estado de los resultados.
Módulo 3: Menu & Cart (Menú y Carrito)
Pantallas:
MenuScreen: Muestra los detalles del restaurante y la lista de productos agrupados por categoría.
Componentes:
ProductCard: Tarjeta interactiva para un ítem del menú, con botón para añadir al carrito.
CategoryHeader: Cabecera para una sección de categoría en el menú.
CartTrigger: Botón flotante que muestra el número de ítems y abre el panel del carrito (similar al de la web).
Hooks:
useMenu(siteId): Hook que obtiene los datos del menú y productos vía GraphQL.
Módulo 4: Checkout & Order (Pedido)
Pantallas:
CheckoutScreen: Muestra el resumen del pedido, permite añadir dirección y propina, y contiene el formulario de pago.
OrderTrackingScreen: Muestra el estado del pedido en tiempo real en un mapa y una línea de tiempo.
Componentes:
OrderItemSummary: Fila que muestra un ítem en el resumen del checkout.
TipSelector: Componente para seleccionar un porcentaje de propina.
PaymentForm: Integración nativa con Stripe para el pago.
OrderStatusTimeline: Componente visual que muestra los pasos del pedido (confirmado, en preparación, etc.).
Hooks:
useCreateOrder: Hook que encapsula la mutación GraphQL para crear un pedido y manejar los estados de carga/error.
useOrderTracking(orderId): Hook que utiliza la suscripción GraphQL orderTracking para recibir actualizaciones de estado y ubicación en tiempo real.
Módulo 5: Realtime (Comunicaciones)
Pantallas:
ChatScreen: Interfaz de chat tipo WhatsApp/Telegram.
Componentes:
ChatBubble: Componente para un único mensaje (enviado o recibido).
MessageInput: Campo de texto para componer y enviar mensajes.
Hooks:
useChat(orderId): Hook que gestiona el historial de mensajes (query getChatHistory) y la recepción de nuevos mensajes en tiempo real (suscripción chatMessages).


