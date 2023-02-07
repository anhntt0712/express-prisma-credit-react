"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = require("../clients/prisma.client");
const getUsers = async (req, res) => {
    try {
        const users = await prisma_client_1.prismaUser.findMany();
        res.json(users);
    }
    catch (error) {
        console.log(error);
    }
};
exports.getUsers = getUsers;
const register = async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (password !== confPassword)
        return res
            .status(400)
            .json({ msg: "Password and Confirm Password do not match" });
    const salt = await bcrypt_1.default.genSalt();
    const hashPassword = await bcrypt_1.default.hash(password, salt);
    try {
        await prisma_client_1.prismaUser.create({
            data: {
                name: name,
                email: email,
                password: hashPassword
            }
        });
        res.json({ msg: "Registration Successful" });
    }
    catch (error) {
        console.log(error);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const user = await prisma_client_1.prismaUser.findMany({
            where: {
                email: req.body.email
            }
        });
        const match = await bcrypt_1.default.compare(req.body.password, user[0].password);
        if (!match)
            return res.status(400).json({ msg: "Wrong Password" });
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jsonwebtoken_1.default.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET || "", {
            expiresIn: '15s'
        });
        const refreshToken = jsonwebtoken_1.default.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET || "", {
            expiresIn: '1d'
        });
        await prisma_client_1.prismaUser.update({ data: { refresh_token: refreshToken },
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    }
    catch (error) {
        res.status(404).json({ msg: "Email not found" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.sendStatus(204);
    const user = await prisma_client_1.prismaUser.findMany({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0])
        return res.sendStatus(204);
    const userId = user[0].id;
    await prisma_client_1.prismaUser.update({
        data: { refresh_token: null },
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
};
exports.logout = logout;
