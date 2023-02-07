"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = require("../clients/prisma.client");
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken)
            return res.sendStatus(401);
        const user = await prisma_client_1.prismaUser.findMany({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user[0])
            return res.sendStatus(403);
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "", (err) => {
            if (err)
                return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].name;
            const email = user[0].email;
            const accessToken = jsonwebtoken_1.default.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET || "", {
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.refreshToken = refreshToken;
