import { body } from "express-validator";

// Validation pour l'inscription
export const registerValidation = [
    body("matricule", "Matricule est obligatoire").notEmpty(),
    body("pseudo", "Le pseudo est obligatoire").notEmpty(),
    body("email", "Email non valide").isEmail(),
    body("poste", "Poste invalide, doit être 'operateur', 'admin' ou 'caissier'")
        .isIn(["operateur", "admin", "caissier"]),
    body("password", "Mot de passe trop court (minimum 8 caractères)").isLength({ min: 8 })
];

// Validation pour la connexion
export const loginValidation = [
    body("matricule", "Matricule est obligatoire").notEmpty(),
    body("password", "Mot de passe trop court (minimum 8 caractères)").isLength({ min: 8 })
];
