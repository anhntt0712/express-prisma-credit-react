import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prismaUser } from "../clients/prisma.client";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, confPassword } = req.body;
  const user = await prismaUser.findFirstOrThrow({
    where: {
      email,
    },
  });
  if (user) {
    return res
      .status(400)
      .json({ msg: `User with ${email} have alreadly existed` });
  }

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await prismaUser.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      },
    });
    res.json({ msg: "Registration Successful" });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await prismaUser.findFirstOrThrow({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET || "",
      {
        expiresIn: "30m",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET || "",
      {
        expiresIn: "1d",
      }
    );
    await prismaUser.update({
      data: { refresh_token: refreshToken },
      where: {
        id: userId,
      },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email not found" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await prismaUser.findFirstOrThrow({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user) return res.sendStatus(204);
  const userId = user.id;
  await prismaUser.update({
    data: { refresh_token: null },
    where: {
      id: userId,
    },
  });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
