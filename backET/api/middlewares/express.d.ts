import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // on rend la propriété optionnelle
    }
  }
}
