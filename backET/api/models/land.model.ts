import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./user.model.ts";

export interface ILand {
    codeLand?: number;
    length: number;
    width: number;
    area: number;
    startPk: number;
    endPk: number;
    railwaySide: string;
    position: string;
    neighborHood: string;
    municipality: string;
    userMatricule: string;
}

export class Land extends Model<ILand> { }

export const initLand = (sequelize: Sequelize) => {
    Land.init(
        {
            codeLand: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            length: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            width: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            area: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            startPk: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            endPk: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            railwaySide: {
                type: DataTypes.ENUM("gauche", "droite"),
                allowNull: false
            },
            position: {
                type: DataTypes.STRING,
                allowNull: false
            },
            neighborHood: {
                type: DataTypes.STRING,
                allowNull: false
            },
            municipality: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userMatricule: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: User,
                    key: "matricule"
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
        },
        {
            sequelize,
            tableName: "lands",
            timestamps: false
        }
    )
}