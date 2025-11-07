import { DataTypes, Model, Sequelize } from "sequelize";

// Interface pour typer les données du modèle
export interface IUser {
    matricule: string; // PK
    email: string;
    poste: "operateur de saisie" | "admin" | "caissier"; // tu peux limiter les valeurs possibles
    password: string;
    createdAt?: Date;
}

// Classe User qui hérite de l'interface IUser
export class User extends Model<IUser> {}

export const initUser = (sequelize: Sequelize) => {
    User.init(
        {
            matricule: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            poste: {
                type: DataTypes.ENUM("operateur de saisie", "admin", "caissier"),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: "users",
            timestamps: false, // pas de createdAt/updatedAt automatiques
        }
    );
};
