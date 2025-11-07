import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userMatricule?: string; // on rend la propriété optionnelle
    }
  }
}
