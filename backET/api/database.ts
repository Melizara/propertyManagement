import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = process.env.DB_NAME || "fceDb";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";

export const initializeDatabase = async () => {
  try {
    // Connexion temporaire pour créer la base
    const tempSequelize = new Sequelize("", DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      dialect: "mysql",
      logging: false,
    });

    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Base ${DB_NAME} vérifiée / créée`);

    // Connexion définitive à la base
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      dialect: "mysql",
      logging: false,
    });

    await sequelize.authenticate();
    console.log("Connexion à la base OK!");

    return sequelize;
  } catch (error) {
    console.error("Erreur création/connexion base:", error);
    process.exit(1);
  }
};
