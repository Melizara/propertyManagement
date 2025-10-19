import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.send("Karakory");
});

app.listen(port, () => {
  console.log(`Mihazakazaka mafy ny serveur amin'ny port ${port}`);
});
