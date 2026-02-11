import formidable from "formidable";
import path from "node:path";
import crypto from "node:crypto";

export const uploadDir = path.join(import.meta.dirname, '../../uploads');
export const formParser = formidable({
    // Le dossier par défaut où stocker les fichiers
    uploadDir,
    // Possibilité d'upload un dossier complet
    createDirsFromUploads: true,
    // Garde l'extension du fichier original
    keepExtensions: true,
    // Si on veut customier le nom / rangement du fichier
    filename(name, ext, part, form) {
        const currentDate = new Date();

        // Génère un nouveau nom de fichier
        const newName = crypto.randomBytes(16).toString('hex');
        return `${ currentDate.getFullYear() }/${ currentDate.getMonth() + 1 }/${ currentDate.getDate() }/${ newName }${ ext }`;
    }
})