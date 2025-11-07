import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./user.model.ts";

export interface IStory {
    id?: number;
    authorMatricule: string;
    title: string,
    text: string,
    poster: string,
    views?: number
}

export class Story extends Model<IStory> { }

export const initStory = (sequelize: Sequelize) => {
    Story.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
<<<<<<< HEAD
            authorId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "users",
                    key: "matricule",
=======
            authorMatricule: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: User,
                    key: "matricule"
>>>>>>> 2c69140 (Nety ilay login aoha)
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            text: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            poster: {
                type: DataTypes.STRING,
            },
            views: {
                type: DataTypes.INTEGER,
                defaultValue: 0

            }
        },
        {
            sequelize,
            tableName: "stories",
            timestamps: false, // si tu ne veux pas de createdAt/updatedAt automatiques
        })
}

