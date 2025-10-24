import { DataTypes, Model, Sequelize } from "sequelize";

export interface IStory {
    id?: number;
    authorId: string;
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
            authorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // nom de la table de User
                    key: "id",
                },
                onDelete: "CASCADE", // si un user est supprimé, ses stories le sont aussi
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

