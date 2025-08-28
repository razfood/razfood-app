# Blueprint de Aplicación de Élite: Directorio Web Global "Restoralia Discovery"

## 1. Visión Ejecutiva y Propuesta de Valor

"Restoralia Discovery" es el portal público y global del ecosistema. Su misión es ser la plataforma definitiva para que los usuarios descubran nuevos restaurantes. La propuesta de valor se centra en:
*   **SEO Optimizado:** Cada restaurante tendrá una página estáticamente generada, perfectamente indexable por los motores de búsqueda.
*   **Rendimiento Extremo:** Utilización de SSR y SSG de Next.js para tiempos de carga casi instantáneos.
*   **Búsqueda Geoespacial Avanzada:** Una experiencia de búsqueda interactiva basada en mapas que permite a los usuarios encontrar restaurantes por ubicación, tipo de cocina y calificación.
*   **Canal de Adquisición:** Servir como el principal "embudo de marketing" tanto para atraer nuevos clientes como para que nuevos restaurantes se unan a la plataforma.

## 2. Principios Arquitectónicos

*   **Next.js App Router como Fundación:** Aprovechar al máximo la arquitectura híbrida de Next.js.
*   **Server Components por Defecto:** La mayoría de los componentes serán Server Components (RSC) para maximizar el rendimiento y el SEO. Solo los componentes que requieran interactividad del usuario (mapas, barras de búsqueda) serán Client Components (RCC).
*   **Generación de Páginas Estratégica:**
    *   **SSG (Static Site Generation):** Las páginas de detalle de cada restaurante (`/[city]/[restaurant-slug]`) serán generadas estáticamente en el momento del build y revalidadas incrementalmente (ISR) cuando el restaurante actualice su menú. Esto garantiza el mejor rendimiento y SEO posibles.
    *   **SSR (Server-Side Rendering):** Las páginas de resultados de búsqueda (`/search?location=...`) serán renderizadas en el servidor en cada petición para mostrar los resultados más actualizados.
*   **GraphQL como SSoT:** Toda la obtención de datos, tanto en el build como en el servidor, se realizará a través de queries públicas a nuestra API de GraphQL.

## 3. Grafo de Flujo y Generación de Páginas

```mermaid
graph TD
    subgraph "Usuario"
        U[Visitante]
    end

    subgraph "Aplicación Next.js"
        LP[Landing Page (`/` - RSC)]
        SP[Página de Búsqueda (`/search` - RSC/SSR)]
        RP[Página de Restaurante (`/[slug]` - RSC/SSG)]
    end

    subgraph "Componentes Interactivos"
        M[Mapa de Búsqueda (RCC)]
        SB[Barra de Búsqueda (RCC)]
    end

    subgraph "API y Datos"
        API[🚀 API de GraphQL]
    end

    U --> LP
    LP --> SB
    U --> SP
    SP --> M
    U --> RP

    SP -- "Renderizado en Servidor" --> API
    M -- "Búsqueda Dinámica" --> API
    SB -- "Sugerencias de Autocompletar" --> API

    subgraph "Proceso de Build (Vercel)"
        Build[Proceso de Build]
        Build -- "Generación Estática" --> API
        API -- "Datos de Restaurantes" --> Build
        Build -- "Genera HTMLs Estáticos" --> RP
    end
    
    style SP fill:#f9f,stroke:#333,stroke-width:2px
    style RP fill:#9ff,stroke:#333,stroke-width:2px
4. Listado Granular de Aparatos (Módulos y Componentes)
Módulo 1: Core & Layout
RootLayout: (RSC) Layout principal que incluye el Header y el Footer.
Header: (RCC) Componente de cabecera con navegación y botón de "Iniciar Sesión / Dashboard".
Footer: (RSC) Componente de pie de página estático.
Módulo 2: Landing (Página Principal)
Página: app/page.tsx (RSC)
Componentes:
HeroSection: (RSC) Sección principal con el eslogan y la barra de búsqueda principal.
FeaturedRestaurants: (RSC) Carrusel o cuadrícula de restaurantes destacados (obtenidos en el servidor).
CuisinesCarousel: (RSC) Carrusel de tipos de cocina populares para facilitar el descubrimiento.
CallToActionForRestaurants: (RSC) Banner que invita a los restaurantes a unirse a la plataforma.
Módulo 3: Search (Búsqueda)
Página: app/search/page.tsx (RSC, renderizada dinámicamente en el servidor).
Componentes:
SearchMapView: (RCC) Componente principal que muestra un mapa interactivo (react-map-gl/mapbox) a la izquierda y una lista de resultados a la derecha.
SearchFilters: (RCC) Componente con filtros avanzados (precio, calificación, abierto ahora, etc.).
SearchResultCard: (RSC) Tarjeta de un restaurante en la lista de resultados.
Hooks:
useRestaurantSearch: Hook de cliente que gestiona la lógica de búsqueda en el mapa, actualiza los parámetros de la URL y obtiene los resultados de la API.
Módulo 4: Restaurant (Página de Detalle)
Página: app/[city]/[restaurant-slug]/page.tsx (RSC, generada estáticamente).
Función Clave: generateStaticParams(): Función de Next.js que obtendrá todos los slugs de restaurantes de la API durante el build para generar las páginas estáticas.
Componentes:
RestaurantHeader: (RSC) Muestra el nombre, imagen principal, dirección y calificación del restaurante.
RestaurantInfoTabs: (RCC) Pestañas para cambiar entre "Menú", "Reseñas" e "Información".
PublicMenuView: (RCC) Reutilización del componente ya construido, que muestra el menú y se conecta al useCartStore.
ReviewsSection: (RSC) Muestra las reseñas del restaurante, cargadas en el servidor.
InfoSection: (RSC) Muestra el horario de apertura, teléfono, etc.
---
