import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./user.model.ts";

export interface IStation {
    codeStation: number;
    name: string;
    type: string;
    startPk: number;
    endPk: number;
    userMatricule: string;
}

export class Station extends Model<IStation> { }

export const initStation = (sequelize: Sequelize) => {
    Station.init(
        {
            codeStation: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
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
            tableName: "stations",
            timestamps: false
        }
    )
}