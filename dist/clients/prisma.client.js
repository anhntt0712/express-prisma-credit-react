"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaTodo = exports.prismaUser = void 0;
const client_1 = require("@prisma/client");
const { user, todo } = new client_1.PrismaClient();
exports.prismaUser = user;
exports.prismaTodo = todo;
