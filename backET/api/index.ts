//"Import" no atao rehefa Typescript fa tsy "require"
import express from "express";
//Fomba fi-declarevana type ao amin'ny Typescript
import type { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
//Mampiditra ny variables ao amin'ny fichier ".env"
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    return res.send("Karakory");
});

mongoose.connect(process.env.MONGO_URI!).then(() => {
    app.listen(port, () => {
        console.log(`Mihazakazaka mafy ny serveur amin'ny port ${port}`);
    });
    console.log(`mifandray soa amantsara amin'ny MOngoDB ${mongoose.connection.host}`)
}).catch((error: Error) => {
    console.log("tsy afaka mifandray amin'ny MongoDB", error);
})

