import express from "express";//"Import" no atao rehefa Typescript fa tsy "require"
import type { Request, Response } from "express";//Fomba fi-declarevana type ao amin'ny Typescript
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/user.route.ts";  //Import ny routes
import storieRouter from "./routes/story.route.ts";

dotenv.config();//Mampiditra ny variables ao amin'ny fichier ".env"

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
    return res.send("Karakory");
});
app.use("/api/user", router);
app.use("/api/storie",storieRouter);

mongoose.connect(process.env.MONGO_URI!).then(() => {
    app.listen(port, () => {
        console.log(`Mihazakazaka mafy ny serveur amin'ny port ${port}`);
    });
    console.log(`mifandray soa amantsara amin'ny MOngoDB ${mongoose.connection.host}`)
}).catch((error: Error) => {
    console.log("tsy afaka mifandray amin'ny MongoDB", error);
})

