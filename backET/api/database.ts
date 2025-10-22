// database.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Nom de la base que tu veux créer automatiquement
const DB_NAME = process.env.DB_NAME || "fceDb";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";

// 1️⃣ Connexion à MySQL sans base spécifique
const sequelize = new Sequelize("", DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

export const initializeDatabase = async () => {
  try {
    // 2️⃣ Crée la base si elle n'existe pas
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Base ${DB_NAME} vérifiée / créée`);

    // 3️⃣ Se reconnecter à la base spécifique
    const sequelizeDB = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      dialect: "mysql",
      logging: false,
    });

    return sequelizeDB;
  } catch (error) {
    console.error("Erreur création base:", error);
    process.exit(1); // Stop le serveur si erreur
  }
};
