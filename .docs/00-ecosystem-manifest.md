// .docs/ecosystem-manifest.md
# Manifiesto del Ecosistema: "Restoralia OS"

## 1. Visión Ejecutiva

**Restoralia OS** es un Sistema Operativo de comercio en tiempo real para la industria de la restauración. No es una aplicación monolítica, sino un ecosistema desacoplado de clientes soberanos que se comunican a través de una API de GraphQL centralizada, formando un grafo de negocio coherente y reactivo.

## 2. Principios Arquitectónicos de Élite

*   **API Soberana (GraphQL First):** La API de GraphQL es el núcleo del sistema. Es la única puerta de entrada a la lógica de negocio y a los datos. Todos los clientes, incluida nuestra propia aplicación web de dashboard, son consumidores de esta API. Esto garantiza la **consistencia**, la **seguridad centralizada** y el cumplimiento del principio **DRY**.
*   **Atomicidad Radical (Filosofía LEGO):** Cada cliente (App de Cliente, App de Repartidor, Dashboard Web) es un sistema independiente y autocontenido. Dentro de cada cliente, cada característica (un `OrderCard`, un `ChatBubble`, un hook `useRealtimeLocation`) es un aparato atómico, testeable y reutilizable.
*   **Estado Centralizado vs. Estado Local:** El estado global y persistente (pedidos, usuarios, menús) reside en la base de datos y es accedido exclusivamente a través de la API GraphQL. El estado efímero de la UI (visibilidad de un modal, contenido de un input) reside localmente en los clientes (ej. Zustand, useState).
*   **Tiempo Real por Diseño:** La comunicación en tiempo real no es una ocurrencia tardía, es un pilar. Se implementará usando **GraphQL Subscriptions sobre WebSockets**, alimentadas por los triggers de Supabase Realtime.
*   **Seguridad por Defecto (Zero Trust):** La autorización se implementa en la capa más profunda posible: RLS en la base de datos y validación de roles en el contexto de la API GraphQL. Ningún cliente confía en otro; la API valida cada petición.

## 3. Grafo de Interacción del Ecosistema

Este grafo ilustra el flujo de datos y las interacciones entre los componentes del sistema.

```mermaid
graph TD
    subgraph "Clientes Soberanos"
        A[Dashboard Web (Loja)]
        B[App Nativa (Cliente)]
        C[App Nativa (Repartidor)]
        D[Directorio Web (Global)]
    end

    subgraph "Núcleo del Sistema Operativo"
        API[🚀 API de GraphQL Soberana]
        AUTH[🔐 Supabase Auth (JWT)]
        DB[📦 Supabase DB (Postgres + RLS)]
        RT[⚡️ Supabase Realtime (WebSockets)]
    end

    A -- "Queries/Mutations (HTTPS)" --> API
    B -- "Queries/Mutations (HTTPS)" --> API
    C -- "Queries/Mutations (HTTPS)" --> API
    D -- "Queries/Mutations (HTTPS)" --> API

    API -- "Lógica de Negocio y Permisos" --> DB
    
    B -- "Suscripciones (WSS)" --> RT
    C -- "Suscripciones (WSS)" --> RT
    A -- "Suscripciones (WSS)" --> RT

    DB -- "Triggers (Nuevos Pedidos, Cambios de Estado)" --> RT

    subgraph "Autenticación Unificada"
      A -- "Login/Signup" --> AUTH
      B -- "Login/Signup" --> AUTH
      C -- "Login/Signup" --> AUTH
    end

    style API fill:#003,stroke:#0dd,stroke-width:2px
    style RT fill:#300,stroke:#d0d,stroke-width:2px