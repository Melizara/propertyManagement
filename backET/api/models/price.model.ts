import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./user.model.ts";

export interface IPrice {
    codePrice?: number;
    secteur: string;
    usage: string,
    sousUsage: string,
    prix: number,
    userMatricule: string;
}

export class Price extends Model<IPrice> { }

export const initPrice = (sequelize: Sequelize) => {
    Price.init(
        {
            codePrice: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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
            secteur: {
                type: DataTypes.STRING,
                allowNull: false
            },
            usage: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sousUsage: {
                type: DataTypes.STRING,
            },
            prix: {
                type: DataTypes.INTEGER,
                defaultValue: 0

            }
        },
        {
            sequelize,
            tableName: "prices",
            timestamps: false, // si tu ne veux pas de createdAt/updatedAt automatiques
        })
}

