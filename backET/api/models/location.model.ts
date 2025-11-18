import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./user.model.ts";
import { Land } from "./land.model.ts";
import { Tenant } from "./tenant.model.ts";

export interface ILocation {
    codeLocation?: number;
    cin: string;
    codeLand: number,
    usage: string,
    areaLandBare: number,
    areaWood: number,
    areaPermanent: number,
    priceLandBare: number,
    priceWood: number,
    pricePermanent: number,
    typePayment: string,
    methodPayment: string,
    placePaymment: string,
    userMatricule: string;
};

export class Location extends Model<ILocation> { }

export const initLocation = (sequelize: Sequelize) => {
    Location.init(
        {
            codeLocation: {
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
            cin: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: Tenant, // référence à la table Tenant
                    key: "cin"     // clé primaire dans Tenant
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },

            codeLand: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Land,  // référence à la table Land
                    key: "codeLand" // clé primaire dans Land
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },

            usage: {
                type: DataTypes.STRING,
            },
            typePayment: {
                type: DataTypes.STRING,
            },
            methodPayment: {
                type: DataTypes.STRING,
            },
            placePaymment: {
                type: DataTypes.STRING,
            },
            areaLandBare: {
                type: DataTypes.INTEGER,
            },
            areaWood: {
                type: DataTypes.INTEGER,
            },
            areaPermanent: {
                type: DataTypes.INTEGER,
            },
            priceLandBare: {
                type: DataTypes.INTEGER,
            },
            priceWood: {
                type: DataTypes.INTEGER,
            },
            pricePermanent: {
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            tableName: "locations",
            timestamps: false, // si tu ne veux pas de createdAt/updatedAt automatiques
        }
    )
}