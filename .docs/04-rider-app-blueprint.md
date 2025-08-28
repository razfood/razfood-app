// .docs/rider-app-blueprint.md
# Blueprint de Aplicación de Élite: App Nativa de Repartidor "Restoralia Rider"

## 1. Visión Ejecutiva y Propuesta de Valor

"Restoralia Rider" es la herramienta de trabajo para los repartidores del ecosistema. Su misión es maximizar la eficiencia de las entregas, minimizar los tiempos de espera y facilitar una comunicación fluida entre el restaurante, el repartidor y el cliente. La propuesta de valor se centra en:
*   **Gestión de Tareas Clara:** Una interfaz simple que muestra los pedidos disponibles, en curso y completados.
*   **Navegación Inteligente:** Integración directa con servicios de mapas para optimizar las rutas de recogida y entrega.
*   **Comunicación Contextual:** Canales de chat directos y seguros con el restaurante y el cliente para cada pedido activo.
*   **Ganancias Transparentes:** Un dashboard que resume las ganancias por día, semana y mes.

## 2. Principios Arquitectónicos

*   **Nativo con Rendimiento Crítico:** React Native con Expo. Se utilizarán módulos nativos optimizados para la geolocalización en segundo plano (`expo-location`) y mapas (`react-native-maps`).
*   **GraphQL como SSoT:** Toda la comunicación con el backend se realizará a través de nuestra API GraphQL soberana, utilizando Apollo Client.
*   **Suscripciones para Todo lo Reactivo:** El corazón de la app serán las suscripciones GraphQL para recibir nuevos pedidos, actualizaciones de estado y mensajes de chat en tiempo real.
*   **Manejo de Estado Offline-First:** El estado de las tareas activas se gestionará con Zustand y se persistirá en `AsyncStorage`. Se implementará una cola de mutaciones para garantizar que las actualizaciones de estado (ej. "recogido", "entregado") se envíen al servidor tan pronto como se recupere la conexión.
*   **Eficiencia de Batería:** El seguimiento de la geolocalización se diseñará para ser eficiente, ajustando la frecuencia de las actualizaciones según el estado de la entrega (ej. alta frecuencia en la aproximación final, baja frecuencia en trayectos largos).

## 3. Grafo del Ciclo de Vida de una Entrega (Vista del Repartidor)

```mermaid
stateDiagram-v2
    [*] --> Offline: Iniciar Sesión

    Offline --> Online: "Quedar Disponible"
    Online --> Offline: "Quedar Offline"

    Online --> Accepting: Nuevo Pedido Disponible (Subscription)
    Accepting --> Online: "Rechazar Pedido"
    Accepting --> En_Ruta_Restaurante: "Aceptar Pedido" (Mutation)
    
    En_Ruta_Restaurante --> En_Espera_Restaurante: "Llegué al Restaurante" (Mutation)
    En_Espera_Restaurante --> En_Ruta_Cliente: "Pedido Recogido" (Mutation)
    
    En_Ruta_Cliente --> Entregado: "Confirmar Entrega" (Mutation)
    Entregado --> Online: Volver a la cola

    state "En Comunicación" as Chat {
      En_Ruta_Restaurante --> Chat_Restaurante
      En_Espera_Restaurante --> Chat_Restaurante
      Chat_Restaurante --> En_Ruta_Cliente
      
      En_Ruta_Cliente --> Chat_Cliente
      Chat_Cliente --> En_Ruta_Cliente
    }

    