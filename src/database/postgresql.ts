import { PrismaClient } from "@prisma/client";

const pgClient = new PrismaClient()

export { pgClient }