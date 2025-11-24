import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userMatricule?: string;
      user?: { poste: string; matricule: string }; // ajoute cette ligne
    }
  }
}

