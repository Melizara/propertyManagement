import { DataTypes, Model, Sequelize } from "sequelize";

//Ity interface ity dia ampiasaina mba i-typena anle donnees anle modele
// ny '?' dia midika fa optionnel
export interface IUser {
    id?: number;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
}

//On cree la class User qui herite de l'interface IUser
export class User extends Model<IUser> {}

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
