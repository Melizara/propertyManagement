import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./user.model.ts";

export interface ITenant {
    name: string;
    lastName: string;
    birthDate: Date;
    birthPlace: string;
    cin: string;
    cinPlace: string;
    dateCin: Date;
    father: string;
    mother: string;
    address: string;
    neighborHood: string;
    municipality: string;
    userMatricule:string;
}

export class Tenant extends Model<ITenant> {
    declare name: string;
    declare lastName: string;
    declare birthDate: Date;
    declare birthPlace: string;
    declare father: string;
    declare mother: string;
    declare cin: string;
    declare dateCin: Date;
    declare cinPlace: string;
    declare address: string;
    declare neighborHood: string;
    declare municipality: string;
    declare userMatricule:string;
}


export const initTenant = (sequelize: Sequelize) => {
    Tenant.init(
        {
            name:{
                type:DataTypes.STRING,
                allowNull:false
            },
            lastName:{
                type:DataTypes.STRING,
                allowNull:false
            },
            birthDate:{
                type:DataTypes.DATEONLY,
                allowNull:false
            },
            birthPlace:{
                type:DataTypes.STRING,
                allowNull:false
            },
            cin: {
                type: DataTypes.STRING(12),
                primaryKey: true,
                allowNull:false
            },
            cinPlace:{
                type:DataTypes.STRING,
                allowNull:false
            },
            dateCin:{
                type:DataTypes.DATEONLY,
                allowNull:false
            },
            father:{
                type:DataTypes.STRING,
                allowNull:false
            },
            mother:{
                type:DataTypes.STRING,
                allowNull:false
            },
            address:{
                type:DataTypes.STRING,
                allowNull:false
            },
            neighborHood:{
                type:DataTypes.STRING,
                allowNull:false
            },
            municipality:{
                type:DataTypes.STRING,
                allowNull:false
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
            tableName:"tenants",
            timestamps:false,
        }
    )
}