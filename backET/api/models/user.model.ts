import { DataTypes, Model, Sequelize } from "sequelize";

// Interface pour typer les données du modèle
export interface IUser {
<<<<<<< HEAD
    matricule: string;
    poste: "Admin" | "Caissier" | "Operateur de saisie";
=======
    matricule: string; // PK
>>>>>>> 2c69140 (Nety ilay login aoha)
    email: string;
    poste: "operateur de saisie" | "admin" | "caissier"; // tu peux limiter les valeurs possibles
    password: string;
    createdAt?: Date;
}
<<<<<<< HEAD
//On cree la class User qui herite de l'interface IUser
export class User extends Model<IUser> implements IUser {
    public matricule!: string;
    public poste!: "Admin" | "Caissier" | "Operateur de saisie";
    public email!: string;
    public password!: string;
    public createdAt?: Date;
}
=======

// Classe User qui hérite de l'interface IUser
export class User extends Model<IUser> {}
>>>>>>> 2c69140 (Nety ilay login aoha)

export const initUser = (sequelize: Sequelize) => {
    User.init(
        {
            matricule: {
                type: DataTypes.STRING,
                primaryKey: true,
<<<<<<< HEAD
                allowNull: false
            },
            poste: {
                type: DataTypes.ENUM("Admin", "Caissier", "Operateur de saisie"),
=======
>>>>>>> 2c69140 (Nety ilay login aoha)
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            poste: {
                type: DataTypes.ENUM("operateur de saisie", "admin", "caissier"),
                allowNull: false,
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
            timestamps: false, // pas de createdAt/updatedAt automatiques
        }
    );
};
