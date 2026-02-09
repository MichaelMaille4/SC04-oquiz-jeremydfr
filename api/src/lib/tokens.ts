import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { User } from "../models/index.ts";
import { config } from "../../config.ts";

export function generateAuthenticationTokens(user: User) {
  // Ce qu'on ajoute dans le payload, pas d'information personnelle (RGPD)
  const payload = {
    userId: user.id,
    role: user.role
  };
  
  // Génération d'un l'accès token
  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" }); // un JWT signé contenant des informations utiles (userId notamment)

  // Génération d'un refresh token
  const refreshToken = crypto.randomBytes(128).toString("base64"); // une simple chaine de caractère de 128 caractères fera tout à fait l'affaire. 

  return {
    accessToken: {
      token: accessToken,
      type: "Bearer",
      expiresInMS: 1 * 60 * 60 * 1000 // 1h
    },
    refreshToken: {
      token: refreshToken,
      type: "Bearer",
      expiresInMS: 7 * 24 * 60 * 60 * 1000 // 7j
    }
  };
}
