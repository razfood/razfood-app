// src/lib/helpers/set-nested-property.helper.ts
/**
 * @file Helper atómico y puro para la asignación de propiedades anidadas.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Esta utilidad de propósito general es compatible con cualquier entorno de JavaScript (cliente, servidor, Edge). Es una dependencia crítica para el orquestador de i18n, que lo utiliza para reconstruir el objeto de mensajes anidados a partir del manifiesto aplanado.
 */

/**
 * @public
 * @function setNestedProperty
 * @description Asigna un valor a una propiedad anidada dentro de un objeto, especificada por una ruta de string. Crea las rutas de objeto intermedias si no existen.
 * @param {Record<string, any>} obj - El objeto a modificar.
 * @param {string} path - La ruta de la propiedad en notación de punto (ej. "a.b.c").
 * @param {any} value - El valor a asignar en la ruta especificada.
 * @returns {Record<string, any>} El objeto modificado.
 */
export function setNestedProperty(obj: Record<string, any>, path: string, value: any): Record<string, any> {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}

/**
 * @module set-nested-property-helper
 * @description Utilidad pura para la manipulación de objetos anidados.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Tipado Genérico Avanzado:** Para una seguridad de tipos de élite, la firma de la función podría ser mejorada con tipos genéricos avanzados de TypeScript para inferir la forma del objeto resultante basándose en la ruta del `path`. Esto eliminaría la necesidad de aserciones de tipo en el código que la consume.
 * - ((Vigente)) **Manejo de Índices de Array:** La versión actual no soporta sintaxis de array (ej. "a.0.b"). Se podría extender la lógica para parsear índices numéricos y crear/modificar arrays anidados.
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Dependencia Crítica de i18n:** Se establece un helper fundamental para que el orquestador `i18n.ts` pueda funcionar correctamente, adhiriéndose al principio de construir dependencias primero.
 * - ((Implementada)) **Lógica Pura y Testeable:** La función es pura (sin efectos secundarios) y determinista, lo que la hace extremadamente robusta y fácil de probar unitariamente.
 * - ((Implementada)) **Compatibilidad Universal:** Al no tener directivas de runtime (`"use client"` o `"use server"`), este helper es una pieza de lógica universalmente reutilizable.
 */
// src/lib/helpers/set-nested-property.helper.ts
