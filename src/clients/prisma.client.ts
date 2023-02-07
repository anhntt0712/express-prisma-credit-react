import { PrismaClient } from "@prisma/client"
const {user, todo} = new PrismaClient() 

export const prismaUser = user 
export const prismaTodo = todo