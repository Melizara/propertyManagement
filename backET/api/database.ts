import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();//Chargement variable avy any @ .env

//Recuperation anle valeur ny variable avy @ .env
const DB_NAME = process.env.DB_NAME || "fceDb";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";

//Ity fonction ity ilay antsoina ary @ index.ts mba initialisena DB
export const initializeDatabase = async () => {
  try {
    //Eto dia miconnecte amin'ny Mysql mba amoronana DB raha ohatra ka mbola tsy misy
    const tempSequelize = new Sequelize("", DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      dialect: "mysql",
      logging: false,
    });
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Base ${DB_NAME} vérifiée / créée`);

    //Eto amin'izay vao tena miconnecte amin'ny DB rehefa tena sur fa misy io DB io
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      dialect: "mysql",
      logging: false,
    });

    //Teste de connection a la DB
    await sequelize.authenticate();
    console.log("Connexion à la base OK!");

    return sequelize;
  } catch (error) {
    console.error("Erreur création/connexion base:", error);
    process.exit(1);
  }
};
