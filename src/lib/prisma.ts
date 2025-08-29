// src/lib/prisma.ts
/**
 * @file Singleton para el cliente Prisma.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato instancia y exporta un único cliente Prisma para toda la
 *              aplicación, siguiendo las mejores prácticas para evitar la creación
 *              excesiva de conexiones a la base de datos en entornos serverless.
 */
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

logger.trace('[Prisma] Singleton del cliente Prisma inicializado.');

export default prisma;

/**
 * @module prisma-client
 * @description Singleton del cliente Prisma.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Extensões de Cliente Prisma:** Explorar o uso de `Prisma.defineExtension` para adicionar lógica de negócio reutilizável diretamente ao cliente, como métodos personalizados (`prisma.user.findActive(...)`) ou validações a nível de query, mantendo a camada de dados ainda mais limpa e DRY.
 */
// src/lib/prisma.ts
