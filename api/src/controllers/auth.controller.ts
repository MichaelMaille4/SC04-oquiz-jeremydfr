import argon2 from "argon2";
import type { Request, Response } from "express";
import z from "zod";
import { BadRequestError, ConflictError, UnAuthorizedError } from "../lib/errors.ts";
import { prisma } from "../models/index.ts";
import type { User } from "../models/index.ts";
import { generateAuthenticationTokens } from "../lib/tokens.ts";
import { logger } from "../lib/log.ts";

export async function registerUser(req: Request, res: Response) {
  // Récupérer le body et le valider avec zod
  const registerUserBodySchema = z.object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.email(),
    password: z.string()
      .min(8, "password should have at least 8 caracters") // CNIL recommande plutôt 12 caractères
      .max(100, "password should have at most 100 caracters")
      .regex(/[a-z]/, "password should contain at least a lowercase caracter")
      .regex(/[A-Z]/, "password should contain at least a uppercase caracter"),
    confirm: z.string()
  });
  const { firstname, lastname, email, password, confirm } = await registerUserBodySchema.parseAsync(req.body);

  // Vérifier que le mot de passe et sa confirmation correspondent
  if (password !== confirm) {
    logger.info('Password and confirmation do not match', { email });
    throw new BadRequestError("Password and confirmation do not match");
  }

  // Vérifier que l'email n'est pas déjà pris
  try {
    const alreadyExistingUser = await prisma.user.findFirst({ where: { email }});

    if (alreadyExistingUser) {
      logger.info('Email already taken', { email });
      throw new ConflictError("Email already taken");
    }
  } catch (error) {
    logger.error('ERROR', { error: error.message });
  }

  // Hasher le mot de passe (argon2id (NPM) > scrypt (Node.js) > bcrypt (NPM)) (recommandations : OWASP)
  const hashedPassword = await argon2.hash(password);

  // On stock l'utilisateur en BDD
  const user = await prisma.user.create({ data: {
    firstname,
    lastname,
    email,
    password: hashedPassword
  }});

  logger.info('Inscription réussi', { email });

  // Note : parfois à ce stade, on connecte l'utilisateur dès l'inscription. Mais ici, dans une approche RESTful, on ne le fera pas.
  res.status(201).json({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at
  });
}

export async function loginUser(req: Request, res: Response) {
  // Récupérer et parser le body si possible avec Zod (pour s'assurer des types que l'on manipule)
  const loginUserBodySchema = z.object({
    email: z.email(),
    password: z.string()
  });
  const { email, password } = await loginUserBodySchema.parseAsync(req.body);

  // Récupérer le user dans la BDD (si pas de user -> 401 Unauthorized)
  const user = await prisma.user.findFirst({ where: { email } });
  if (! user) {
    logger.info('Email and password do not match');
    throw new UnAuthorizedError("Email and password do not match");
  }

  // Comparer le mot de passe fourni avec le hash (si pas de match -> 401 Unauthorized)
  const isMatching = await argon2.verify(user.password, password);
  if (! isMatching) {
    logger.info('Email and password do not match', { user_id: user.id });
    throw new UnAuthorizedError("Email and password do not match");
  }

  // Générer les tokens d'authentification
  const { accessToken, refreshToken } = generateAuthenticationTokens(user);

  // On retire le token existant de l'utilisateur avant d'en créer un nouveau
  await replaceRefreshTokenInDatabase(refreshToken, user);
  
  // Ajouter les tokens aux cookies (via headers)
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  logger.info('User connected', { user_id: user.id, accessToken, refreshToken });

  // Répondre au client, on place également le JWT dans la réponse
  res.json({ accessToken, refreshToken });
}

export async function logoutUser(_: Request, res: Response) {
  const randomStringToUnsetCookieValueOnClient = Math.random().toString();
  logger.info('User disconnected');
  res.cookie("accessToken", randomStringToUnsetCookieValueOnClient);
  res.cookie("refreshToken", randomStringToUnsetCookieValueOnClient);
  res.status(204).json({ status: 204, message: "Successfully logged out"});
}

export async function refreshAccessToken(req: Request, res: Response) {
  // Récupérer le token dans les cookies ou dans le body
  const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (! rawToken) {
    throw new UnAuthorizedError("Refresh token not provided");
  }

  // Rechercher le refresh token en base de données, avec son utilisateur associé
  const existingRefreshToken = await prisma.refreshToken.findFirst({
    where: { token: rawToken },
    include: { user: true }
  });
  if (! existingRefreshToken) {
    throw new UnAuthorizedError("Invalid refresh token");
  }

  // Vérifier la validité du token
  if (existingRefreshToken.expires_at < new Date()) {
    await prisma.refreshToken.delete({ where: { id: existingRefreshToken.id } }); // On le supprime au passage
    logger.info('Expired refresh token', { user_id: existingRefreshToken.user.id });
    throw new UnAuthorizedError("Expired refresh token");
  }

  // Générer les tokens d'authentification
  const { accessToken, refreshToken } = generateAuthenticationTokens(existingRefreshToken.user);

  // On retire le token existant de l'utilisateur avant d'en créer un nouveau
  await replaceRefreshTokenInDatabase(refreshToken, existingRefreshToken.user);
  
  // Ajouter les tokens aux cookies (via headers)
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  // Répondre au client, on place également le JWT dans la réponse
  res.json({ accessToken, refreshToken });
}

export async function getAuthenticatedUser(req: Request, res: Response) {
  const userId = req.userId;

  // Récupérer l'utilisteur en BDD (sans son MDP)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true }
  });
  if (! user) { 
    logger.info('JWT payload does not match any user', { user_id: userId });
    throw new UnAuthorizedError("JWT payload does not match any user"); 
  }

  // Renvoie des données controlées
  res.json(user);
}

interface Token {
  token: string;
  type: string;
  expiresInMS: number;
}

async function replaceRefreshTokenInDatabase(refreshToken: Token, user: User) {
  await prisma.refreshToken.deleteMany({ where: { user_id: user.id }});
  await prisma.refreshToken.create({ data: {
    token: refreshToken.token,
    user_id: user.id,
    issued_at: new Date(),
    expires_at: new Date(new Date().valueOf() + refreshToken.expiresInMS)
  }});
}

function setAccessTokenCookie(res: Response, accessToken: Token) {
  res.cookie("accessToken", accessToken.token, {
    httpOnly: true,
    maxAge: accessToken.expiresInMS, // 1h

    // Pour des cookies sécurisés cross-origin il faut :
    secure: true,     // les cookies cross-origin, c'est seulement en HTTPS !
    sameSite: "none"  // les cookies cross-origin, c'est forcement entre plusieurs origins
    // Et ne pas oublier de faire en sorte que les CORS autorise l'envoie de "credentials"
  });
}

function setRefreshTokenCookie(res: Response, refreshToken: Token) {
  res.cookie("refreshToken", refreshToken.token, {
    httpOnly: true,
    maxAge: refreshToken.expiresInMS, // 7j
    secure: true,
    sameSite: "none",
    path: "/api/auth/refresh" // Sécurité : le cookie s'enverra (front -> back) uniquement via cette route, pas les autres routes (limite les transferts de ce cookie)
  });
}
