import { ObjectId } from "mongodb";
import z from "zod";

// Permet de vérifier un paramètre dynamique, :id si c'est un ObjectId valide
export const idParamSchema = z.object({
    id: z.string()
        .min(1, "L'id doit être une chaine non vide")
        .refine((id) => ObjectId.isValid, "L'id doit être un ObjectId valide")
});