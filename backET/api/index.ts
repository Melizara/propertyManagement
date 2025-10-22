import express from "express";//"Import" no atao rehefa Typescript fa tsy "require"
import type { Request, Response } from "express";//Fomba fi-declarevana type ao amin'ny Typescript
import dotenv from "dotenv";
import { initializeDatabase } from "./database.ts"

dotenv.config();//Mampiditra ny variables ao amin'ny fichier ".env"

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
    return res.send("Karakory");
});

const startServer = async () => {
    const sequelize = await initializeDatabase();

    await sequelize.sync({ alter: true });
    console.log("Table synchroniser");

    app.listen(port, () => {
        console.log("Serveur demarrer");

    })
};

startServer();






