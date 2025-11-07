import { DataTypes, Model, Sequelize } from "sequelize";

//Ity interface ity dia ampiasaina mba i-typena anle donnees anle modele
// ny '?' dia midika fa optionnel
export interface IUser {
    matricule: string;
    poste: "Admin" | "Caissier" | "Operateur de saisie";
    email: string;
    password: string;
    createdAt?: Date;
}
//On cree la class User qui herite de l'interface IUser
export class User extends Model<IUser> implements IUser {
    public matricule!: string;
    public poste!: "Admin" | "Caissier" | "Operateur de saisie";
    public email!: string;
    public password!: string;
    public createdAt?: Date;
}

export const initUser = (sequelize: Sequelize) => {
    User.init(
        {
            matricule: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            poste: {
                type: DataTypes.ENUM("Admin", "Caissier", "Operateur de saisie"),
                allowNull: false,
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
