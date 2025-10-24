import express from "express";//"Import" no atao rehefa Typescript fa tsy "require"
import type { Request, Response } from "express";//Fomba fi-declarevana type req,res ao amin'ny Typescript
import dotenv from "dotenv";
import { initializeDatabase } from "./database.ts";
import router from "./routes/user.route.ts";
// import { initUser } from "./models/user.model.ts";
import storyRouter from "./routes/story.route.ts";
import { initModels } from "./models/index.model.ts";

dotenv.config();//Chargement variable avy any amin'ny .env

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());//Middleware mba ahafahan'ny express mahazo requete json
app.get("/", (req: Request, res: Response) => {
    return res.send("Karakory");
});
app.use("/api/user", router);//Fampiasana ny routen'ny user
app.use("/api/story", storyRouter);

const startServer = async () => {
    const sequelize = await initializeDatabase();//Creer et retourner  une instance connectee a la DB

    // initUser(sequelize);//Initialisation anle modele User
    initModels(sequelize);

    await sequelize.sync({ force: false });//Creation anle table anaty DB @ alalan'ny modele
    console.log("Table synchroniser");

    app.listen(port, () => {
        console.log(`Serveur démarré sur le port ${port}`);
    })
};

startServer();