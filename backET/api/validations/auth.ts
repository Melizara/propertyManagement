import { body } from "express-validator";

// Validation pour l'enregistrement
export const registerValidation = [
   body("matricule", "Matricule is required and must be at least 3 chars").isLength({ min: 6 }),
   body("poste", "Poste must be one of Admin, Caissier, Operateur de saisie")
      .isIn(["Admin", "Caissier", "Operateur de saisie"]),
   body("email", "Not a valid email").isEmail(),
   body("password", "Password is too short (min 8 chars)").isLength({ min: 8 }),
];

// Validation pour le login
export const loginValidation = [
   body("matricule", "Matricule is required and must be at least 3 chars").isLength({ min: 6 }),
   body("password", "Password is too short (min 5 chars)").isLength({ min: 5 }),
];
