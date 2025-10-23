import { DataTypes, Model, Sequelize } from "sequelize";

export interface IUser {
    id?: number;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
}

export class User extends Model<IUser> {
    // pas de class fields, pas de implements
}


// Fonction pour initialiser le modèle avec une instance Sequelize
export const initUser = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
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
            timestamps: false, // si tu ne veux pas de createdAt/updatedAt automatiques
        }
    );
};
