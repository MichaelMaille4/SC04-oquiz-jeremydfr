import z from "zod";

// Cette fonction va nous permettre de vérifier que les valeurs qu'on récupère sont bien des "int"
// Ici en résumé on vérifie que l'id est bien un number
export async function parseIntFromParams(id: unknown) {
  // en une ligne, on vérifie la valeur récupérée et on regarde si on a bien un int, si le résultat est correct, zod renverra une réponse qui nous permet de continuer notre process, et si on a un problème, zod nous renverra une erreur qu'on va throw et catcher par la suite pour ne pas continuer le process
  // on utilise ici zod (z) qui va nous permettre de regarder -> si on a un number -> de type entier (int) -> avec une valeur minimale de 1 (parce qu'un id doit être positif et supérieur à 0) -> puis on appelle parseAsync qui va regarder la valeur en fonction des paramètres mentionnées précédemment
  return await z.coerce.number().int().min(1).parseAsync(id);
}

export async function parseBodyFromParams(response: unknown) {
  // on prépare un schéma qui représente ce qu'on veut récupérer de notre réponse
  const levelBodySchema = z.object({
    name: z.string().min(1)
  });
  // on va parser notre réponse
  const answer = await levelBodySchema.parseAsync(response);
  return answer;
}