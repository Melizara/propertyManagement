// models/activityLog.model.ts
import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./user.model.ts";

export interface IActivityLog {
  id?: number;
  userMatricule: string;
  action: string;
  entity: string;        // exemple : "Price", "User", etc.
  entityId?: string;     // id de l'élément concerné
  timestamp?: Date;
}

export class ActivityLog extends Model<IActivityLog> {}

export const initActivityLog = (sequelize: Sequelize) => {
  ActivityLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userMatricule: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: User,
          key: "matricule",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entityId: {
        type: DataTypes.STRING,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "activity_logs",
      timestamps: false,
    }
  );
};
